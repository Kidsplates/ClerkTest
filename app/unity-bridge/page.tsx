'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

function isUnityWebView(): boolean {
  if (typeof window === 'undefined') return false;
  const w = window as any;
  const ua = (navigator.userAgent || '').toLowerCase();
  // Vuplex / Windows WebView / iOS WKWebView / Android webview などを緩く検出
  return (
    /vuplex|unity|webview/.test(ua) ||
    !!w.chrome?.webview ||                      // Edge WebView2
    !!w.webkit?.messageHandlers ||              // iOS
    !!w.Unity                                  // Unity が置くグローバル（あれば）
  );
}

export default function UnityBridge() {
  const router = useRouter();
  const sp = useSearchParams();
  const { isSignedIn, getToken } = useAuth();

  // フォールバック先（なければ /user にする）
  const fallback = sp.get('fallback') ?? '/user';

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // サインイン済みでないなら sign-in に戻す
      if (!isSignedIn) {
        if (!cancelled) router.replace('/sign-in');
        return;
      }

      // Unity でなければ、即フォールバックに進む（ブラウザ単体で止まらない）
      if (!isUnityWebView()) {
        if (!cancelled) router.replace(fallback);
        return;
      }

      // --- ここから Unity WebView 専用フロー ---
      try {
        // 必要なら Clerk のセッショントークンを取得して Unity へ postMessage
        const token = await getToken({ template: undefined }).catch(() => null);
        const payload = { type: 'clerk:signin:complete', token };

        // 代表的なブリッジに送る（環境に応じてどれかが届く）
        const w: any = window;
        try { w.chrome?.webview?.postMessage(payload); } catch {}
        try { w.webkit?.messageHandlers?.unityControl?.postMessage(payload); } catch {}
        try { w.parent?.postMessage(payload, '*'); } catch {}

        // 少し待って（Unity 側で処理させて）フォールバックへ
        setTimeout(() => {
          if (!cancelled) router.replace(fallback);
        }, 300);
      } catch {
        if (!cancelled) router.replace(fallback);
      }
    })();

    return () => { cancelled = true; };
  }, [isSignedIn, getToken, router, fallback]);

  return (
    <div style={{ padding: 24 }}>
      <p>Finishing sign-in…</p>
      <p style={{ opacity: 0.6, fontSize: 12 }}>
        If this takes long, <a href={fallback}>continue</a>.
      </p>
    </div>
  );
}

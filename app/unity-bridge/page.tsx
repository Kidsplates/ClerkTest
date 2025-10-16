// /app/unity-bridge/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useSession, useUser } from '@clerk/nextjs';

export default function UnityBridgePage() {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn, getToken } = useAuth();
  const { isLoaded: sessLoaded, session } = useSession();
  const { isLoaded: userLoaded, user } = useUser();

  useEffect(() => {
    if (!authLoaded || !sessLoaded || !userLoaded) return;

    (async () => {
      // 1) Clerkサインイン完了待ち
      for (let i = 0; i < 30 && !isSignedIn; i++) {
        await new Promise(r => setTimeout(r, 100));
      }

      // 2) JWT (template: 'unity') を数回リトライ取得
      let token: string | null = null;
      for (let i = 0; i < 6; i++) {
        try {
          token = (await getToken?.({ template: 'unity' })) ?? null;
          if (token) break;
        } catch {}
        await new Promise(r => setTimeout(r, 250));
      }

      // 3) Unityに渡す最小プロフィール（即時UI反映用）
      const profile = user
        ? {
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? '',
            username: user.username ?? '',
            plan: (user.publicMetadata?.plan as string) ?? 'free',
            points: (user.publicMetadata?.points as number) ?? 0,
          }
        : null;

      const payload = {
        type: 'clerk:signin:complete' as const,
        token: token ?? null,                    // Bearer 用（nullでもOK）
        sessionId: session?.id ?? null,          // 保険
        user: profile,                           // これで即時UI更新できる
        timestamp: Date.now(),
        source: 'unity-bridge',
      };

      const w = window as any;
      if (w.vuplex?.postMessage) w.vuplex.postMessage(payload);
      else if (window.chrome?.webview?.postMessage) window.chrome.webview.postMessage(payload);
      else if (window.webkit?.messageHandlers?.unityControl?.postMessage) window.webkit.messageHandlers.unityControl.postMessage(payload);
      else if (window.parent) window.parent.postMessage(payload as any, '*');

      await new Promise(r => setTimeout(r, 1000));
      router.replace('/user');
    })();
  }, [authLoaded, sessLoaded, userLoaded, isSignedIn, getToken, session, user, router]);

  return <main style={{ textAlign: 'center', marginTop: '30vh' }}>Finishing sign-in…</main>;
}

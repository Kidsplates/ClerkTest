'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClerk, useAuth } from '@clerk/nextjs';

// Next.js 側でキャッシュしない（開くたび実行）
export const dynamic = 'force-dynamic';

export default function UnityLogin() {
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const sp = useSearchParams();

  // Unity から渡したい遷移先（Unity ブリッジ）をクエリで受ける
  const redirect = sp.get('redirect') ?? '/unity-bridge';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 既存セッションがあればまずサインアウト
        if (isSignedIn) {
          // redirectUrl を指定しないことで、実行後に自分で遷移を制御
          await signOut({ redirectUrl: undefined });
        }
      } catch {}
      if (!cancelled) {
        router.replace(`/sign-in?redirect_url=${encodeURIComponent(redirect)}`);
      }
    })();
    return () => { cancelled = true; };
  }, [isSignedIn, signOut, router, redirect]);

  // 画面は空でOK（WebViewにはすぐ /sign-in が出る）
  return null;
}

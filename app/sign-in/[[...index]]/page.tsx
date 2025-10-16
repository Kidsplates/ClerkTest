'use client';
import { SignIn } from '@clerk/nextjs';

// サインイン画面は都度クライアントで描画
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
      <SignIn
        // 旧 redirectUrl は非推奨。こちらを使う
        fallbackRedirectUrl="/unity-bridge"
        // afterSignInUrl などを使う場合は ↓ を併用可
        // afterSignInUrl="/unity-bridge"
      />
    </div>
  );
}

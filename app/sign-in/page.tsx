"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main style={{ padding: 20, textAlign: "center" }}>
      {/* ← 戻る */}
      <div style={{ maxWidth: 600, margin: "0 auto 16px", textAlign: "left" }}>
        <button onClick={() => router.back()} style={{ padding: "6px 10px" }}>
          ← 戻る
        </button>
      </div>

      {/* Clerk のサインイン本体 */}
      <SignIn path="/sign-in" routing="path" afterSignInUrl="/user" />

      {/* パスワードを忘れた */}
      <div style={{ marginTop: 12 }}>
        <Link href="/forgot-password">パスワードをお忘れですか？</Link>
      </div>

      {/* 補助リンク */}
      <div style={{ marginTop: 8 }}>
        <small>
          アカウント未作成？ <Link href="/sign-up">サインアップ</Link>
        </small>
      </div>
    </main>
  );
}

"use client";

import { SignUp } from "@clerk/nextjs";
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

      {/* Clerk のサインアップ本体 */}
      <SignUp path="/sign-up" routing="path" afterSignUpUrl="/user" />

      {/* 補助リンク */}
      <div style={{ marginTop: 12 }}>
        既にアカウントがありますか？ <Link href="/sign-in">ログイン</Link>
      </div>
    </main>
  );
}

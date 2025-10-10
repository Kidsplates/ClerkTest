"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 20, textAlign: "center" }}>
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" afterSignInUrl="/user" />
      <div style={{ marginTop: 16 }}>
        {/* ← 自前で導線を出す */}
        <small>
          パスワードを忘れた？ <Link href="/forgot-password">こちらから再設定</Link>
        </small>
      </div>
    </main>
  );
}

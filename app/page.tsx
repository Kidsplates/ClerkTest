// app/page.tsx
"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Page() {
  // 環境変数で表示可否を切り替え（未設定 or "false" なら非表示）
  const showPageTitle =
    (process.env.NEXT_PUBLIC_SHOW_PAGE_TITLE ?? "").toLowerCase() === "true";

  return (
    <main style={{ padding: 20, textAlign: "left" }}>
      {/* 必要なら表示。不要なら環境変数で消せます */}
      {showPageTitle && <h2>テストページ</h2>}

      <p>トップページです。</p>

      <SignedOut>
        <p style={{ marginTop: 12 }}>
          <Link href="/sign-in">ログイン</Link>
          {"  "}
          <Link href="/sign-up">サインアップ</Link>
        </p>
      </SignedOut>

      <SignedIn>
        <p style={{ marginTop: 12 }}>
          <Link href="/user">マイページへ</Link>
        </p>
      </SignedIn>
    </main>
  );
}

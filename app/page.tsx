"use client";

import { SignedOut, SignedIn, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h2>Auth Minimal</h2>
      <p>トップページです。</p>

      <SignedOut>
        {/* モーダルで確実に UI を表示させる */}
        <div style={{ display: "flex", gap: 16 }}>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </div>
      </SignedOut>

      <SignedIn>
        <Link href="/user">マイページへ</Link>
      </SignedIn>
    </main>
  );
}

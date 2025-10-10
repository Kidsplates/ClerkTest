// app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Minimal",
  description: "Clerk x Next.js minimal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
          {/* ここが新しく追加したヘッダー部分 */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Auth Minimal</h1>
            <SignedIn>
              {/* ログイン中だけ表示されるユーザーボタン */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>

          {/* ページのメインコンテンツ */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

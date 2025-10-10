import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Header from "@/components/Header"; // ← 追加

export const metadata: Metadata = {
  title: "Auth Minimal",
  description: "Clerk x Next.js minimal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
          <Header />         {/* ← Client Component をサーバーレイアウトから呼ぶ */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

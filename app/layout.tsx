import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import Header from "@/components/Header"; // ← 追加

export const metadata: Metadata = {
  title: "Auth Minimal",
  description: "Clerk x Next.js minimal",
};

import RouteLoader from "@/components/RouteLoader";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
          <Header />
          <RouteLoader /> {/* ← 常駐ローディング */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

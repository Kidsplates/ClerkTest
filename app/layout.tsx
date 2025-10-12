// app/layout.tsx
import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Auth Minimal</h1>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>

          {/* ここで全ページを Suspense 包囲 */}
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}

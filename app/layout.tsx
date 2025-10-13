// app/layout.tsx
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Suspense } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="ja">
        <body style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h1>Auth Minimal</h1>

            <div style={{ display: "flex", gap: 8 }}>
              <SignedOut>
                <SignInButton mode="modal">ログイン</SignInButton>
                <SignUpButton mode="modal">サインアップ</SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>

          <Suspense fallback={null}>{children}</Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}

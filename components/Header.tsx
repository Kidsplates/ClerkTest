// components/Header.tsx
"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1>Auth Minimal</h1>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </header>
  );
}

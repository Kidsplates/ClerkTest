"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <button
        onClick={() => router.push("/")}
        style={{
          background: "none",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
          marginBottom: "16px"
        }}
      >
        ← 戻る
      </button>
      <SignIn signUpUrl="/sign-up" afterSignInUrl="/user" />
    </main>
  );
}

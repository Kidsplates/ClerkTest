"use client";

export default function EnvPage() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>/env</h1>
      <p>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</p>
      <pre>{key ?? "MISSING"}</pre>
    </main>
  );
}

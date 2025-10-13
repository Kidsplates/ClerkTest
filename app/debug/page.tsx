// app/debug/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default async function DebugPage() {
  const serverAuth = await auth();
  const user = await currentUser();

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", fontFamily: "monospace" }}>
      <h1>/debug</h1>

      <h2>Server (auth/currentUser)</h2>
      <pre>{JSON.stringify(serverAuth, null, 2)}</pre>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h2>Client (SignedIn/SignedOut)</h2>
      <SignedIn>
        <p>SignedIn ✅</p>
        <UserButton />
        <ClientBlock />
      </SignedIn>
      <SignedOut>
        <p>SignedOut ❌</p>
      </SignedOut>
    </main>
  );
}

function ClientBlock() {
  const { user } = useUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

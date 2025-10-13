// app/user/page.tsx  （Server Component）
import { currentUser } from "@clerk/nextjs/server";

export default async function UserPage() {
  const user = await currentUser(); // 認証OKなら必ず入る

  return (
    <main style={{ padding: 24 }}>
      <h2>マイページ</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}

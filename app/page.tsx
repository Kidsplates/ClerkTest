// app/page.tsx（Server Component）
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/user");  // ログイン済みは即マイページへ

  return (
    <main style={{ padding: 24 }}>
      <h2>Auth Minimal</h2>
      <p>トップページです。</p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link href="/sign-in">ログイン</Link>
        <Link href="/sign-up">サインアップ</Link>
      </div>
    </main>
  );
}

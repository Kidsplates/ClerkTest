import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/user");

  return (
    <main style={{ maxWidth: 720, margin: "40px auto" }}>
      <h2>Auth Minimal</h2>
      <p>トップページです。</p>
      <p>
        <Link href="/sign-in">ログイン</Link>・<Link href="/sign-up">サインアップ</Link>
      </p>
    </main>
  );
}

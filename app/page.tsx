// app/page.tsx
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  // 既にログインしているならマイページへ
  if (user) redirect("/user");

  // 未ログインなら選択画面を表示（自動リダイレクトしない）
  return (
    <main>
      <h1>Auth Minimal</h1>
      <p style={{ margin: "12px 0" }}>
        どちらかを選んでください：
      </p>
      <p>
        <Link href="/sign-in">ログイン</Link> / <Link href="/sign-up">アカウント作成</Link>
      </p>
      <hr />
      <small>※ パスワード再発行はサインイン画面の「Forgot password?」から。</small>
    </main>
  );
}

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <h1>Auth Minimal</h1>

      <SignedOut>
        <p><Link href="/sign-in">ログイン</Link> / <Link href="/sign-up">アカウント作成</Link></p>
      </SignedOut>

      <SignedIn>
        <p>ログイン中 <UserButton afterSignOutUrl="/" /></p>
        <p><Link href="/user">マイページ</Link></p>
      </SignedIn>

      <hr />
      <p>※ パスワード再発行はサインイン画面の「Forgot password?」から。</p>
    </main>
  );
}
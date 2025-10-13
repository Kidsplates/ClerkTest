import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  let user = null as Awaited<ReturnType<typeof currentUser>> | null;

  try {
    user = await currentUser();
  } catch (e) {
    console.error("currentUser() failed on server:", e);
    return (
      <main style={{maxWidth:720,margin:"40px auto"}}>
        <h1>マイページ</h1>
        <p>サーバー側でユーザー取得に失敗しました。環境変数 `CLERK_SECRET_KEY` とドメイン設定を確認してください。</p>
      </main>
    );
  }

  if (!user) redirect("/sign-in");

  // …以降は今の表示ロジックでOK
}

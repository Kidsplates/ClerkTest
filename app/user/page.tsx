import { currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";

export default async function UserPage() {
  const user = await currentUser();
  return (
    <main>
      <h2>マイアカウント</h2>
      <UserProfile />
      <hr />
      <h3>デバッグ用：ユーザー情報</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  );
}

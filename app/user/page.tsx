// app/user/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import UserPageClient from "./UserPageClient";
const PLANS = ["free", "plus", "pro"] as const;
export type PlanId = typeof PLANS[number];

export default async function Page() {
  const user = await currentUser();

  // 未ログインはサインインへ誘導（ミドルウェアが守っていれば到達しない想定）
  if (!user) {
    return (
      <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
        <h2>マイページ</h2>
        <p>ログインが必要です。</p>
      </main>
    );
  }

  const email =
    user.emailAddresses?.[0]?.emailAddress ??
    user.primaryEmailAddress?.emailAddress ??
    "";

  const username = user.username ?? "";
  const plan = (user.publicMetadata?.plan as PlanId | undefined) ?? "free";

  return (
    <UserPageClient
      userId={user.id}
      email={email}
      initialUsername={username}
      initialPlan={plan}
      plans={PLANS as unknown as PlanId[]}
    />
  );
}

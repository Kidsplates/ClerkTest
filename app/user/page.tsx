import { currentUser } from "@clerk/nextjs/server";
import UserDashboard from "./UserDashboard";

export default async function Page() {
  const user = await currentUser();
  if (!user) return <div className="p-8 text-center">ログインしてください。</div>;

  const plan = (user.publicMetadata?.plan as "free" | "plus" | "pro") ?? "free";
  const points = (user.publicMetadata?.points as number) ?? 0;

  return (
    <UserDashboard
      user={{
        username: user.username ?? null,
        emailAddresses: user.emailAddresses.map(e => ({ emailAddress: e.emailAddress })),
      }}
      plan={plan}
      points={points}
    />
  );
}

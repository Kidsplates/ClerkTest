import { currentUser } from "@clerk/nextjs/server";
import PlanChooser from "./plan-chooser";

const PLANS = {
  free: 0,
  plus: 980,
  pro: 1980,
} as const;

export default async function UserPage() {
  const user = await currentUser();
  if (!user) return null;

  const plan = (user.publicMetadata?.plan as keyof typeof PLANS) || "free";

  return (
    <main style={{ maxWidth: 720, margin: "40px auto" }}>
      <h2>マイページ</h2>
      <p>ログイン中: {user.emailAddresses?.[0]?.emailAddress ?? "—"}</p>
      <p>
        現在のプラン: <strong>{plan}</strong>
      </p>

      <div style={{ marginTop: 20 }}>
        <PlanChooser current={plan} />
      </div>

      <pre style={{ marginTop: 20, background: "#f6f6f6", padding: 12 }}>
        {JSON.stringify(
          {
            id: user.id,
            publicMetadata: user.publicMetadata,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}

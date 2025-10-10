import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const name = user.fullName ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  return (
    <main>
      <h2>マイページ</h2>
      <pre>
{JSON.stringify(
  {
    id: user.id,
    name,
    email: primaryEmail,
    username: user.username ?? "",
    createdAt: new Date(user.createdAt).toISOString(),
  },
  null,
  2
)}
      </pre>
    </main>
  );
}

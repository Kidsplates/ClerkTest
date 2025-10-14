import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = (auth() as unknown as { userId: string | null });
  if (!userId) return Response.json({ error: "未認証です" }, { status: 401 });

  const { username } = (await req.json()) as { username: string };

  const client: any =
    typeof (_clerkClient as any) === "function"
      ? await (_clerkClient as unknown as () => Promise<any>)()
      : (_clerkClient as any);

  await client.users.updateUser(userId, { username });

  return Response.json({ success: true });
}

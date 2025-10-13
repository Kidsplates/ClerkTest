import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { plan } = (await req.json()) as { plan?: "free" | "plus" | "pro" };
  if (!plan || !["free", "plus", "pro"].includes(plan))
    return Response.json({ error: "bad plan" }, { status: 400 });

  // ★ ここがポイント
  const cc = await clerkClient();
  await cc.users.updateUserMetadata(userId, {
    publicMetadata: { plan },
  });

  return Response.json({ ok: true });
}

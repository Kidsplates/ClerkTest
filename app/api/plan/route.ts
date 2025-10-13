const PLANS = ["free", "plus", "pro"] as const;
type Plan = (typeof PLANS)[number];

export async function POST(req: Request) {
  const mod = await import("@clerk/nextjs/server");

  type _AuthLike = () => { userId: string | null };
  const _auth = mod.auth as unknown as _AuthLike;
  const { userId } = _auth();
  if (!userId) return new Response("unauthorized", { status: 401 });

  const { plan } = (await req.json()) as { plan?: string };
  if (!plan || !PLANS.includes(plan as Plan)) {
    return Response.json({ ok: false, error: "invalid_plan" }, { status: 400 });
  }

  // ★ ここも同様にキャスト
  const clerk = mod.clerkClient as unknown as {
    users: { updateUserMetadata: (id: string, data: any) => Promise<unknown> };
  };

  await clerk.users.updateUserMetadata(userId, { publicMetadata: { plan } });

  return Response.json({ ok: true, plan });
}

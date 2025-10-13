export async function POST(req: Request) {
  const mod = await import("@clerk/nextjs/server");

  // auth は userId だけ取れればよいので簡易型を当てる
  type _AuthLike = () => { userId: string | null };
  const _auth = mod.auth as unknown as _AuthLike;
  const { userId } = _auth();
  if (!userId) return new Response("unauthorized", { status: 401 });

  const { username } = (await req.json()) as { username?: string };
  const value = (username ?? "").trim();
  if (value.length < 3) {
    return new Response(JSON.stringify({ ok: false, error: "username_required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // ★ clerkClient の型を any 相当にキャストして TS を黙らせる
  const clerk = mod.clerkClient as unknown as {
    users: { updateUser: (id: string, data: { username?: string }) => Promise<unknown> };
  };

  await clerk.users.updateUser(userId, { username: value });

  return Response.json({ ok: true, username: value });
}

// app/api/whoami/route.ts
export async function GET() {
  // 動的 import で v5 環境差を回避
  const mod = await import("@clerk/nextjs/server");

  // auth は userId だけ使うので簡易型
  type _AuthLike = () => { userId: string | null };
  const _auth = mod.auth as unknown as _AuthLike;

  const { userId } = _auth();
  if (!userId) {
    return Response.json({ id: null, publicMetadata: {}, username: null, email: null });
  }

  // clerkClient の型は any 相当にキャストして TS を黙らせる
  const clerk = mod.clerkClient as unknown as {
    users: { getUser: (id: string) => Promise<any> };
  };

  const user = await clerk.users.getUser(userId);

  return Response.json({
    id: userId,
    publicMetadata: user?.publicMetadata ?? {},
    username: user?.username ?? null,
    email:
      user?.emailAddresses?.[0]?.emailAddress ??
      user?.primaryEmailAddress?.emailAddress ??
      null,
  });
}

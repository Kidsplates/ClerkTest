// app/api/unity/me/route.ts
export const runtime = "nodejs";

function cors(h: HeadersInit = {}) {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, content-type",
    ...h,
  };
}

export async function OPTIONS() {
  return new Response(null, { headers: cors() });
}

export async function GET() {
  // ← 動的に import
  const { auth, clerkClient } = await import("@clerk/nextjs/server");

  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401, headers: cors() });

  // ← 関数を “呼ぶ” のがポイント
  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const email = user.emailAddresses?.[0]?.emailAddress ?? null;
  const username = user.username ?? user.firstName ?? null;
  const plan = (user.publicMetadata?.plan as string) ?? "free";
  const points = Number((user.publicMetadata as any)?.points ?? 0);

  return Response.json({ userId, email, username, plan, points }, { headers: cors() });
}

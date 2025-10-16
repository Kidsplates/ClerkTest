// app/api/unity/me/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
export const runtime = "nodejs";

function cors(headers: HeadersInit = {}) {
  return { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, content-type", ...headers };
}
export async function OPTIONS() { return new Response(null, { headers: cors() }); }

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401, headers: cors() });

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses?.[0]?.emailAddress ?? null;
  const username = user.username ?? user.firstName ?? null;
  const plan = (user.publicMetadata?.plan as string) ?? "free";
  const points = Number((user.publicMetadata?.points as any) ?? 0);

  return Response.json({ userId, email, username, plan, points }, { headers: cors() });
}

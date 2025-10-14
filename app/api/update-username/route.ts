// app/api/update-username/route.ts
// @ts-nocheck
import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = (await (auth() as any)) || {};
    if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

    const { username } = await req.json();
    const client = typeof _clerkClient === "function" ? await (_clerkClient as any)() : (_clerkClient as any);

    const r = await client.users.updateUser(userId, { username });
    return Response.json({ success: true, user: { id: r.id, username: r.username } });
  } catch (e: any) {
    const message = e?.errors?.[0]?.message || e?.message || "server-error";
    return Response.json({ error: message }, { status: e?.status || 500 });
  }
}

// app/api/update-plan/route.ts
// @ts-nocheck
import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { userId } = (await (auth() as any)) || {};
    if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

    const { plan } = await req.json(); // "free" | "plus" | "pro"
    const client = typeof _clerkClient === "function" ? await (_clerkClient as any)() : (_clerkClient as any);

    const r = await client.users.updateUserMetadata(userId, { publicMetadata: { plan } });
    return Response.json({ success: true, publicMetadata: r.publicMetadata });
  } catch (e: any) {
    const message = e?.errors?.[0]?.message || e?.message || "server-error";
    return Response.json({ error: message }, { status: e?.status || 500 });
  }
}

// app/api/user/username/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { username } = (await req.json()) as { username?: string };

  const value = (username ?? "").trim();

  // 簡単なバリデーション（必要なら調整）
  if (!value || value.length < 3 || value.length > 32 || !/^[a-zA-Z0-9._-]+$/.test(value)) {
    return Response.json(
      { error: "invalid_username" },
      { status: 400 }
    );
  }

  try {
    await (await clerkClient()).users.updateUser(userId, { username: value });
    return Response.json({ ok: true });
  } catch (e: any) {
    // すでに使われている等
    const msg = e?.errors?.[0]?.message ?? "update_failed";
    const status = e?.status || 500;
    return Response.json({ error: msg }, { status });
  }
}

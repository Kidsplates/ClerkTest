// app/api/user/username/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { username } = (await req.json()) as { username?: string };
  const value = (username ?? "").trim();

  // ここでは長さだけ軽く見る（Clerkの既定は最大32。運用に合わせて調整）
  if (!value || value.length < 1 || value.length > 32) {
    return Response.json({ error: "1〜32文字で入力してください" }, { status: 400 });
  }

  try {
    // 最新の Clerk では clerkClient() が Promise を返す実装です
    const client = await clerkClient();
    await client.users.updateUser(userId, { username: value });
    return Response.json({ ok: true });
  } catch (e: any) {
    const err =
      e?.errors?.[0]?.longMessage ||
      e?.errors?.[0]?.message ||
      e?.message ||
      "update_failed";
    const status = e?.status || 400;
    return Response.json({ error: err }, { status });
  }
}

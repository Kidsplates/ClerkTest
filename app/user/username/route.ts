import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

export async function POST(req: Request) {
  // 認証情報を取得（v5ではawaitが必要）
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  // リクエストボディを取得
  const { username } = (await req.json()) as { username?: string };
  const value = (username ?? "").trim();
  if (value.length < 3 || value.length > 32) {
    return Response.json({ error: "invalid_length" }, { status: 400 });
  }

  // Clerkクライアントを生成
  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  try {
    // ユーザー名を更新
    const updatedUser = await clerkClient.users.updateUser(userId, {
      username: value,
    });
    return Response.json({ ok: true, username: updatedUser.username });
  } catch (err: any) {
    const msg =
      err?.errors?.[0]?.message ||
      err?.message ||
      "update_failed";
    return Response.json({ error: msg }, { status: 400 });
  }
}

// ❌ これは消す
// import { clerkClient } from "@clerk/backend";

// ✅ こちらに戻す
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  // ✅ v5 は await が必須
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { username } = (await req.json()) as { username?: string };
  const value = (username ?? "").trim();

  // 3〜32 文字など、最低限のバリデーション
  if (value.length < 3 || value.length > 32) {
    return Response.json({ error: "invalid_length" }, { status: 400 });
  }

  try {
    // ✅ clerkClient は関数。await してから .users を使う
    const client = await clerkClient();
    await client.users.updateUser(userId, { username: value });
    return Response.json({ ok: true });
  } catch (e: any) {
    // Clerk 由来のエラーメッセージがあれば拾う
    const msg =
      e?.errors?.[0]?.message ??
      e?.message ??
      "update_failed";
    return Response.json({ error: msg }, { status: 400 });
  }
}

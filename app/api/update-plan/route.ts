import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";

type Plan = "free" | "plus" | "pro";

export async function POST(req: Request) {
  // v4 型を拾って Promise 扱いされている環境でも通すキャスト
  const { userId } = (auth() as unknown as { userId: string | null });
  if (!userId) return Response.json({ error: "未認証です" }, { status: 401 });

  const { plan } = (await req.json()) as { plan: Plan };

  // clerkClient が「関数だと認識される/Promise返す」場合にも対応
  const client: any =
    typeof (_clerkClient as any) === "function"
      ? await (_clerkClient as unknown as () => Promise<any>)()
      : (_clerkClient as any);

  await client.users.updateUserMetadata(userId, {
    publicMetadata: { plan },
  });

  return Response.json({ success: true });
}

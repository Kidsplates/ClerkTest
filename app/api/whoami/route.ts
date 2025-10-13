// app/api/whoami/route.ts
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"; // キャッシュ回避(任意)
// export const runtime = "edge"; // Edgeで動かしたいなら任意で

export async function GET() {
  const { userId } = await auth();   // ← await が必須！
  return Response.json({ userId });
}

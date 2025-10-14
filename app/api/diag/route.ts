// app/api/diag/route.ts
// @ts-nocheck
import { auth } from "@clerk/nextjs/server";
export const runtime = "nodejs";

export async function GET() {
  // ここは必ず値が取れる前提で動かす（型は無視）
  const { userId } = (await (auth() as any)) || {};
  return Response.json({
    userId: userId ?? null,
    hasSecret: !!process.env.CLERK_SECRET_KEY,
    hasPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });
}

// app/api/unity/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";

function toDto(user: any) {
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  return {
    userId: user?.id ?? null,
    email,
    username: user?.username ?? null,
    plan: user?.publicMetadata?.plan ?? "free",
    points: user?.publicMetadata?.points ?? 0,
  };
}

export async function GET(req: NextRequest) {
  // v4/v5 両対応
  const clerk =
    typeof _clerkClient === "function" ? await _clerkClient() : _clerkClient;

  // ---- 追加: Authorization(Bearer) 優先、次に既存ヘッダ群を見る ----
  const authz = req.headers.get("authorization") || "";
  const bearer = authz.startsWith("Bearer ") ? authz.slice(7) : "";

  // NextRequest の headers は小文字化される前提で、候補を網羅
  const sidFromHeaders =
    bearer ||
    req.headers.get("clerk_session") ||               // ← 推奨: Unity側でこれを送る
    req.headers.get("x-clerk-session") ||
    req.headers.get("clerk-session-id") ||
    req.headers.get("x-clerk-session-id") ||
    "";

  // 1) ヘッダでのセッション検証（Unity 経由）
  if (sidFromHeaders) {
    try {
      const sess = await clerk.sessions.getSession(sidFromHeaders);
      if (sess?.status === "active" && sess.userId) {
        const user = await clerk.users.getUser(sess.userId);
        return NextResponse.json(toDto(user), { status: 200 });
      }
      // 存在しても非アクティブは 401
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    } catch {
      // フォールバックへ
    }
  }

  // 2) Cookie ベース（ブラウザ直アクセス時の保険）
  try {
    const { userId } = await auth();
    if (userId) {
      const user = await clerk.users.getUser(userId);
      return NextResponse.json(toDto(user), { status: 200 });
    }
  } catch {
    // 何もしない（最後で401）
  }

  // 3) いずれも認証できなければ 401
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

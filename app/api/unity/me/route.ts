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
  // v4/v5 両対応で clerkClient を取得（v5は関数）
  const clerk =
    typeof _clerkClient === "function" ? await _clerkClient() : _clerkClient;

console.log("[/api/unity/me] headerSessionId=", 
  req.headers.get("x-clerk-session") ||
  req.headers.get("clerk-session-id") ||
  req.headers.get("x-clerk-session-id")
);

  // 1) Unity から送られるセッションID ヘッダを優先（header名は小文字で来る想定）
  const headerSessionId =
    req.headers.get("x-clerk-session") ||
    req.headers.get("clerk-session-id") ||
    req.headers.get("x-clerk-session-id");

  if (headerSessionId) {
    try {
      const sess = await clerk.sessions.getSession(headerSessionId);
      if (sess?.userId) {
        const user = await clerk.users.getUser(sess.userId);
        return NextResponse.json(toDto(user));
      }
    } catch {
      // 失敗したら cookie 認証にフォールバック
    }
  }

  // 2) Cookie ベース（ブラウザから直接叩いた時）
  const { userId } = await auth();
  if (userId) {
    const user = await clerk.users.getUser(userId);
    return NextResponse.json(toDto(user));
  }

  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

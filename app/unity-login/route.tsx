// app/unity-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient as _clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";

function nextUrl(req: NextRequest) {
  const u = new URL(req.url);
  // まず redirect_url を優先
  const fromRedirectUrl = u.searchParams.get("redirect_url");
  if (fromRedirectUrl) return fromRedirectUrl;

  // redirect が 'false' なら無視、それ以外なら採用
  const r = u.searchParams.get("redirect");
  if (r && r !== "false") return r;

  // どれも無ければ既定
  return "/unity-bridge";
}


async function handle(req: NextRequest) {
  // v4/v5 両対応で clerkClient を取得
  const clerk =
    typeof _clerkClient === "function" ? await _clerkClient() : _clerkClient;

  // 既存セッションがあれば失効（= 毎回サインイン画面を出す）
  const { sessionId } = await auth();
  if (sessionId) {
    try { await clerk.sessions.revokeSession(sessionId); } catch {}
  }

  // ✅ サインインへ 302（redirect_url のみを渡す）
  const target = `/sign-in?redirect_url=${encodeURIComponent(nextUrl(req))}`;
  return NextResponse.redirect(new URL(target, req.nextUrl));
}

export async function GET (req: NextRequest)  { return handle(req); }
export async function POST(req: NextRequest) { return handle(req); }

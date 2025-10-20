// middleware.ts（公開ルートに /api/unity/me を追加）
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unity-login(.*)",
  "/unity-bridge(.*)",
  "/api/unity/me",    // ← 追加！ Unity からの /me は公開にして自前で判定
]);

export default clerkMiddleware(async (authFn, req) => {
  if (isPublicRoute(req)) return;
  const a = await authFn();
  if (!a.userId) return a.redirectToSignIn();
});

export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)", "/(api|trpc)(.*)"],
};

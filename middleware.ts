// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 認証不要のルート
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
  auth.protect(); // ← auth() ではなく auth.protect()
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/unity-login(.*)",
  "/unity-bridge(.*)",
]);

export default clerkMiddleware(async (authFn, req) => {
  if (isPublicRoute(req)) return;
  const a = await authFn();
  if (!a.userId) return a.redirectToSignIn();
});

export const config = {
  matcher: ["/((?!_next/|.*\\..*).*)", "/(api|trpc)(.*)"],
};

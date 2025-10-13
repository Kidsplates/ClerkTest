export async function GET() {
  const mod = await import("@clerk/nextjs/server");
  const auth = mod.auth as unknown as () => { userId: string | null };

  return Response.json({
    hasPublishable: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    hasSecret: !!process.env.CLERK_SECRET_KEY,
    userId: auth().userId ?? null,
    node: process.version,
  });
}

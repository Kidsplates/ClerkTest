export async function GET() {
  const hasSecret = Boolean(process.env.CLERK_SECRET_KEY);
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.slice(0, 10) ?? null;
  return Response.json({ hasSecret, publishablePrefix: publishable });
}

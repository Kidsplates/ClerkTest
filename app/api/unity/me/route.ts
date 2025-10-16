// /app/api/unity/me/route.ts
export const runtime = 'nodejs';        // ← 念のためEdge回避
export const dynamic = 'force-dynamic'; // ← devでもキャッシュさせない

import { NextResponse } from 'next/server';
import { auth, verifyToken, clerkClient } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  const authz = req.headers.get('authorization') ?? req.headers.get('Authorization');
  const sessionHeader = req.headers.get('x-clerk-session') ?? req.headers.get('X-Clerk-Session');

  let jwt: string | null = null;
  if (authz?.startsWith('Bearer ')) jwt = authz.slice('Bearer '.length).trim();

  let userId: string | null = null;
  try {
    if (jwt) {
      const verified = await (verifyToken as any)(jwt, { template: 'unity' } as any);
      userId = (verified as any).sub ?? null;
    } else if (sessionHeader) {
      const clientMaybeFn = clerkClient as unknown as (() => Promise<any>) | any;
      const client = typeof clientMaybeFn === 'function' ? await clientMaybeFn() : clientMaybeFn;
      const sess = await client.sessions.getSession(sessionHeader);
      if (!sess || sess.status !== 'active') {
        return NextResponse.json({ error: 'session not active' }, { status: 401 });
      }
      userId = sess.userId ?? null;
    } else {
      const a = await auth(); // ブラウザ直叩きの保険
      userId = a?.userId ?? null;
    }
  } catch {
    return NextResponse.json({ error: 'invalid auth' }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const clientMaybeFn = clerkClient as unknown as (() => Promise<any>) | any;
  const client = typeof clientMaybeFn === 'function' ? await clientMaybeFn() : clientMaybeFn;
  const user = await client.users.getUser(userId);

  const email = user.emailAddresses?.[0]?.emailAddress ?? '';
  const username = user.username ?? '';
  const plan = (user.publicMetadata?.plan as string) ?? 'free';
  const points = (user.publicMetadata?.points as number) ?? 0;

  return NextResponse.json({ userId, email, username, plan, points });
}

import { headers } from "next/headers";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ← apiVersion を消す

export async function POST(req: Request) {
  const hdrs = await headers();  // ← await
  const sig = hdrs.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e) {
    console.error(e);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as "PLUS" | "PRO" | undefined;

    if (userId && plan) {
      const client = await clerkClient(); // ← 実体を取得
      await client.users.updateUser(userId, {
        publicMetadata: { plan },
      });
    }
  }

  return new Response("ok");
}

import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // ← apiVersion を消す

export async function POST(req: Request) {
  const { userId } = await auth();  // ← await 必須
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { plan } = await req.json() as { plan: "PLUS" | "PRO" | "FREE" };

  const prices: Record<"PLUS" | "PRO", string> = {
    PLUS: process.env.STRIPE_PRICE_ID_PLUS!,
    PRO:  process.env.STRIPE_PRICE_ID_PRO!,
  };
  if (plan === "FREE") {
    // FREEへのダウングレードは課金不要。直接マイページに戻すなど。
    return Response.json({ url: `${process.env.NEXT_PUBLIC_BASE_URL}/user?plan=free` });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: prices[plan], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user?canceled=true`,
    metadata: { userId, plan },
  });

  return Response.json({ url: session.url });
}

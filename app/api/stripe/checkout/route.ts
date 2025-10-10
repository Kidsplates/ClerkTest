import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type Plan = "FREE" | "PLUS" | "PRO";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // ← await 必須
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan: Plan };
    if (plan !== "FREE" && plan !== "PLUS" && plan !== "PRO") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // ✅ clerkClient() を await して実体を取得
    const client = await clerkClient();

    // v6 では updateUser を使って publicMetadata を更新
    await client.users.updateUser(userId, {
      publicMetadata: { plan },
    });

    return NextResponse.json({
      message: `Plan changed to ${plan}`,
      url: "/user?success=true",
    });
  } catch (e: any) {
    console.error("Mock plan change error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}

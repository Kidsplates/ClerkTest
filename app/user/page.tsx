"use client";

import { useUser } from "@clerk/nextjs";
import { PLANS, asPlanKey, PlanKey } from "@/lib/plans";
import { useState } from "react";

export default function UserPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const currentPlan: PlanKey = asPlanKey(user?.publicMetadata?.plan);

  async function handleUpgrade(planId: PlanKey) {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planId }),
    });
    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>マイページ</h2>
      <p>ログイン中: {user?.emailAddresses[0]?.emailAddress}</p>
      <p>現在のプラン: <strong>{PLANS[currentPlan].name}</strong></p>

      <div style={{ marginTop: 20 }}>
        {Object.values(PLANS).map((plan) => (
          <div key={plan.id} style={{ marginBottom: 12 }}>
            <span>{plan.name} - ¥{plan.price}</span>{" "}
            {plan.id === currentPlan ? (
              <button disabled>選択中</button>
            ) : (
              <button onClick={() => handleUpgrade(plan.id as PlanKey)} disabled={loading}>
                {plan.price > 0 ? "アップグレード" : "切り替え"}
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";

const PLANS: Record<string, number> = { free: 0, plus: 980, pro: 1980 };

export default function PlanChooser({ current }: { current: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const changePlan = async (plan: string) => {
    if (plan === current) return;
    setLoading(plan);
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    setLoading(null);
    if (res.ok) location.reload();
    else alert("変更に失敗しました");
  };

  return (
    <div>
      {Object.entries(PLANS).map(([id, price]) => (
        <div key={id} style={{ marginBottom: 12 }}>
          <span style={{ width: 120, display: "inline-block" }}>{id}</span>
          <span>¥{price}</span>{" "}
          {id === current ? (
            <button disabled>選択中</button>
          ) : (
            <button disabled={!!loading} onClick={() => changePlan(id)}>
              {price > 0 ? "アップグレード" : "切り替え"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

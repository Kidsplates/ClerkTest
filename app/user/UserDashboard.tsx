"use client";
import { useState } from "react";

type Plan = "free" | "plus" | "pro";
type MinimalUser = { username: string | null; emailAddresses: { emailAddress: string }[] };

interface Props { user: MinimalUser; plan: Plan; points: number; }

export default function UserDashboard({ user, plan, points }: Props) {
  const [username, setUsername] = useState<string>(user.username ?? "");
  const [currentPlan, setCurrentPlan] = useState<Plan>(plan);
  const [currentPoints] = useState<number>(points);
  const [saving, setSaving] = useState(false);

  const handleSaveUsername = async () => {
    setSaving(true);
    const res = await fetch("/api/update-username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setSaving(false);
    if (!res.ok) alert("ユーザー名の更新に失敗しました。");
  };

  const handleChangePlan = async (newPlan: Plan) => {
    setCurrentPlan(newPlan);
    const res = await fetch("/api/update-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: newPlan }),
    });
    if (!res.ok) alert("プラン更新に失敗しました。");
  };

  return (
    <div className="max-w-lg mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      <div>
        <label className="block mb-1 font-semibold">メールアドレス</label>
        <p>{user.emailAddresses[0]?.emailAddress ?? "-"}</p>
      </div>

      <div>
        <label className="block mb-1 font-semibold">ユーザー名</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded px-3 py-1 w-full"
        />
        <button
          onClick={handleSaveUsername}
          disabled={saving}
          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      <div>
        <label className="block mb-1 font-semibold">プラン</label>
        <div className="flex gap-2">
          {(["free", "plus", "pro"] as const).map((p) => (
            <button
              key={p}
              onClick={() => handleChangePlan(p)}
              className={`px-3 py-1 rounded ${currentPlan === p ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-semibold">ポイント</label>
        <p>{currentPoints}</p>
      </div>
    </div>
  );
}

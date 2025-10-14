// app/user/UserDashboard.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "free" | "plus" | "pro";
type MinimalUser = { username: string | null; emailAddresses: { emailAddress: string }[] };

interface Props { user: MinimalUser; plan: Plan; points: number; }

export default function UserDashboard({ user, plan, points }: Props) {
  const router = useRouter();

  const [username, setUsername] = useState<string>(user.username ?? "");
  const [currentPlan, setCurrentPlan] = useState<Plan>(plan);
  const [currentPoints] = useState<number>(points);
  const [saving, setSaving] = useState(false);

  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const show = (t: "success" | "error", msg: string) => {
    setNotice({ type: t, msg });
    setTimeout(() => setNotice(null), 2500);
  };

  const handleSaveUsername = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        show("error", `ユーザー名の更新に失敗: ${j?.error ?? res.statusText}`);
        return;
      }
      show("success", "ユーザー名を更新しました");
      router.refresh(); // /user（サーバ側）を再フェッチして「現在の値」を同期
    } catch (e: any) {
      show("error", "通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePlan = async (newPlan: Plan) => {
    try {
      setCurrentPlan(newPlan); // 楽観更新
      const res = await fetch("/api/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCurrentPlan(plan); // 失敗時は元に戻す
        show("error", `プラン更新に失敗: ${j?.error ?? res.statusText}`);
        return;
      }
      show("success", "プランを更新しました");
      router.refresh(); // サーバ側の「現在のプラン」表示を即反映
    } catch {
      setCurrentPlan(plan);
      show("error", "通信エラーが発生しました");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      {/* 現在値のサマリー */}
      <div className="rounded-lg border p-4 bg-gray-50">
        <div className="text-sm text-gray-600">現在のユーザー名</div>
        <div className="font-semibold">{user.username ?? "-"}</div>
        <div className="mt-2 text-sm text-gray-600">現在のプラン</div>
        <div className="font-semibold">{currentPlan}</div>
        <div className="mt-2 text-sm text-gray-600">ポイント</div>
        <div className="font-semibold">{currentPoints}</div>
      </div>

      {/* 通知バー */}
      {notice && (
        <div
          className={`rounded-md px-3 py-2 text-sm ${
            notice.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {notice.msg}
        </div>
      )}

      {/* ユーザー名の変更 */}
      <div>
        <label className="block mb-1 font-semibold">ユーザー名を変更</label>
        <div className="flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded px-3 py-1 w-full"
            placeholder="新しいユーザー名"
          />
          <button
            onClick={handleSaveUsername}
            disabled={saving || username.trim().length === 0}
            className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      {/* プランの変更 */}
      <div>
        <label className="block mb-1 font-semibold">プランを変更</label>
        <div className="flex gap-2">
          {(["free", "plus", "pro"] as const).map((p) => (
            <button
              key={p}
              onClick={() => handleChangePlan(p)}
              className={`px-3 py-1 rounded border ${
                currentPlan === p ? "bg-blue-600 text-white border-blue-600" : "bg-white"
              }`}
              aria-pressed={currentPlan === p}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

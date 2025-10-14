"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = "free" | "plus" | "pro";
type MinimalUser = { username: string | null; emailAddresses: { emailAddress: string }[] };

interface Props { user: MinimalUser; plan: Plan; points: number; }

export default function UserDashboard({ user, plan, points }: Props) {
  const router = useRouter();

  // 入力フォーム用の作業値（「現在値」とは分けて表示する）
  const [usernameInput, setUsernameInput] = useState<string>(user.username ?? "");
  const [saving, setSaving] = useState(false);
  const [changingPlan, setChangingPlan] = useState<Plan | null>(null);

  // 通知
  const [notice, setNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const show = (t: "success" | "error", msg: string) => {
    setNotice({ type: t, msg });
    setTimeout(() => setNotice(null), 2200);
  };

  const handleSaveUsername = async () => {
    try {
      setSaving(true);
      const res = await fetch("/api/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        show("error", `ユーザー名の更新に失敗：${j?.error ?? res.statusText}`);
        return;
      }
      show("success", "ユーザー名を更新しました");
      // サーバ値（現在値）を更新して上段の表示に反映
      router.refresh();
    } catch {
      show("error", "通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePlan = async (newPlan: Plan) => {
    try {
      setChangingPlan(newPlan);
      const res = await fetch("/api/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        show("error", `プラン更新に失敗：${j?.error ?? res.statusText}`);
        setChangingPlan(null);
        return;
      }
      show("success", "プランを更新しました");
      router.refresh(); // 現在値表示をサーバから取り直し
    } catch {
      show("error", "通信エラーが発生しました");
    } finally {
      setChangingPlan(null);
    }
  };

  const box: React.CSSProperties = { border: "1px solid #ddd", padding: 12, borderRadius: 8, background: "#f7f7f7" };
  const rowLabel: React.CSSProperties = { fontSize: 12, color: "#555" };
  const strong: React.CSSProperties = { fontWeight: 600 };

  const planBtn = (p: Plan) => {
    const isCurrent = p === plan; // ← 現在のプラン（propsのサーバ値）で判定
    return (
      <button
        key={p}
        onClick={() => handleChangePlan(p)}
        disabled={isCurrent || !!changingPlan}
        aria-pressed={isCurrent}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid " + (isCurrent ? "#2563eb" : "#bbb"),
          background: isCurrent ? "#2563eb" : "#fff",
          color: isCurrent ? "#fff" : "#000",
          fontWeight: isCurrent ? 700 : 400,
          cursor: isCurrent ? "default" : "pointer",
          opacity: changingPlan && changingPlan !== p ? 0.6 : 1,
        }}
      >
        {p}
        {isCurrent ? "（現在）" : ""}
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>マイページ</h1>

      {/* 現在の値（読み取り専用サマリー） */}
      <div style={box}>
        <div style={rowLabel}>現在のユーザー名</div>
        <div style={strong}>{user.username ?? "-"}</div>

        <div style={{ height: 8 }} />
        <div style={rowLabel}>現在のプラン</div>
        <div style={strong}>{plan}</div>

        <div style={{ height: 8 }} />
        <div style={rowLabel}>ポイント</div>
        <div style={strong}>{points}</div>
      </div>

      {/* 通知 */}
      {notice && (
        <div
          role="status"
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 8,
            background: notice.type === "success" ? "#dcfce7" : "#fee2e2",
            color: notice.type === "success" ? "#166534" : "#991b1b",
            border: "1px solid " + (notice.type === "success" ? "#86efac" : "#fecaca"),
          }}
        >
          {notice.msg}
        </div>
      )}

      {/* ユーザー名の変更（フォーム値と現在値を分けて表示） */}
      <div style={{ marginTop: 20 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>ユーザー名を変更</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            style={{ border: "1px solid #bbb", borderRadius: 6, padding: "6px 10px", flex: 1 }}
            placeholder="新しいユーザー名"
          />
          <button
            onClick={handleSaveUsername}
            disabled={saving || usernameInput.trim().length === 0}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: "#2563eb",
              color: "#fff",
              border: "1px solid #2563eb",
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "default" : "pointer",
              fontWeight: 600,
            }}
          >
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      {/* プランの変更（現在プランを強調＆無効化） */}
      <div style={{ marginTop: 20 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>プランを変更</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["free", "plus", "pro"] as const).map(planBtn)}
        </div>
      </div>
    </div>
  );
}

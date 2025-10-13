// app/user/UserPageClient.tsx
"use client";

import { useState, useTransition } from "react";
import type { PlanId } from "./page";

type Props = {
  userId: string;
  email: string;
  initialUsername: string;
  initialPlan: PlanId;
  plans: PlanId[];
};

// ✅ Next.js のリダイレクト例外を内部APIに頼らず判定
function isNextRedirect(e: unknown): e is { digest: string } {
  return !!(e && typeof e === "object" && "digest" in e);
}

export default function UserPageClient({
  userId,
  email,
  initialUsername,
  initialPlan,
  plans,
}: Props) {
  const [username, setUsername] = useState(initialUsername);
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [saving, startSaving] = useTransition();
  const [loadingPlan, startPlan] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function saveUsername() {
    setError(null);
    setMessage(null);

    startSaving(async () => {
      try {
        const res = await fetch("/api/user/username", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!res.ok) {
          const data = await safeJson(res);
          throw new Error(data?.error ?? res.statusText);
        }

        setMessage("ユーザー名を更新しました。");
        // 表示も即時反映
      } catch (e) {
        if (isNextRedirect(e)) throw e; // ← Next の内部リダイレクトは再throw
        setError((e as any)?.message ?? "unknown");
      }
    });
  }

  async function changePlan(next: PlanId) {
    if (next === plan) return;
    setError(null);
    setMessage(null);

    startPlan(async () => {
      try {
        // 無料へ戻す等の「即時反映」ルート
        if (next === "free") {
          const res = await fetch("/api/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: next }),
          });
          if (!res.ok) {
            const data = await safeJson(res);
            throw new Error(data?.error ?? res.statusText);
          }
          setPlan(next);
          setMessage("プランを free に変更しました。");
          return;
        }

        // plus / pro は Stripe チェックアウトへ
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: next }),
        });

        if (!res.ok) {
          const data = await safeJson(res);
          throw new Error(data?.error ?? res.statusText);
        }

        const data = await res.json();
        if (data?.url) {
          window.location.href = data.url;
          return;
        }
        throw new Error("決済URLを取得できませんでした。");
      } catch (e) {
        if (isNextRedirect(e)) throw e;
        setError((e as any)?.message ?? "unknown");
      }
    });
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>マイページ</h2>

      <p>ログイン中: {email}</p>
      <p>
        現在のプラン: <strong>{plan}</strong>
      </p>

      {/* プラン変更 */}
      <section style={{ marginTop: 24 }}>
        <h3>プラン変更</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {plans.map((p) => (
            <button
              key={p}
              onClick={() => changePlan(p)}
              disabled={loadingPlan || p === plan}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: p === plan ? "#eee" : "#fff",
                cursor: loadingPlan || p === plan ? "not-allowed" : "pointer",
              }}
              aria-label={`Change plan to ${p}`}
            >
              {p === plan ? `選択中: ${p}` : p}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
          free は即時反映、plus/pro は Stripe 決済に遷移します。
        </p>
      </section>

      {/* ユーザー名 */}
      <section style={{ marginTop: 32 }}>
        <h3>ユーザー名</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            style={{ flex: 1, padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
          />
          <button
            onClick={saveUsername}
            disabled={saving}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: saving ? "#eee" : "#fff",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            保存
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
          3–32 文字。英数字・「_」「-」が使用できます。重複は不可です。
        </p>
      </section>

      {/* メッセージ */}
      {message && (
        <p style={{ marginTop: 16, color: "#0a7f3f" }}>
          {message}
        </p>
      )}
      {error && (
        <p style={{ marginTop: 16, color: "#b00020", background: "#fdecec", padding: 8, borderRadius: 8 }}>
          更新に失敗: {error}
        </p>
      )}
    </main>
  );
}

// fetch の JSON 取り出しユーティリティ（失敗しても undefined 返す）
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

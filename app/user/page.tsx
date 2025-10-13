// app/user/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// --- クライアント: ユーザー名更新フォーム ---------------------
function UsernameForm() {
  "use client";
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("username") as HTMLInputElement;
    const username = input.value.trim();
    const res = await fetch("/user/username", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json().catch(() => ({}));
    alert(res.ok ? "ユーザー名を更新しました" : `更新に失敗: ${data?.error ?? "unknown"}`);
  };
  return (
    <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
      <input
        name="username"
        placeholder="ユーザー名"
        style={{ padding: 8, border: "1px solid #bbb", borderRadius: 6, width: 280 }}
      />
      <button type="submit" style={{ marginLeft: 8, padding: "8px 14px" }}>
        保存
      </button>
      <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
        3–32 文字。英数字・「_」「-」が使用できます。重複は不可です。
      </div>
    </form>
  );
}

// --- クライアント: プラン切替ボタン ---------------------------
function PlanChooser({ current }: { current: string }) {
  "use client";
  const setPlan = async (plan: "free" | "plus" | "pro") => {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json().catch(() => ({}));
    alert(res.ok ? `プランを ${plan} に更新しました` : `更新に失敗: ${data?.error ?? "unknown"}`);
  };
  const Btn = (p: "free" | "plus" | "pro") => (
    <button
      key={p}
      onClick={() => setPlan(p)}
      style={{
        marginRight: 8,
        padding: "6px 12px",
        border: "1px solid #bbb",
        borderRadius: 6,
        background: current === p ? "#eee" : "white",
      }}
    >
      {p}
    </button>
  );
  return (
    <div style={{ marginTop: 8 }}>
      <span style={{ marginRight: 8 }}>選択中: {current}</span>
      {Btn("free")}
      {Btn("plus")}
      {Btn("pro")}
      <div style={{ marginTop: 6, color: "#666", fontSize: 12 }}>
        free は即時反映、plus/pro は Stripe 決済に遷移します。
      </div>
    </div>
  );
}

// --- サーバーコンポーネント本体 --------------------------------
export default async function UserPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const email =
    user.emailAddresses?.[0]?.emailAddress ?? user.primaryEmailAddress?.emailAddress ?? "(no email)";
  const plan = (user.publicMetadata?.plan as string) ?? "free";

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>マイページ</h1>
      <p style={{ marginBottom: 16 }}>ログイン中: {email}</p>

      <section style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>プラン変更</h3>
        <Suspense>
          <PlanChooser current={plan} />
        </Suspense>
      </section>

      <section style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>ユーザー名</h3>
        <UsernameForm />
      </section>
    </main>
  );
}

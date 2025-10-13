import { currentUser, auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { redirect } from "next/navigation";
// ★ リダイレクト例外を見分けるために追加
import { isRedirectError } from "next/dist/client/components/redirect";

const PLANS = ["free", "plus", "pro"] as const;
type Plan = (typeof PLANS)[number];

/* =======================
   サーバーアクション: ユーザー名更新
   ======================= */
export async function updateUsername(formData: FormData) {
  "use server";
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in?redirect_url=/user");
  }

  const raw = (formData.get("username") as string | null) ?? "";
  const value = raw.trim();

  if (value.length < 3 || value.length > 32) {
    return redirect("/user?error=" + encodeURIComponent("ユーザー名は3〜32文字で入力してください"));
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

  try {
    await clerk.users.updateUser(userId, { username: value });
    return redirect("/user?msg=" + encodeURIComponent("ユーザー名を更新しました。"));
  } catch (e: any) {
    // ★ redirect 例外はそのまま投げる（=捕まえない）
    if (isRedirectError(e)) throw e;

    const msg =
      e?.errors?.[0]?.message || e?.message || "更新に失敗しました。時間をおいて再度お試しください。";
    return redirect("/user?error=" + encodeURIComponent(msg));
  }
}

/* =======================
   サーバーアクション: プラン変更（Stripeなし・メタデータだけ）
   ======================= */
export async function updatePlan(formData: FormData) {
  "use server";
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in?redirect_url=/user");
  }

  const value = (formData.get("plan") as Plan | null) ?? "free";
  if (!PLANS.includes(value)) {
    return redirect("/user?error=" + encodeURIComponent("不正なプラン指定です。"));
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

  try {
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { plan: value },
    });
    return redirect("/user?msg=" + encodeURIComponent(`プランを ${value} に変更しました。`));
  } catch (e: any) {
    if (isRedirectError(e)) throw e;

    const msg =
      e?.errors?.[0]?.message || e?.message || "プラン変更に失敗しました。時間をおいて再度お試しください。";
    return redirect("/user?error=" + encodeURIComponent(msg));
  }
}

/* =======================
   ページ本体
   ======================= */
export default async function UserPage({
  searchParams,
}: {
  searchParams?: { msg?: string; error?: string };
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in?redirect_url=/user");
  }

  const email = user.emailAddresses[0]?.emailAddress ?? "—";
  const plan: Plan = ((user.publicMetadata as any)?.plan ?? "free") as Plan;
  const username = user.username ?? "";

  const msg = searchParams?.msg;
  const errorMsg = searchParams?.error;

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>マイページ</h2>

      <p style={{ margin: "8px 0" }}>
        <strong>ログイン中:</strong> {email}
      </p>
      <p style={{ margin: "8px 0 24px" }}>
        <strong>現在のプラン:</strong> {plan}
      </p>

      {/* メッセージ */}
      {msg && (
        <p
          style={{
            padding: "8px 12px",
            background: "#e7f7ee",
            border: "1px solid #bfe8d2",
            borderRadius: 8,
            color: "#0f6b3e",
            marginBottom: 16,
          }}
        >
          {decodeURIComponent(msg)}
        </p>
      )}
      {errorMsg && (
        <p
          style={{
            padding: "8px 12px",
            background: "#fde8e8",
            border: "1px solid #f5c2c0",
            borderRadius: 8,
            color: "#8a1c1c",
            marginBottom: 16,
          }}
        >
          更新に失敗: {decodeURIComponent(errorMsg)}
        </p>
      )}

      {/* ユーザー名の更新 */}
      <section style={{ marginTop: 8 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 12px" }}>ユーザー名</h3>
        <form action={updateUsername} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="text"
            name="username"
            defaultValue={username}
            placeholder="ユーザー名を入力"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #222",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            保存
          </button>
        </form>
        <p style={{ color: "#666", marginTop: 8, fontSize: 13 }}>
          3–32 文字。英数字・「_」「-」が使用できます。重複は不可です。
        </p>
      </section>

      {/* プラン変更（ダミー課金。メタデータのみ更新） */}
      <section style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, margin: "8px 0 12px" }}>プラン変更</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {PLANS.map((p) => (
            <form key={p} action={updatePlan}>
              <input type="hidden" name="plan" value={p} />
              <button
                type="submit"
                disabled={p === plan}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #222",
                  background: p === plan ? "#eee" : "#fff",
                  cursor: p === plan ? "default" : "pointer",
                }}
                title={p === plan ? "現在のプランです" : `このプランに切り替える`}
              >
                {p === "free" ? "フリー" : p === "plus" ? "プラス" : "プロ"}
                {p === plan ? "（現在）" : ""}
              </button>
            </form>
          ))}
        </div>
      </section>

      {/* デバッグ（不要なら削除OK） */}
      <pre
        style={{
          marginTop: 24,
          background: "#f6f6f6",
          padding: 12,
          borderRadius: 8,
          overflowX: "auto",
          fontSize: 12,
        }}
      >
        {JSON.stringify(
          { id: user.id, username: user.username, publicMetadata: user.publicMetadata },
          null,
          2
        )}
      </pre>
    </main>
  );
}

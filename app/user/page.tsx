import { currentUser, auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { redirect } from "next/navigation";

// ===== サーバーアクション（ユーザー名更新） =====
export async function updateUsername(formData: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/user");
  }

  const raw = (formData.get("username") as string | null) ?? "";
  const value = raw.trim();

  // バリデーション（Clerkのデフォルトに合わせて軽くチェック）
  if (value.length < 3 || value.length > 32) {
    redirect("/user?error=ユーザー名は3〜32文字で入力してください");
  }

  try {
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!, // 必須
    });

    await clerk.users.updateUser(userId, { username: value });
    redirect("/user?ok=1");
  } catch (e: any) {
    const msg =
      e?.errors?.[0]?.message ||
      e?.message ||
      "更新に失敗しました。時間をおいて再度お試しください。";
    redirect(`/user?error=${encodeURIComponent(msg)}`);
  }
}

// ===== ページ本体（サーバーコンポーネント） =====
export default async function UserPage({
  searchParams,
}: {
  searchParams?: { ok?: string; error?: string };
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in?redirect_url=/user");
  }

  const email = user.emailAddresses[0]?.emailAddress ?? "—";
  const plan = (user.publicMetadata as any)?.plan ?? "free";
  const username = user.username ?? "";

  const ok = searchParams?.ok === "1";
  const errorMsg = searchParams?.error;

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>マイページ</h2>

      <p style={{ margin: "8px 0" }}>
        <strong>ログイン中:</strong> {email}
      </p>
      <p style={{ margin: "8px 0 24px" }}>
        <strong>現在のプラン:</strong> {String(plan)}
      </p>

      {/* 成功 / 失敗メッセージ */}
      {ok && (
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
          ユーザー名を更新しました。
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

      {/* ユーザー名変更フォーム（サーバーアクションに直接POST） */}
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

      {/* デバッグ表示（必要なければ削除OK） */}
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
        {JSON.stringify({ id: user.id, username: user.username, publicMetadata: user.publicMetadata }, null, 2)}
      </pre>
    </main>
  );
}

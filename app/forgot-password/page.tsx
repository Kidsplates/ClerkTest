"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [step, setStep] = useState<"start" | "verify">("start");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isLoaded) return <p>読み込み中...</p>;

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (!signIn) throw new Error("signIn not ready");

      // パスワードリセットコードを送信
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep("verify");
      setMsg("確認コードを送信しました。メールをご確認ください。");
    } catch (err: any) {
      setMsg(err?.errors?.[0]?.message ?? "エラーが発生しました");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (!signIn) throw new Error("signIn not ready");

      const res = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (res.status === "complete") {
        if (setActive) await setActive({ session: res.createdSessionId });
        setMsg("パスワードを更新しました。マイページへ移動します。");
        window.location.assign("/user");
      } else {
        setMsg("もう一度お試しください。");
      }
    } catch (err: any) {
      setMsg(err?.errors?.[0]?.message ?? "エラーが発生しました");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>パスワード再発行</h2>

      {step === "start" && (
        <form onSubmit={handleStart}>
          <label>
            登録メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <button disabled={busy} type="submit" style={{ padding: "8px 14px" }}>
            {busy ? "送信中..." : "確認コードを送る"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify}>
          <label>
            確認コード（メールに届いた6桁など）
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            新しいパスワード
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: 8, marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <button disabled={busy} type="submit" style={{ padding: "8px 14px" }}>
            {busy ? "更新中..." : "パスワードを更新してログイン"}
          </button>
        </form>
      )}

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      <div style={{ marginTop: 16 }}>
        <a href="/sign-in">← サインインに戻る</a>
      </div>
    </main>
  );
}

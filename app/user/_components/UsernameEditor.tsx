"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useTransition } from "react";

export default function UsernameEditor() {
  const { user } = useUser();
  const [value, setValue] = useState(user?.username ?? "");
  const [message, setMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    startTransition(async () => {
      const res = await fetch("/api/user/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: value }),
      });
      if (res.ok) {
        setMessage("ユーザー名を更新しました。");
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(`更新に失敗：${data?.error ?? "unknown"}`);
      }
    });
  };

  return (
    <section style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700 }}>ユーザー名</h3>
      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="未設定"
          aria-label="username"
          style={{
            padding: "8px 10px",
            border: "1px solid #ccc",
            borderRadius: 6,
            minWidth: 200,
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "8px 14px",
            border: "1px solid #333",
            borderRadius: 6,
            background: isPending ? "#eee" : "#fff",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "保存中…" : "保存"}
        </button>
      </form>
      {message && <p style={{ marginTop: 6 }}>{message}</p>}
      <p style={{ marginTop: 6, color: "#666", fontSize: 12 }}>
        3–32 文字、英数字・「.」「_」「-」が使用できます。重複は不可です。
      </p>
    </section>
  );
}

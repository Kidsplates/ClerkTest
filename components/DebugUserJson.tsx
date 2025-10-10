"use client";

import { useAuth, useUser, useOrganization } from "@clerk/nextjs";

export default function DebugUserJson() {
  const { user } = useUser();
  const { sessionId, userId, orgId } = useAuth();
  const { organization } = useOrganization();

  const data = {
    ids: { userId, sessionId, orgId },
    user: user
      ? {
          id: user.id,
          emailAddresses: user.emailAddresses,
          username: user.username,
          publicMetadata: user.publicMetadata,
          unsafeMetadata: user.unsafeMetadata, // クライアントで見える非機微データ
        }
      : null,
    organization,
  };

  return (
    <section style={{ marginTop: 24 }}>
      <h3>デバッグ用：現在のユーザー情報(JSON)</h3>
      <pre
        style={{
          background: "#f6f6f6",
          padding: 12,
          borderRadius: 8,
          overflowX: "auto",
          fontSize: 12,
          lineHeight: 1.45,
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}

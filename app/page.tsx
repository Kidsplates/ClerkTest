// app/page.tsx  ← サーバーコンポーネントのまま
export default function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const from =
    typeof searchParams?.from === "string" ? searchParams.from : "";

  return (
    <main style={{ padding: 24 }}>
      <h1>Auth Minimal</h1>
      {from && <p>from: {from}</p>}
      <p>トップページです。</p>
      <a href="/user">マイページへ</a>
    </main>
  );
}

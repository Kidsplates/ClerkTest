"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteLoader() {
  const pathname = usePathname();
  const search = useSearchParams();
  const lastKey = useRef<string>("");
  const [visible, setVisible] = useState(false);

  // SPA遷移を検知
  useEffect(() => {
    const key = pathname + "?" + search?.toString();
    if (lastKey.current && lastKey.current !== key) {
      setVisible(true);
      // 新画面が描画されれば自動的にこのコンポーネントも再評価されるので、
      // 少し待って消す（描画安定のための最小ディレイ）
      const t = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(t);
    }
    lastKey.current = key;
  }, [pathname, search]);

  // フルリロード（ClerkのafterSignInUrl等）が走るときも表示
  useEffect(() => {
    const onUnload = () => setVisible(true);
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position:"fixed", inset:0, display:"grid", placeItems:"center",
      background:"rgba(255,255,255,0.6)", backdropFilter:"blur(2px)", zIndex:9999
    }}>
      <div style={{fontSize:14, textAlign:"center"}}>
        <div style={{
          width:40, height:40, border:"4px solid #ccc",
          borderTopColor:"#000", borderRadius:"50%",
          animation:"spin 1s linear infinite", margin:"0 auto 12px"
        }} />
        画面を読み込んでいます…
      </div>
      <style>{`@keyframes spin {from{transform:rotate(0)} to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

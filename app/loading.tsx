export default function Loading() {
  return (
    <div style={{
      position:"fixed", inset:0, display:"grid", placeItems:"center",
      background:"rgba(255,255,255,0.6)", backdropFilter:"blur(2px)", zIndex:9999
    }}>
      <div style={{fontSize:14, textAlign:"center"}}>
        <div style={{
          width:40, height:40, border:"4px solid #ccc",
          borderTopColor:"#000", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 12px"
        }} />
        ページに移動しています…
      </div>
      <style>{`@keyframes spin {from{transform:rotate(0)} to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

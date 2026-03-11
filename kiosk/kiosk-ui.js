export function mountKioskUI(root, { onFace, onPin, onReset }) {
  root.innerHTML = `
    <style>
      :root{
        --bg0:#0b0d11;
        --bg1:rgba(255,255,255,.04);
        --bdr:rgba(255,255,255,.10);
        --bdr2:rgba(255,255,255,.14);
        --txt:rgba(255,255,255,.92);
        --mut:rgba(255,255,255,.70);
        --mut2:rgba(255,255,255,.55);
        --ok:#30d158;
        --accent:#4ea1ff;
        --warn:#ffcc00;
      }
      *{box-sizing:border-box}
      html,body{height:100%}
      body{
        margin:0;
        background:
          radial-gradient(1200px 600px at 30% 10%, rgba(255,255,255,.06), transparent 60%),
          radial-gradient(900px 500px at 80% 30%, rgba(78,161,255,.06), transparent 60%),
          var(--bg0);
        color:var(--txt);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
      }
      .wrap{min-height:100%;display:grid;place-items:center;padding:18px}
      .card{
        width:min(980px, 96vw);
        border:1px solid var(--bdr);
        background:var(--bg1);
        border-radius:22px;
        box-shadow:0 18px 60px rgba(0,0,0,.55);
        padding:18px;
      }
      .top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
      .logo{
        width:44px;height:44px;border-radius:16px;display:grid;place-items:center;
        border:1px solid var(--bdr);background:rgba(255,255,255,.05);font-weight:900;
      }
      .title{font-size:22px;font-weight:900;letter-spacing:.2px}
      .sub{color:var(--mut);margin-top:2px}
      .grid{display:grid;grid-template-columns: 1.2fr .8fr; gap:14px}
      @media (max-width: 900px){ .grid{grid-template-columns:1fr} }
      .panel{
        border:1px solid rgba(255,255,255,.10);
        background:rgba(255,255,255,.03);
        border-radius:18px;
        padding:14px;
        min-height:220px;
      }
      .btn{
        cursor:pointer;
        border:1px solid var(--bdr);
        background: rgba(255,255,255,.04);
        color:var(--txt);
        padding:12px 14px;
        border-radius:14px;
        font-weight:750;
        width:100%;
        margin-top:10px;
      }
      .btn:hover{border-color:var(--bdr2)}
      .pill{
        display:inline-flex;align-items:center;gap:8px;
        border:1px solid var(--bdr);background:rgba(255,255,255,.04);
        padding:8px 10px;border-radius:999px;font-size:13px;color:var(--mut);
      }
      .dot{width:10px;height:10px;border-radius:50%;background:var(--ok)}
      .warn{background:var(--warn)}
      .mut2{color:var(--mut2);line-height:1.45}
      .pinRow{display:flex;gap:10px;margin-top:10px}
      input{
        width:100%;
        border:1px solid rgba(255,255,255,.12);
        background:rgba(0,0,0,.22);
        color:var(--txt);
        padding:12px 12px;
        border-radius:14px;
        font-size:16px;
        outline:none;
      }
      input:focus{border-color:rgba(78,161,255,.55); box-shadow:0 0 0 3px rgba(78,161,255,.12)}
      .smallBtn{
        cursor:pointer;
        border:1px solid var(--bdr);
        background: rgba(255,255,255,.04);
        color:var(--txt);
        padding:12px 12px;
        border-radius:14px;
        font-weight:800;
        white-space:nowrap;
      }
      .hr{border:0;border-top:1px solid rgba(255,255,255,.10);margin:14px 0}
      .status{font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; color:var(--mut2)}
      .ok{color: rgba(48,209,88,.95)}
      .bad{color: rgba(255,99,99,.95)}
    </style>

    <div class="wrap">
      <div class="card">
        <div class="top">
          <div class="logo">◆</div>
          <div>
            <div class="title">DTC — Kiosco</div>
            <div class="sub">Entrada rápida: Rostro (online) o PIN (offline).</div>
          </div>
          <div style="margin-left:auto">
            <span class="pill" id="net-pill"><span class="dot" id="net-dot"></span><span id="net-text">Verificando red…</span></span>
          </div>
        </div>

        <div class="grid">
          <div class="panel">
            <div style="font-weight:900;margin-bottom:6px;">Rostro (online)</div>
            <div class="mut2">
              Ideal cuando hay internet: como FaceID.
              <br/>Luego te manda directo a tu pantalla (empleado / padre / tutor).
            </div>
            <button class="btn" id="faceBtn">📷 Escanear rostro</button>
            <div class="hr"></div>
            <div class="status" id="faceStatus">Estado: esperando…</div>
          </div>

          <div class="panel">
            <div style="font-weight:900;margin-bottom:6px;">PIN (offline)</div>
            <div class="mut2">
              Si no hay internet o la cámara falla, el PIN te deja entrar igual.
            </div>
            <div class="pinRow">
              <input id="pinInput" inputmode="numeric" placeholder="PIN" maxlength="8" />
              <button class="smallBtn" id="pinBtn">Entrar</button>
            </div>
            <button class="btn" id="resetBtn" style="margin-top:12px;">🔄 Reset / Limpiar</button>
            <div class="hr"></div>
            <div class="status" id="pinStatus">Estado: esperando…</div>
          </div>
        </div>

        <div class="hr"></div>
        <div class="mut2">
          Nota: más adelante este kiosco se “auto-configura” por administración: quién puede entrar aquí, y a qué pantalla va cada rol.
        </div>
      </div>
    </div>
  `;

  const netText = root.querySelector("#net-text");
  const netDot  = root.querySelector("#net-dot");

  function refreshNet() {
    const online = navigator.onLine;
    netText.textContent = online ? "Online" : "Offline";
    netDot.className = "dot" + (online ? "" : " warn");
  }
  window.addEventListener("online", refreshNet);
  window.addEventListener("offline", refreshNet);
  refreshNet();

  // hooks
  root.querySelector("#faceBtn").addEventListener("click", onFace);
  root.querySelector("#pinBtn").addEventListener("click", () => {
    const pin = root.querySelector("#pinInput").value.trim();
    onPin(pin);
  });
  root.querySelector("#pinInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") root.querySelector("#pinBtn").click();
  });
  root.querySelector("#resetBtn").addEventListener("click", onReset);

  return {
    setFaceStatus: (msg, ok=true) => {
      const el = root.querySelector("#faceStatus");
      el.textContent = `Estado: ${msg}`;
      el.classList.toggle("ok", ok);
      el.classList.toggle("bad", !ok);
    },
    setPinStatus: (msg, ok=true) => {
      const el = root.querySelector("#pinStatus");
      el.textContent = `Estado: ${msg}`;
      el.classList.toggle("ok", ok);
      el.classList.toggle("bad", !ok);
    },
    clearPin: () => { root.querySelector("#pinInput").value = ""; }
  };
}
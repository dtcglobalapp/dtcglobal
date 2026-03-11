// core/ui-shell.js
export function mountShell(root, { onNavigate } = {}) {
  const css = `
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
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      background: radial-gradient(1200px 600px at 30% 10%, rgba(255,255,255,.06), transparent 60%),
                  radial-gradient(900px 500px at 80% 30%, rgba(78,161,255,.06), transparent 60%),
                  var(--bg0);
      color:var(--txt);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    a{color:inherit}
    .wrap{max-width:1200px;margin:0 auto;padding:18px}
    .card{
      border:1px solid var(--bdr);
      background:var(--bg1);
      border-radius:22px;
      box-shadow:0 18px 60px rgba(0,0,0,.55);
    }
    .topbar{
      position:sticky; top:0; z-index:5;
      backdrop-filter: blur(10px);
      background: rgba(11,13,17,.55);
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    .topbar-inner{display:flex;align-items:center;gap:12px;padding:14px 18px}
    .brand{
      display:flex;align-items:center;gap:10px;
      font-weight:800; letter-spacing:.2px;
    }
    .logo{
      width:34px;height:34px;border-radius:12px;
      display:grid;place-items:center;
      border:1px solid var(--bdr);
      background: rgba(255,255,255,.05);
    }
    .pill{
      border:1px solid var(--bdr);
      background: rgba(255,255,255,.04);
      padding:8px 10px;
      border-radius:999px;
      font-size:13px;
      color:var(--mut);
    }
    .nav{
      margin-left:auto;
      display:flex;gap:8px;flex-wrap:wrap;
    }
    .btn{
      cursor:pointer;
      border:1px solid var(--bdr);
      background: rgba(255,255,255,.04);
      color:var(--txt);
      padding:9px 12px;
      border-radius:12px;
      font-weight:650;
    }
    .btn:hover{border-color:var(--bdr2)}
    .btn.active{outline:2px solid rgba(78,161,255,.35); border-color:rgba(78,161,255,.55)}
    .content{padding:18px}
    .grid{display:grid;grid-template-columns: 1.2fr .8fr; gap:14px}
    @media (max-width: 900px){ .grid{grid-template-columns:1fr} }
    .h1{font-size:28px;margin:0 0 6px}
    .mut{color:var(--mut);line-height:1.5}
    .mut2{color:var(--mut2)}
    .dot{width:10px;height:10px;border-radius:50%;background:var(--ok);display:inline-block;margin-right:8px}
    .hr{border:0;border-top:1px solid rgba(255,255,255,.10);margin:14px 0}
  `;

  root.innerHTML = `
    <style>${css}</style>

    <div class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <div class="logo">◆</div>
          <div>
            <div style="font-size:14px;opacity:.95;">DTC</div>
            <div style="font-size:12px;color:var(--mut2);margin-top:-2px;">Edificio</div>
          </div>
        </div>

        <div class="pill" id="env-pill"><span class="dot"></span>Local / Live Server</div>

        <div class="nav">
          <button class="btn" data-go="#/">Inicio</button>
          <button class="btn" data-go="#/employees">Empleados</button>
          <button class="btn" data-go="#/kiosk">Kiosco</button>
        </div>
      </div>
    </div>

    <div class="wrap">
      <div class="card content" id="outlet"></div>
    </div>
  `;

  root.querySelectorAll("[data-go]").forEach((b) => {
    b.addEventListener("click", () => {
      const hash = b.getAttribute("data-go");
      if (onNavigate) onNavigate(hash);
      else location.hash = hash;
    });
  });
}

export function setActiveNav(root, hash) {
  root.querySelectorAll("[data-go]").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-go") === hash);
  });
}
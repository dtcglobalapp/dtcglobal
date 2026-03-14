const root = document.getElementById("app");

if (!root) {
  throw new Error("No se encontró #app para montar el Lobby.");
}

root.innerHTML = `
  <style>
    :root{
      --bg-1:#050816;
      --bg-2:#0a1020;
      --card:rgba(255,255,255,0.08);
      --card-2:rgba(255,255,255,0.05);
      --border:rgba(255,255,255,0.12);
      --text:#f3f6fb;
      --muted:#b3bfd3;
      --accent:#3b82f6;
      --shadow:0 18px 48px rgba(0,0,0,.34);
      --radius-xl:28px;
      --radius-lg:22px;
      --radius-md:18px;
    }

    *{ box-sizing:border-box; }

    html,body{
      margin:0;
      padding:0;
      min-height:100%;
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;
      color:var(--text);
      background:
        radial-gradient(circle at top center, rgba(59,130,246,.16), transparent 30%),
        linear-gradient(180deg,var(--bg-2),var(--bg-1));
    }

    body{
      padding:24px 14px 40px;
    }

    .lobby-page{
      width:min(100%, 1380px);
      margin:0 auto;
      display:grid;
      gap:20px;
    }

    .glass{
      background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
      border:1px solid var(--border);
      box-shadow:var(--shadow);
      backdrop-filter:blur(14px);
      -webkit-backdrop-filter:blur(14px);
    }

    .hero{
      border-radius:var(--radius-xl);
      padding:18px 20px;
      display:grid;
      grid-template-columns:84px 1fr auto;
      gap:16px;
      align-items:center;
    }

    .dtc-home{
      width:84px;
      height:84px;
      border-radius:24px;
      border:1px solid var(--border);
      background:rgba(255,255,255,.06);
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      overflow:hidden;
      text-decoration:none;
      color:var(--text);
      flex-shrink:0;
      cursor:pointer;
    }

    .dtc-home::before{
      content:"";
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, rgba(59,130,246,.18), transparent 60%);
      opacity:.95;
    }

    .dtc-home::after{
      content:"";
      position:absolute;
      width:120%;
      height:22%;
      background:rgba(255,255,255,.10);
      top:18%;
      left:-10%;
      border-radius:999px;
      transform-origin:center;
      animation:dtcBlink 5.8s infinite ease-in-out;
      pointer-events:none;
    }

    .dtc-home span{
      position:relative;
      z-index:2;
      font-weight:800;
      letter-spacing:.08em;
      font-size:1.05rem;
      text-shadow:0 0 14px rgba(59,130,246,.20);
    }

    @keyframes dtcBlink{
      0%,44%,48%,100%{ transform:scaleY(.15); opacity:0; }
      45%,47%{ transform:scaleY(1); opacity:1; }
    }

    .hero-copy h1{
      margin:0;
      font-size:clamp(2rem,4vw,3.2rem);
      line-height:1.02;
      letter-spacing:-.04em;
    }

    .hero-copy p{
      margin:8px 0 0;
      color:var(--muted);
      font-size:1.08rem;
    }

    .hero-actions{
      display:flex;
      gap:10px;
      flex-wrap:wrap;
      justify-content:flex-end;
    }

    .btn{
      appearance:none;
      border:1px solid rgba(255,255,255,.12);
      border-radius:18px;
      padding:14px 18px;
      background:rgba(255,255,255,.05);
      color:var(--text);
      font-weight:700;
      cursor:pointer;
      transition:.18s ease;
      text-decoration:none;
      display:inline-flex;
      align-items:center;
      justify-content:center;
    }

    .btn:hover{
      transform:translateY(-1px);
      background:rgba(255,255,255,.08);
    }

    .btn-primary{
      border-color:rgba(59,130,246,.55);
      box-shadow:
        inset 0 0 0 1px rgba(59,130,246,.25),
        0 0 0 2px rgba(59,130,246,.08);
    }

    .grid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:18px;
    }

    .card{
      border-radius:var(--radius-xl);
      padding:22px;
    }

    .card h2{
      margin:0 0 10px;
      font-size:clamp(1.8rem,3vw,2.5rem);
      line-height:1.06;
      letter-spacing:-.03em;
    }

    .lead{
      margin:0 0 18px;
      color:var(--muted);
      font-size:1.06rem;
    }

    .field{
      display:grid;
      gap:8px;
      margin-bottom:14px;
    }

    .field label{
      font-weight:700;
      color:#dfe7f5;
      font-size:1rem;
    }

    .field input{
      width:100%;
      border-radius:18px;
      border:1px solid rgba(255,255,255,.10);
      background:rgba(4,10,22,.7);
      color:var(--text);
      padding:16px 18px;
      font-size:1rem;
      outline:none;
      transition:.18s ease;
    }

    .field input:focus{
      border-color:rgba(59,130,246,.65);
      box-shadow:0 0 0 4px rgba(59,130,246,.12);
    }

    .stack{
      display:grid;
      gap:12px;
    }

    .dev-box{
      margin-top:16px;
      border-radius:22px;
      border:1px dashed rgba(255,255,255,.15);
      padding:16px;
      background:rgba(255,255,255,.03);
    }

    .dev-box h3{
      margin:0 0 8px;
      font-size:1.2rem;
      line-height:1.15;
    }

    .small{
      color:var(--muted);
      line-height:1.55;
    }

    .divider{
      height:1px;
      background:rgba(255,255,255,.08);
      margin:16px 0;
    }

    .discover{
      border-radius:var(--radius-xl);
      padding:24px;
      margin-top:4px;
    }

    .discover-head{
      display:flex;
      gap:18px;
      align-items:center;
      margin-bottom:18px;
    }

    .discover-eye{
      width:84px;
      height:84px;
      border-radius:24px;
      border:1px solid var(--border);
      background:rgba(255,255,255,.06);
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      overflow:hidden;
      flex-shrink:0;
      cursor:pointer;
    }

    .discover-eye::before{
      content:"";
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, rgba(59,130,246,.18), transparent 60%);
    }

    .discover-eye::after{
      content:"";
      position:absolute;
      width:120%;
      height:22%;
      background:rgba(255,255,255,.10);
      top:18%;
      left:-10%;
      border-radius:999px;
      transform-origin:center;
      animation:dtcBlink 5.8s infinite ease-in-out;
      pointer-events:none;
    }

    .discover-eye span{
      position:relative;
      z-index:2;
      font-weight:800;
      letter-spacing:.08em;
    }

    .discover-copy h2{
      margin:0 0 6px;
      font-size:clamp(1.8rem,3vw,2.5rem);
      line-height:1.05;
      letter-spacing:-.03em;
    }

    .discover-copy p{
      margin:0;
      color:var(--muted);
      line-height:1.55;
      max-width:880px;
    }

    .discover-grid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:18px;
    }

    .discover-card{
      border-radius:22px;
      padding:20px;
      background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03));
      border:1px solid rgba(255,255,255,.09);
    }

    .discover-card h3{
      margin:0 0 10px;
      font-size:1.24rem;
    }

    .discover-card p,
    .discover-card ul{
      margin:0 0 16px;
      color:var(--muted);
      line-height:1.55;
    }

    .discover-card ul{
      padding-left:18px;
    }

    .discover-footer{
      margin-top:20px;
      padding-top:18px;
      border-top:1px solid rgba(255,255,255,.08);
    }

    .discover-footer p{
      margin:0 0 14px;
      color:var(--muted);
      line-height:1.55;
    }

    .discover-actions{
      display:flex;
      gap:12px;
      flex-wrap:wrap;
    }

    .msg{
      min-height:22px;
      margin:8px 0 0;
      color:#d8e4ff;
      font-weight:600;
    }

    .footer-note{
      color:var(--muted);
      line-height:1.55;
      margin-top:8px;
      font-size:.98rem;
    }

    @media (max-width: 980px){
      .grid,
      .discover-grid{
        grid-template-columns:1fr;
      }

      .hero{
        grid-template-columns:84px 1fr;
      }

      .hero-actions{
        grid-column:1 / -1;
        justify-content:flex-start;
      }
    }

    @media (max-width: 640px){
      body{
        padding:16px 12px 28px;
      }

      .hero{
        padding:16px;
        gap:14px;
        grid-template-columns:64px 1fr;
      }

      .dtc-home,
      .discover-eye{
        width:64px;
        height:64px;
        border-radius:20px;
      }

      .card,
      .discover{
        padding:18px;
      }

      .discover-actions,
      .hero-actions{
        display:grid;
        grid-template-columns:1fr;
      }

      .btn{
        width:100%;
      }
    }
  </style>

  <main class="lobby-page">
    <section class="hero glass">
      <a class="dtc-home" id="dtcHomeBtn" href="/index.html" title="DTC">
        <span>DTC</span>
      </a>

      <div class="hero-copy">
        <h1>DTC — Lobby</h1>
        <p>Entrar, crear cuenta, recuperar acceso o descubrir el ecosistema DTC.</p>
      </div>

      <div class="hero-actions">
        <a class="btn btn-primary" id="goAccessBtn" href="/kiosk.html">Acceso inteligente</a>
        <button class="btn" id="goDiscoverTopBtn" type="button">Conoce DTC</button>
      </div>
    </section>

    <section class="grid">
      <article class="card glass">
        <h2>Entrar</h2>
        <p class="lead">Acceso seguro al sistema.</p>

        <div class="field">
          <label for="loginEmail">Email</label>
          <input id="loginEmail" type="email" placeholder="tu@email.com" />
        </div>

        <div class="field">
          <label for="loginPassword">Password</label>
          <input id="loginPassword" type="password" placeholder="••••••••" />
        </div>

        <div class="stack">
          <button class="btn btn-primary" id="signInBtn" type="button">Sign In</button>
          <button class="btn" id="magicLinkBtn" type="button">Enviar Magic Link (sin password)</button>
        </div>

        <p class="msg" id="loginMsg"></p>

        <div class="dev-box">
          <h3>Modo Dev — Configurar Supabase</h3>
          <p class="small">
            El Lobby necesita la URL y la ANON KEY para registrar y entrar usuarios.
          </p>

          <div class="field">
            <label for="supabaseUrl">Supabase URL</label>
            <input id="supabaseUrl" type="text" placeholder="https://xxxx.supabase.co" />
          </div>

          <div class="field">
            <label for="supabaseAnon">Anon Key</label>
            <input id="supabaseAnon" type="text" placeholder="eyJhbGciOi..." />
          </div>

          <button class="btn btn-primary" id="saveConfigBtn" type="button">Guardar Config</button>
          <p class="msg" id="configMsg"></p>
        </div>
      </article>

      <article class="card glass">
        <h2>Crear cuenta</h2>
        <p class="lead">Nuevos usuarios.</p>

        <div class="field">
          <label for="signupName">Nombre completo</label>
          <input id="signupName" type="text" placeholder="Felencho" />
        </div>

        <div class="field">
          <label for="signupEmail">Email</label>
          <input id="signupEmail" type="email" placeholder="nuevo@email.com" />
        </div>

        <div class="field">
          <label for="signupPassword">Password</label>
          <input id="signupPassword" type="password" placeholder="mínimo 6 caracteres" />
        </div>

        <button class="btn btn-primary" id="createAccountBtn" type="button">Create Account</button>
        <p class="msg" id="signupMsg"></p>

        <div class="divider"></div>

        <h2 style="font-size:2rem;">Recuperar acceso</h2>
        <p class="lead">Forgot username or password.</p>

        <div class="field">
          <label for="recoverEmail">Email</label>
          <input id="recoverEmail" type="email" placeholder="tu@email.com" />
        </div>

        <button class="btn" id="recoverBtn" type="button">Enviar recuperación</button>
        <p class="msg" id="recoverMsg"></p>

        <p class="footer-note">
          Nota: al registrarte, DTC crea tu usuario en Auth. El perfil y permisos se conectarán con tu organización y tu rol.
        </p>
      </article>
    </section>

    <section class="discover glass" id="discoverDTCSection">
      <div class="discover-head">
        <div class="discover-eye" id="discoverEyeBtn" title="DTC">
          <span>DTC</span>
        </div>

        <div class="discover-copy">
          <h2>Conoce DTC</h2>
          <p>
            Tecnología inteligente para negocios reales. Descubre nuestro sistema actual para
            <strong>DTC Daycares Control Total</strong> y las próximas soluciones del ecosistema.
          </p>
        </div>
      </div>

      <div class="discover-grid">
        <article class="discover-card">
          <h3>DTC Daycares Control Total</h3>
          <p>
            Control de acceso, empleados, niños, horarios, reportes, inventario, recordatorios
            y comunicación con padres desde una sola plataforma.
          </p>
          <button class="btn btn-primary" id="btnExploreDaycare" type="button">Explorar DTC</button>
        </article>

        <article class="discover-card">
          <h3>Muy pronto</h3>
          <ul>
            <li>Radio &amp; TV Streaming Server</li>
            <li>DTC Barbershop</li>
          </ul>
          <button class="btn" id="btnWatchDemo" type="button">Ver demostración</button>
        </article>
      </div>

      <div class="discover-footer">
        <p>
          ¿No estás en DTC todavía? Esta es tu puerta para conocernos y descubrir cómo funciona
          nuestro ecosistema.
        </p>

        <div class="discover-actions">
          <button class="btn btn-primary" id="btnConoceDTC" type="button">Conoce DTC</button>
          <button class="btn" id="btnBackLobby" type="button">Ir al Lobby</button>
          <button class="btn" id="btnOtherMethod" type="button">Otro método</button>
        </div>
      </div>
    </section>
  </main>
`;

function goLobby() {
  window.location.href = "/index.html";
}

function goAccess() {
  window.location.href = "/kiosk.html";
}

function goDemo() {
  window.location.href = "/demo.html";
}

function goDaycareDemo() {
  window.location.href = "/demo.html?product=daycare";
}

document.getElementById("dtcHomeBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  goLobby();
});

document.getElementById("goDiscoverTopBtn")?.addEventListener("click", () => {
  document.getElementById("discoverDTCSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("discoverEyeBtn")?.addEventListener("click", goDemo);
document.getElementById("btnConoceDTC")?.addEventListener("click", goDemo);
document.getElementById("btnExploreDaycare")?.addEventListener("click", goDaycareDemo);
document.getElementById("btnWatchDemo")?.addEventListener("click", goDemo);
document.getElementById("btnBackLobby")?.addEventListener("click", goLobby);
document.getElementById("btnOtherMethod")?.addEventListener("click", goAccess);

// Placeholders visuales por ahora
document.getElementById("signInBtn")?.addEventListener("click", () => {
  document.getElementById("loginMsg").textContent = "Próximo paso: conectar login real con Supabase Auth.";
});

document.getElementById("magicLinkBtn")?.addEventListener("click", () => {
  document.getElementById("loginMsg").textContent = "Próximo paso: enviar Magic Link real.";
});

document.getElementById("createAccountBtn")?.addEventListener("click", () => {
  document.getElementById("signupMsg").textContent = "Próximo paso: crear cuenta real con Supabase.";
});

document.getElementById("recoverBtn")?.addEventListener("click", () => {
  document.getElementById("recoverMsg").textContent = "Próximo paso: recuperación real de acceso.";
});

document.getElementById("saveConfigBtn")?.addEventListener("click", () => {
  document.getElementById("configMsg").textContent = "Próximo paso: guardar configuración local de Supabase.";
});
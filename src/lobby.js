// src/lobby.js
import { supabase, hasSupabaseConfig } from "../core/supabase.js";

const root = document.getElementById("lobby-root");

if (!root) {
  document.body.innerHTML = "❌ No encuentro #lobby-root en index.html";
  throw new Error("Missing #lobby-root");
}

const css = `
  :root{
    --bg0:#0b0d11;
    --bg1:rgba(255,255,255,.04);
    --bdr:rgba(255,255,255,.10);
    --bdr2:rgba(255,255,255,.16);
    --txt:rgba(255,255,255,.92);
    --mut:rgba(255,255,255,.70);
    --mut2:rgba(255,255,255,.55);
    --ok:#30d158;
    --bad:#ff4d5a;
    --accent:#4ea1ff;
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
  .wrap{max-width:1440px;margin:0 auto;padding:26px}
  .card{
    border:1px solid var(--bdr);
    background:var(--bg1);
    border-radius:24px;
    box-shadow:0 18px 60px rgba(0,0,0,.55);
  }
  .hero{
    display:flex;align-items:center;gap:14px;
    padding:18px 20px;
  }
  .logo{
    width:58px;height:58px;border-radius:18px;
    display:grid;place-items:center;
    border:1px solid var(--bdr);
    background: rgba(255,255,255,.05);
    font-size:22px;font-weight:900;
  }
  .title{font-size:30px;font-weight:900;margin:0}
  .sub{color:var(--mut);font-size:14px;margin-top:2px}
  .grid{
    display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:16px;
  }
  @media (max-width: 980px){ .grid{grid-template-columns:1fr} }
  .pane{padding:22px}
  .h2{font-size:26px;font-weight:900;margin:0 0 8px}
  .mut{color:var(--mut);line-height:1.5}
  .mut2{color:var(--mut2)}
  label{
    display:block;color:var(--mut);font-weight:650;margin:14px 0 6px;
  }
  input{
    width:100%;
    padding:14px 14px;
    border-radius:16px;
    border:1px solid rgba(255,255,255,.10);
    background: rgba(0,0,0,.22);
    color:var(--txt);
    outline:none;
    font-size:16px;
  }
  input:focus{
    border-color:rgba(78,161,255,.55);
    box-shadow:0 0 0 3px rgba(78,161,255,.12);
  }
  .btn{
    width:100%;
    cursor:pointer;
    border:1px solid var(--bdr);
    background: rgba(255,255,255,.05);
    color:var(--txt);
    padding:14px 16px;
    border-radius:16px;
    font-weight:800;
    font-size:16px;
    margin-top:14px;
  }
  .btn:hover{border-color:var(--bdr2)}
  .btn.primary{
    border-color:rgba(78,161,255,.45);
    box-shadow: inset 0 0 0 1px rgba(78,161,255,.20);
  }
  .divider{
    border:0;border-top:1px solid rgba(255,255,255,.10);margin:18px 0;
  }
  .note{
    margin-top:16px;color:var(--mut2);font-size:14px;
  }
  .config{
    margin-top:16px;
    padding:16px;
    border:1px dashed rgba(255,255,255,.12);
    border-radius:18px;
    background:rgba(255,255,255,.03);
  }
  .toast{
    position:fixed;left:18px;right:18px;bottom:18px;max-width:980px;margin:0 auto;
    border-radius:18px;padding:14px 16px;
    background:rgba(15,18,25,.88);
    border:1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(10px);
    box-shadow:0 18px 60px rgba(0,0,0,.55);
    display:none;align-items:center;gap:12px;
  }
  .dot{width:12px;height:12px;border-radius:50%;background:var(--ok)}
  .dot.bad{background:var(--bad)}
  .toast-title{font-weight:900;font-size:16px}
  .toast-msg{color:var(--mut)}
  .toast button{
    margin-left:auto;border:1px solid rgba(255,255,255,.12);
    background:rgba(255,255,255,.04);color:var(--txt);
    border-radius:12px;padding:8px 12px;font-weight:800;cursor:pointer;
  }
`;

function mount() {
  root.innerHTML = `
    <style>${css}</style>

    <div class="wrap">
      <div class="card hero">
        <div class="logo">◆</div>
        <div>
          <h1 class="title">DTC — Lobby</h1>
          <div class="sub">Entrar, crear cuenta o recuperar acceso.</div>
        </div>
      </div>

      <div class="grid">
        <div class="card pane">
          <h2 class="h2">Entrar</h2>
          <div class="mut">Acceso seguro al sistema.</div>

          <label>Email</label>
          <input id="login-email" type="email" placeholder="tu@email.com" />

          <label>Password</label>
          <input id="login-password" type="password" placeholder="••••••••" />

          <button id="btn-login" class="btn primary">Sign In</button>
          <button id="btn-magic" class="btn">Enviar Magic Link (sin password)</button>

          <div class="config">
            <div style="font-weight:900;font-size:18px;margin-bottom:8px;">Modo Dev — Configurar Supabase</div>
            <div class="mut2">El Lobby necesita la URL y la ANON KEY para registrar y entrar usuarios.</div>

            <label>Supabase URL</label>
            <input id="cfg-url" type="text" placeholder="https://xxxx.supabase.co" />

            <label>Anon Key</label>
            <input id="cfg-anon" type="text" placeholder="eyJhbGciOi..." />

            <button id="btn-save-config" class="btn primary">Guardar Config</button>
          </div>
        </div>

        <div class="card pane">
          <h2 class="h2">Crear cuenta</h2>
          <div class="mut">Nuevos usuarios</div>

          <label>Nombre completo</label>
          <input id="signup-name" type="text" placeholder="Felencho" />

          <label>Email</label>
          <input id="signup-email" type="email" placeholder="nuevo@email.com" />

          <label>Password</label>
          <input id="signup-password" type="password" placeholder="mínimo 6 caracteres" />

          <button id="btn-signup" class="btn primary">Create Account</button>

          <hr class="divider" />

          <h2 class="h2" style="margin-top:0;">Recuperar acceso</h2>
          <div class="mut">Forgot username or password</div>

          <label>Email</label>
          <input id="recover-email" type="email" placeholder="tu@email.com" />

          <button id="btn-recover" class="btn">Enviar recuperación</button>

          <div class="note">
            Nota: al registrarte, DTC crea tu usuario en Auth. El perfil en
            <b>profiles</b> lo crea automáticamente el trigger.
            <br/>
            Tip del edificio: el Lobby es para entrar; los residentes luego pasan por kiosco o paneles.
          </div>
        </div>
      </div>
    </div>

    <div id="toast" class="toast">
      <div id="toast-dot" class="dot"></div>
      <div>
        <div id="toast-title" class="toast-title">Lobby</div>
        <div id="toast-msg" class="toast-msg">Listo</div>
      </div>
      <button id="toast-ok">OK</button>
    </div>
  `;
}

function toast(title, msg, ok = true) {
  const el = document.getElementById("toast");
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-msg").textContent = msg;
  document.getElementById("toast-dot").className = ok ? "dot" : "dot bad";
  el.style.display = "flex";
}

function bind() {
  document.getElementById("toast-ok").addEventListener("click", () => {
    document.getElementById("toast").style.display = "none";
  });

  document.getElementById("btn-save-config").addEventListener("click", async () => {
    const url = document.getElementById("cfg-url").value.trim();
    const anon = document.getElementById("cfg-anon").value.trim();

    if (!url || !anon) {
      toast("Lobby", "Falta URL o Anon Key.", false);
      return;
    }

    localStorage.setItem("https://mugufzwvwteoopjdrheq.supabase.co", url);
    localStorage.setItem("sb_publishable_npn2NhS9fEHAjWHGsbLTSQ_KudyqrFt", anon);
    toast("Lobby", "Configuración Supabase guardada.");
  });

  document.getElementById("btn-signup").addEventListener("click", handleSignup);
  document.getElementById("btn-login").addEventListener("click", handleLogin);
  document.getElementById("btn-magic").addEventListener("click", handleMagicLink);
  document.getElementById("btn-recover").addEventListener("click", handleRecover);
}

async function handleSignup() {
  try {
    if (!hasSupabaseConfig()) {
      toast("Crear cuenta", "Configura Supabase primero.", false);
      return;
    }

    const fullName = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!fullName || !email || !password) {
      toast("Crear cuenta", "Completa nombre, email y password.", false);
      return;
    }

    if (password.length < 6) {
      toast("Crear cuenta", "El password debe tener al menos 6 caracteres.", false);
      return;
    }

    const client = supabase();

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      toast("Crear cuenta", error.message, false);
      return;
    }

    toast(
      "Crear cuenta",
      data?.user
        ? "Cuenta creada. Revisa tu email si tu proyecto exige confirmación."
        : "Solicitud enviada. Revisa tu email."
    );
  } catch (err) {
    toast("Crear cuenta", err.message || String(err), false);
  }
}

async function handleLogin() {
  try {
    if (!hasSupabaseConfig()) {
      toast("Login", "Configura Supabase primero.", false);
      return;
    }

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      toast("Login", "Completa email y password.", false);
      return;
    }

    const client = supabase();
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      toast("Login", error.message, false);
      return;
    }

    toast("Login", "Sesión iniciada. Entrando al edificio...");
    setTimeout(() => {
      window.location.href = "./app.html";
    }, 800);
  } catch (err) {
    toast("Login", err.message || String(err), false);
  }
}

async function handleMagicLink() {
  try {
    if (!hasSupabaseConfig()) {
      toast("Magic Link", "Configura Supabase primero.", false);
      return;
    }

    const email = document.getElementById("login-email").value.trim();

    if (!email) {
      toast("Magic Link", "Escribe tu email.", false);
      return;
    }

    const client = supabase();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/app.html"
      }
    });

    if (error) {
      toast("Magic Link", error.message, false);
      return;
    }

    toast("Magic Link", "Te enviamos un enlace de acceso.");
  } catch (err) {
    toast("Magic Link", err.message || String(err), false);
  }
}

async function handleRecover() {
  try {
    if (!hasSupabaseConfig()) {
      toast("Recuperación", "Configura Supabase primero.", false);
      return;
    }

    const email = document.getElementById("recover-email").value.trim();

    if (!email) {
      toast("Recuperación", "Escribe tu email.", false);
      return;
    }

    const client = supabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/index.html"
    });

    if (error) {
      toast("Recuperación", error.message, false);
      return;
    }

    toast("Recuperación", "Te enviamos el correo de recuperación.");
  } catch (err) {
    toast("Recuperación", err.message || String(err), false);
  }
}

mount();
bind();
// core/router.js
import { setActiveNav } from "./ui-shell.js";

export function createRouter(root) {
  function parseHash() {
    const raw = location.hash || "#/";
    const clean = raw.startsWith("#") ? raw.slice(1) : raw; // "/kiosk?role=guardian"
    const [pathPart, queryPart = ""] = clean.split("?");
    const path = pathPart || "/";
    const params = new URLSearchParams(queryPart);
    return { raw, path, params };
  }

  function renderRoute() {
    const outlet = document.getElementById("outlet");
    const { raw, path, params } = parseHash();

    // para marcar el nav activo solo por path base
    const navHash =
      path === "/employees" ? "#/employees" :
      path === "/kiosk" ? "#/kiosk" :
      "#/";

    setActiveNav(root, navHash);

    if (!outlet) {
      console.error("No encuentro #outlet. ¿ui-shell montó el layout?");
      return;
    }

    if (path === "/" || path === "") {
      outlet.innerHTML = `
        <div class="grid">
          <div>
            <div class="h1">🏢 DTC — Shell listo</div>
            <div class="mut">
              Ya tenemos el esqueleto: <b>barra superior</b>, <b>outlet</b> y <b>router</b>.
              <br/>Ahora vamos a conectar el Core real (session/supabase) sin romper nada.
            </div>
            <div class="hr"></div>
            <div class="mut2" style="font-family: ui-monospace, Menlo, Monaco, Consolas, monospace;">
              Ruta: ${raw}<br/>
              Próximo: core/supabase.js → session.js → router.js (módulos)
            </div>
          </div>

          <div>
            <div class="card" style="padding:14px;border-radius:18px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);">
              <div style="font-weight:800;margin-bottom:6px;">Checklist</div>
              <div class="mut2">✅ app.html carga</div>
              <div class="mut2">✅ app.js monta</div>
              <div class="mut2">✅ shell + router</div>
              <div class="mut2">⬜ supabase</div>
              <div class="mut2">⬜ session/profile</div>
              <div class="mut2">⬜ módulos reales</div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (path === "/employees") {
      outlet.innerHTML = `
        <div class="h1">👥 Empleados</div>
        <div class="mut">Placeholder. Aquí montaremos /modules/employees.</div>
        <div class="hr"></div>
        <button class="btn" onclick="location.hash='#/'">Volver</button>
      `;
      return;
    }

    if (path === "/kiosk") {
      const role = params.get("role") || "unknown";
      const ticket = params.get("ticket") || "";

      let ticketPretty = "—";
      if (ticket) {
        try {
          ticketPretty = JSON.stringify(JSON.parse(decodeURIComponent(ticket)), null, 2);
        } catch {
          ticketPretty = decodeURIComponent(ticket);
        }
      }

      outlet.innerHTML = `
        <div class="h1">🧾 Kiosco</div>
        <div class="mut">Entrada recibida desde kiosco / rostro / PIN.</div>
        <div class="hr"></div>

        <div class="card" style="padding:14px;border-radius:18px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.03);">
          <div style="font-weight:800;margin-bottom:8px;">Datos de entrada</div>
          <div class="mut2"><b>Role:</b> ${escapeHtml(role)}</div>
          <div class="mut2" style="margin-top:8px;"><b>Ticket:</b></div>
          <pre style="white-space:pre-wrap;word-break:break-word;background:rgba(0,0,0,.2);padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.08);">${escapeHtml(ticketPretty)}</pre>
        </div>

        <div class="hr"></div>

        <div class="mut">
          Próximo paso: según el role, mostrar solo su pantalla:
          <br/>• guardian → sus niños
          <br/>• employee → time in / time out
          <br/>• admin/owner → panel de control
        </div>

        <div class="hr"></div>
        <button class="btn" onclick="location.hash='#/'">Volver</button>
      `;
      return;
    }

    outlet.innerHTML = `
      <div class="h1">404</div>
      <div class="mut">Ruta no encontrada: <b>${escapeHtml(raw)}</b></div>
      <div class="hr"></div>
      <button class="btn" onclick="location.hash='#/'">Ir al inicio</button>
    `;
  }

  function start() {
    window.addEventListener("hashchange", renderRoute);
    renderRoute();
  }

  return { start };
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
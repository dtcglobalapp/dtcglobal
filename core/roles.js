// core/roles.js
export const ROLE = {
  SUPERADMIN: "superadmin",
  OWNER: "owner",
  ASSISTANT: "assistant",
  STAFF: "staff",
  PARENT: "parent",
};

export const SUPERADMIN_MODES = [
  { key: "ceo", label: "CEO (Felencho)", desc: "Acceso total. Pruebas y auditoría." },
  { key: "owner", label: "Dueño", desc: "Gestión del daycare/organización." },
  { key: "assistant", label: "Asistente", desc: "Vista operativa con límites." },
  { key: "staff", label: "Empleado", desc: "Solo funciones de personal." },
];

const LS_KEY = "dtc.superadmin.mode";

export function normalizeRole(role) {
  return (role || "").toString().trim().toLowerCase();
}

export function isSuperAdmin(profile) {
  return normalizeRole(profile?.role) === ROLE.SUPERADMIN;
}

export function getActiveMode() {
  return localStorage.getItem(LS_KEY) || "";
}

export function setActiveMode(modeKey) {
  localStorage.setItem(LS_KEY, modeKey);
}

export function clearActiveMode() {
  localStorage.removeItem(LS_KEY);
}

export async function ensureModeSelected({ profile, mountEl, onChange }) {
  if (!isSuperAdmin(profile)) return null;

  const current = getActiveMode();
  const exists = SUPERADMIN_MODES.some(m => m.key === current);
  if (exists) return current;

  // Modal simple (sin librerías)
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,.55);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; padding:16px;
  `;

  const card = document.createElement("div");
  card.style.cssText = `
    width:min(760px, 100%);
    background:#111; color:#fff; border:1px solid rgba(255,255,255,.12);
    border-radius:16px; padding:18px;
    box-shadow:0 10px 30px rgba(0,0,0,.45);
  `;

  card.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <div>
        <div style="font-size:18px; font-weight:700;">Entrada SuperAdmin</div>
        <div style="opacity:.8; font-size:13px; margin-top:2px;">
          Felencho, ¿cómo deseas entrar hoy?
        </div>
      </div>
      <button id="dtcCloseMode" title="Cerrar" style="
        background:transparent; border:1px solid rgba(255,255,255,.18);
        color:#fff; border-radius:10px; padding:8px 10px; cursor:pointer;
      ">X</button>
    </div>

    <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:12px; margin-top:14px;">
      ${SUPERADMIN_MODES.map(m => `
        <button class="dtcModeBtn" data-mode="${m.key}" style="
          text-align:left; background:#151515; border:1px solid rgba(255,255,255,.12);
          border-radius:14px; padding:14px; cursor:pointer;
        ">
          <div style="font-weight:700;">${m.label}</div>
          <div style="opacity:.8; font-size:12px; margin-top:4px;">${m.desc}</div>
        </button>
      `).join("")}
    </div>

    <div style="opacity:.7; font-size:12px; margin-top:12px;">
      Puedes cambiar este modo luego desde la barra superior.
    </div>
  `;

  overlay.appendChild(card);
  (mountEl || document.body).appendChild(overlay);

  const closeBtn = card.querySelector("#dtcCloseMode");
  closeBtn.onclick = () => {
    // Si cierra sin elegir, por seguridad lo dejamos sin modo
    overlay.remove();
  };

  await new Promise((resolve) => {
    card.querySelectorAll(".dtcModeBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        setActiveMode(mode);
        overlay.remove();
        onChange?.(mode);
        resolve();
      });
    });
  });

  return getActiveMode();
}
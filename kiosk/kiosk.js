import { validatePin } from "./kiosk-pin.js";
import { saveGuardianCheckIn, saveGuardianCheckOut } from "./kiosk-attendance.js";

const pinInput = document.getElementById("pinInput");
const pinBtn = document.getElementById("pinBtn");
const pinMsg = document.getElementById("pinMsg");
const results = document.getElementById("pinResults");

let currentAccess = null;

async function handlePinLogin() {
  const pin = (pinInput.value || "").trim();

  pinMsg.textContent = "Validando...";
  if (results) results.innerHTML = "";
  currentAccess = null;

  const result = await validatePin(pin);

  if (!result.ok) {
    pinMsg.textContent = result.error || "No se pudo validar el PIN";
    return;
  }

  currentAccess = result;
  pinMsg.textContent = `Bienvenido, ${result.user.display}`;

  // Tutor
  if (result.user.role === "guardian") {
    const children = result.children || [];

    if (!children.length) {
      results.innerHTML = `<p>No hay niños autorizados para este tutor.</p>`;
      return;
    }

    results.innerHTML = `
      <div class="card">
        <h3>Niños autorizados</h3>
        <div class="child-list">
          ${children.map(child => `
            <div class="child-item">
              <div>
                <strong>${child.full_name}</strong>
                ${child.relationship ? `<div>${child.relationship}</div>` : ""}
              </div>
              <div style="display:flex; gap:8px; margin-top:10px; flex-wrap:wrap;">
                <button class="checkin-btn" data-child-id="${child.id}" data-child-name="${child.full_name}">
                  Check In
                </button>
                <button class="checkout-btn" data-child-id="${child.id}" data-child-name="${child.full_name}">
                  Check Out
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    bindGuardianButtons();
    return;
  }

  // Empleado
  if (result.user.role === "employee") {
    results.innerHTML = `
      <div class="card">
        <h3>${result.user.display}</h3>
        <p>Empleado identificado correctamente.</p>
        <p>Próximo paso: Time In / Time Out.</p>
      </div>
    `;
    return;
  }

  // Admin / owner
  results.innerHTML = `
    <div class="card">
      <h3>${result.user.display}</h3>
      <p>Acceso administrativo correcto.</p>
    </div>
  `;
}

function bindGuardianButtons() {
  document.querySelectorAll(".checkin-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentAccess) return;

      const childId = btn.dataset.childId;
      const childName = btn.dataset.childName;

      pinMsg.textContent = `Guardando entrada de ${childName}...`;

      const saved = await saveGuardianCheckIn({
        accessPinId: currentAccess.user.access_pin_id,
        guardianId: currentAccess.user.profile_id,
        guardianName: currentAccess.user.display,
        childId,
        childName,
        method: "pin"
      });

      if (!saved.ok) {
        pinMsg.textContent = saved.error || "No se pudo guardar la entrada";
        return;
      }

      pinMsg.textContent = `${childName} registrado con entrada correctamente.`;
    });
  });

  document.querySelectorAll(".checkout-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentAccess) return;

      const childId = btn.dataset.childId;
      const childName = btn.dataset.childName;

      pinMsg.textContent = `Guardando salida de ${childName}...`;

      const saved = await saveGuardianCheckOut({
        accessPinId: currentAccess.user.access_pin_id,
        guardianId: currentAccess.user.profile_id,
        guardianName: currentAccess.user.display,
        childId,
        childName,
        method: "pin"
      });

      if (!saved.ok) {
        pinMsg.textContent = saved.error || "No se pudo guardar la salida";
        return;
      }

      pinMsg.textContent = `${childName} registrado con salida correctamente.`;
    });
  });
}

pinBtn?.addEventListener("click", handlePinLogin);

pinInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handlePinLogin();
  }
});
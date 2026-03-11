import { mountKioskUI } from "./kiosk-ui.js";
import { validatePin } from "./kiosk-pin.js";
import { supabase } from "../core/supabase.js";

const root = document.getElementById("kiosk-root");

if (!root) {
  document.body.innerHTML = "❌ No encuentro #kiosk-root en kiosk.html";
  throw new Error("Missing #kiosk-root");
}

const ui = mountKioskUI(root, {

  onFace: async () => {

    if (!navigator.onLine) {
      ui.setFaceStatus("Sin internet → usa PIN offline.", false);
      return;
    }

    ui.setFaceStatus("Iniciando cámara (simulado)…");

    await sleep(700);

    const user = {
      role: "employee",
      display: "Rostro: Maria Real",
      employee_id: "e11a6838-391f-4dc0-b2c4-018c4f18f550",
      organization_id: "1454f026-f469-4bf1-8875-fb4fb22ae4d3"
    };

    ui.setFaceStatus(`Rostro OK → ${user.display}. Validando entrada…`, true);

    await processCheckIn(user, "kiosk");
  },

  onPin: async (pin) => {

    const res = validatePin(pin);

    if (!res.ok) {
      ui.setPinStatus(res.error, false);
      return;
    }

    const user = {
      role: res.user.role,
      display: "PIN: Maria Real",
      employee_id: "e11a6838-391f-4dc0-b2c4-018c4f18f550",
      organization_id: "1454f026-f469-4bf1-8875-fb4fb22ae4d3"
    };

    ui.setPinStatus(`PIN OK → ${user.display}. Validando entrada…`, true);

    ui.clearPin();

    await processCheckIn(user, "mobile");
  },

  onReset: () => {
    ui.setFaceStatus("esperando…", true);
    ui.setPinStatus("esperando…", true);
    ui.clearPin();
  }

});

console.log("✅ DTC Kiosco listo");


async function processCheckIn(user, method) {

  try {

    if (!user.organization_id || !user.employee_id) {
      ui.setFaceStatus("Faltan organization_id o employee_id.", false);
      return;
    }

    const pos = await getCurrentPosition();

    const lat = Number(pos.coords.latitude.toFixed(6));
    const lon = Number(pos.coords.longitude.toFixed(6));

    const client = supabase();

    const { data, error } = await client.rpc("dtc_check_in", {

      p_org_id: user.organization_id,
      p_employee_id: user.employee_id,
      p_lat: lat,
      p_lon: lon,
      p_method: method

    });

    if (error) {

      ui.setFaceStatus(`Error SQL: ${error.message}`, false);
      return;

    }

    if (!data || data.status !== "success") {

      ui.setFaceStatus(data?.message || "Check-in rechazado", false);
      return;

    }

    ui.setFaceStatus(`✅ ${data.message}`, true);

    const ticket = encodeURIComponent(JSON.stringify({

      role: user.role,
      display: user.display,
      employee_id: user.employee_id,
      organization_id: user.organization_id,
      checkin: true,
      t: Date.now()

    }));

    window.location.href = `../app.html#/kiosk?role=${encodeURIComponent(user.role)}&ticket=${ticket}`;

  }

  catch (err) {

    ui.setFaceStatus(`Error: ${err.message || err}`, false);

  }

}



function getCurrentPosition() {

  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      reject(new Error("Geolocation no soportado"));
      return;
    }

    navigator.geolocation.getCurrentPosition(

      resolve,

      (err) => reject(new Error(mapGeoError(err))),

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }

    );

  });

}



function mapGeoError(err) {

  switch (err.code) {

    case 1:
      return "Permiso de ubicación denegado";

    case 2:
      return "Ubicación no disponible";

    case 3:
      return "Tiempo agotado al obtener ubicación";

    default:
      return "Error desconocido de geolocalización";

  }

}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
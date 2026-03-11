// En producción: esto vendrá de tu base (y se actualiza por administración).
// Offline: guardaremos una copia local (cache) para no depender de internet.

const DEFAULT_PINS = {
  "1111": { role: "employee", route: "employee" },
  "2222": { role: "guardian", route: "guardian" },
  "9999": { role: "owner", route: "admin" },
};

export function validatePin(pin) {
  if (!pin) return { ok: false, error: "PIN vacío" };
  if (!/^\d{4,8}$/.test(pin)) return { ok: false, error: "PIN inválido (solo números, 4 a 8)" };

  const hit = DEFAULT_PINS[pin];
  if (!hit) return { ok: false, error: "PIN no reconocido" };

  return { ok: true, user: { ...hit, display: `PIN:${pin}` } };
}
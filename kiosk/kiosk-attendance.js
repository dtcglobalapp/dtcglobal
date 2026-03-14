import { supabase } from "../core/supabase.js";

const ORGANIZATION_ID = "b11a6b48-8f83-4737-8e3d-4b79a15a178c";

export async function saveGuardianCheckIn({ accessPinId, guardianId, guardianName, childId, childName, method = "pin" }) {
  const db = supabase();

  const { data, error } = await db
    .from("attendance_logs")
    .insert([
      {
        organization_id: ORGANIZATION_ID,
        access_pin_id: accessPinId,
        actor_role: "guardian",
        actor_profile_id: guardianId,
        guardian_id: guardianId,
        child_id: childId,
        actor_name: guardianName,
        child_name: childName,
        action: "check_in",
        method,
        signed: false,
        notes: "Check-in desde acceso"
      }
    ])
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message || "No se pudo guardar el check-in" };
  }

  return { ok: true, data };
}

export async function saveGuardianCheckOut({ accessPinId, guardianId, guardianName, childId, childName, method = "pin" }) {
  const db = supabase();

  const { data, error } = await db
    .from("attendance_logs")
    .insert([
      {
        organization_id: ORGANIZATION_ID,
        access_pin_id: accessPinId,
        actor_role: "guardian",
        actor_profile_id: guardianId,
        guardian_id: guardianId,
        child_id: childId,
        actor_name: guardianName,
        child_name: childName,
        action: "check_out",
        method,
        signed: false,
        notes: "Check-out desde acceso"
      }
    ])
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message || "No se pudo guardar el check-out" };
  }

  return { ok: true, data };
}
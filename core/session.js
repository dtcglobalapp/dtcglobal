// core/session.js
import { supabase } from "./supabase.js";

export const Role = Object.freeze({
  SUPERADMIN: "superadmin",
  OWNER: "owner",
  ADMIN: "admin",
  STAFF: "staff",
  GUARDIAN: "guardian",
});

const LS_MODE = "DTC_MODE";          // modo de entrada (Felencho)
const LS_ORG  = "DTC_ORG_ID";        // org actual

export function getMode() {
  return localStorage.getItem(LS_MODE) || "auto";
}
export function setMode(mode) {
  localStorage.setItem(LS_MODE, mode);
}

export function getOrgId() {
  return localStorage.getItem(LS_ORG) || "";
}
export function setOrgId(orgId) {
  localStorage.setItem(LS_ORG, orgId || "");
}

export async function getAuthSession() {
  const sb = supabase();
  const { data, error } = await sb.auth.getSession();
  if (error) throw error;
  return data.session || null;
}

export async function signInWithPassword(email, password) {
  const sb = supabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email, password) {
  const sb = supabase();
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function sendMagicLink(email) {
  const sb = supabase();
  const { data, error } = await sb.auth.signInWithOtp({ email });
  if (error) throw error;
  return data;
}

export async function resetPassword(email) {
  const sb = supabase();
  const { data, error } = await sb.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}

export async function signOut() {
  const sb = supabase();
  const { error } = await sb.auth.signOut();
  if (error) throw error;
}

/**
 * Espera que exista tabla: profiles
 * columnas típicas:
 *  - id (uuid = auth.users.id)
 *  - organization_id (uuid)
 *  - role (text)
 *  - full_name (text) opcional
 */
export async function loadProfile(userId) {
  const sb = supabase();
  const { data, error } = await sb
    .from("profiles")
    .select("id, organization_id, role, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export function isSuperAdmin(profile) {
  return (profile?.role || "").toLowerCase() === Role.SUPERADMIN;
}

export function resolveOrgId(profile) {
  // prioridad: org seleccionada manualmente > profile
  return getOrgId() || profile?.organization_id || "";
}
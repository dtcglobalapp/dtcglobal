// core/supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STORAGE_KEY_URL = "DTC_SUPABASE_URL";
const STORAGE_KEY_ANON = "DTC_SUPABASE_ANON_KEY";

// valores fallback para desarrollo local
const FALLBACK_URL = "https://mugufzwvwteoopjdrheq.supabase.co";
const FALLBACK_ANON = "sb_publishable_npn2NhS9fEHAjWHGsbLTSQ_KudyqrFt";

let _client = null;

export function getSupabaseConfig() {
  const url = localStorage.getItem(STORAGE_KEY_URL) || FALLBACK_URL;
  const anon = localStorage.getItem(STORAGE_KEY_ANON) || FALLBACK_ANON;
  return { url, anon };
}

export function setSupabaseConfig({ url, anon }) {
  localStorage.setItem(STORAGE_KEY_URL, (url || "").trim());
  localStorage.setItem(STORAGE_KEY_ANON, (anon || "").trim());
  _client = null;
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_ANON);
  _client = null;
}

export function hasSupabaseConfig() {
  const { url, anon } = getSupabaseConfig();
  return !!url && !!anon;
}

export function supabase() {
  if (_client) return _client;

  const { url, anon } = getSupabaseConfig();

  if (!url || !anon) {
    throw new Error(
      "Supabase config missing. Set DTC_SUPABASE_URL and DTC_SUPABASE_ANON_KEY in localStorage."
    );
  }

  _client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return _client;
}
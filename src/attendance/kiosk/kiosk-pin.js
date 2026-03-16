import { supabase } from "../../../core/supabase.js";

const ORGANIZATION_ID = "b11a6b48-8f83-4737-8e3d-4b79a15a178c";

export async function validatePin(pin) {
  if (!pin) {
    return { ok: false, error: "PIN vacío" };
  }

  if (!/^\d{4,8}$/.test(pin)) {
    return { ok: false, error: "PIN inválido (4-8 números)" };
  }

  const db = supabase();

  const { data: access, error: accessError } = await db
    .from("access_pins")
    .select("id, organization_id, pin, role, profile_id, display_name, route, active")
    .eq("organization_id", ORGANIZATION_ID)
    .eq("pin", pin)
    .eq("active", true)
    .single();

  if (accessError || !access) {
    return { ok: false, error: "PIN no reconocido" };
  }

  // Empleado
  if (access.role === "employee") {
    return {
      ok: true,
      user: {
        access_pin_id: access.id,
        profile_id: access.profile_id,
        role: access.role,
        route: access.route || "employee",
        display: access.display_name || "Empleado"
      }
    };
  }

  // Tutor / guardian
  if (access.role === "guardian") {
    const guardianId = access.profile_id;

    const { data: links, error: linksError } = await db
      .from("guardian_children")
      .select("child_id, relationship, pickup_authorized, is_primary")
      .eq("organization_id", ORGANIZATION_ID)
      .eq("guardian_id", guardianId)
      .eq("pickup_authorized", true);

    if (linksError) {
      return { ok: false, error: "No se pudieron buscar los niños del tutor" };
    }

    const childIds = (links || []).map(row => row.child_id).filter(Boolean);

    let children = [];

    if (childIds.length > 0) {
      const { data: childRows, error: childrenError } = await db
        .from("children")
        .select("id, full_name, first_name, last_name, classroom, active")
        .eq("organization_id", ORGANIZATION_ID)
        .in("id", childIds)
        .eq("active", true);

      if (childrenError) {
        return { ok: false, error: "No se pudieron cargar los niños" };
      }

      children = (childRows || []).map(child => {
        const rel = links.find(link => link.child_id === child.id);
        return {
          id: child.id,
          full_name:
            child.full_name ||
            [child.first_name, child.last_name].filter(Boolean).join(" "),
          classroom: child.classroom || "",
          relationship: rel?.relationship || "",
          is_primary: !!rel?.is_primary
        };
      });
    }

    return {
      ok: true,
      user: {
        access_pin_id: access.id,
        profile_id: guardianId,
        role: access.role,
        route: access.route || "guardian",
        display: access.display_name || "Tutor"
      },
      children
    };
  }

  // Owner / admin
  return {
    ok: true,
    user: {
      access_pin_id: access.id,
      profile_id: access.profile_id,
      role: access.role,
      route: access.route || "admin",
      display: access.display_name || "Administrador"
    }
  };
}
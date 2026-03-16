export function initChildProfileDaily({
  supabase,
  organizationId,
  childId,
  activateTab,
  formatDateTime,
  yesNo,
  setListEmpty
}) {
  const dailyTimelineList = document.getElementById("dailyTimelineList");

  const dailyEventFormWrap = document.getElementById("dailyEventFormWrap");
  const dailyEventType = document.getElementById("dailyEventType");
  const dailyEventCategory = document.getElementById("dailyEventCategory");
  const dailyEventTitle = document.getElementById("dailyEventTitle");
  const dailyEventDescription = document.getElementById("dailyEventDescription");
  const dailyEventBodyArea = document.getElementById("dailyEventBodyArea");
  const dailyEventSeverity = document.getElementById("dailyEventSeverity");
  const dailyEventStaff = document.getElementById("dailyEventStaff");
  const dailyEventSource = document.getElementById("dailyEventSource");
  const dailyVisibleToGuardians = document.getElementById("dailyVisibleToGuardians");
  const dailyRequiresAttention = document.getElementById("dailyRequiresAttention");
  const saveDailyEventBtn = document.getElementById("saveDailyEventBtn");
  const cancelDailyEventBtn = document.getElementById("cancelDailyEventBtn");
  const dailyEventStatus = document.getElementById("dailyEventStatus");
  const quickButtons = document.querySelectorAll(".quick-event-btn");

  function getPresets() {
    return {
      arrival_observation: {
        type: "arrival_observation",
        category: "health",
        title: "Observación al llegar",
        source: "manual",
        attention: true
      },
      meal: {
        type: "meal",
        category: "care",
        title: "Comida",
        source: "feeding",
        attention: false
      },
      nap_start: {
        type: "nap_start",
        category: "care",
        title: "Inicio de siesta",
        source: "sleep",
        attention: false
      },
      activity: {
        type: "activity",
        category: "activity",
        title: "Actividad",
        source: "manual",
        attention: false
      },
      note: {
        type: "note",
        category: "communication",
        title: "Nota del día",
        source: "manual",
        attention: false
      }
    };
  }

  function clearQuickButtonState() {
    quickButtons.forEach(btn => btn.classList.remove("active"));
  }

  function openDailyForm(type = "note") {
    const presets = getPresets();
    const preset = presets[type] || presets.note;

    clearQuickButtonState();
    const activeBtn = document.querySelector(`.quick-event-btn[data-type="${preset.type}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    dailyEventStatus.textContent = "";
    dailyEventFormWrap.classList.add("active");

    dailyEventType.value = preset.type;
    dailyEventCategory.value = preset.category;
    dailyEventTitle.value = preset.title;
    dailyEventSource.value = preset.source;
    dailyEventDescription.value = "";
    dailyEventBodyArea.value = "";
    dailyEventSeverity.value = "";
    dailyEventStaff.value = "Miriam";
    dailyVisibleToGuardians.checked = true;
    dailyRequiresAttention.checked = preset.attention;
  }

  function closeDailyForm() {
    dailyEventFormWrap.classList.remove("active");
    dailyEventStatus.textContent = "";
    clearQuickButtonState();
  }

  async function loadDailyTimeline() {
    const db = supabase();

    const { data, error } = await db
      .from("child_timeline_events")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("child_id", childId)
      .order("event_time", { ascending: false });

    if (error) {
      setListEmpty(dailyTimelineList, error.message || "No se pudo cargar el día a día.");
      return;
    }

    const rows = data || [];

    if (!rows.length) {
      setListEmpty(dailyTimelineList, "No hay eventos diarios registrados todavía.");
      return;
    }

    dailyTimelineList.innerHTML = rows.map(row => `
      <article class="list-card">
        <div class="timeline-top">
          <h3>${row.title}</h3>
          <span class="tag">${row.event_type}</span>
        </div>

        <div class="list-meta">
          <div><strong>Categoría:</strong> ${row.event_category || "—"}</div>
          <div><strong>Descripción:</strong> ${row.description || "Sin descripción."}</div>
          <div><strong>Staff:</strong> ${row.staff_name || "—"}</div>
          <div><strong>Hora:</strong> ${formatDateTime(row.event_time)}</div>
          ${row.body_area ? `<div><strong>Área del cuerpo:</strong> ${row.body_area}</div>` : ""}
          ${row.severity ? `<div><strong>Severidad:</strong> ${row.severity}</div>` : ""}
        </div>

        <div class="pill-row">
          <span class="pill muted">Módulo: ${row.source_module || "manual"}</span>
          <span class="pill muted">Visible a padres: ${yesNo(row.is_visible_to_guardians)}</span>
          ${row.requires_attention ? `<span class="pill attention">Requiere atención</span>` : ""}
        </div>
      </article>
    `).join("");
  }

  async function saveDailyEvent() {
    dailyEventStatus.textContent = "Guardando evento...";

    const db = supabase();

    const payload = {
      organization_id: organizationId,
      child_id: childId,
      event_type: dailyEventType.value,
      event_category: dailyEventCategory.value,
      title: dailyEventTitle.value.trim() || "Evento",
      description: dailyEventDescription.value.trim() || null,
      source_module: dailyEventSource.value,
      staff_name: dailyEventStaff.value.trim() || null,
      is_visible_to_guardians: dailyVisibleToGuardians.checked,
      requires_attention: dailyRequiresAttention.checked,
      body_area: dailyEventBodyArea.value.trim() || null,
      severity: dailyEventSeverity.value || null
    };

    const { error } = await db
      .from("child_timeline_events")
      .insert([payload]);

    if (error) {
      dailyEventStatus.textContent = error.message || "No se pudo guardar el evento.";
      return;
    }

    await loadDailyTimeline();
    dailyEventStatus.textContent = "Evento guardado correctamente.";
    closeDailyForm();
  }

  quickButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activateTab("daily");
      openDailyForm(btn.dataset.type);
    });
  });

  cancelDailyEventBtn?.addEventListener("click", closeDailyForm);
  saveDailyEventBtn?.addEventListener("click", saveDailyEvent);

  return {
    loadDailyTimeline,
    openDailyForm,
    closeDailyForm
  };
}
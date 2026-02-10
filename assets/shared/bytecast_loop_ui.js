(() => {
  const Loop = window.ByteCastLoop || null;
  if (!Loop) {
    window.ByteCastLoopUI = {
      renderJourneyMap: () => {},
    };
    return;
  }

  const DEFAULT_CONFIG_URL = "./data/journey_steps.json";
  const STYLE_ID = "bc-loop-ui-style-v1";
  const ACTIVE_JOURNEY_KEY = "bytecast.journey.active";
  const LEGACY_ACTIVE_JOURNEY_KEY = "bytecast.journey.active.v1";
  const SHOW_DONE_KEY = "bytecast.loopui.show_done.v1";
  const LOOP_UI_VERSION = "bytecast_loop_ui_v2";

  function shouldTrack() {
    try {
      if (location.protocol === "file:") return false;
    } catch {
      // ignore
    }
    // If umami is missing, noop.
    const um = window.umami;
    return Boolean(um && (typeof um === "function" || typeof um.track === "function"));
  }

  function track(eventName, data) {
    if (!shouldTrack()) return;
    const um = window.umami;
    try {
      if (um && typeof um.track === "function") {
        um.track(eventName, data);
        return;
      }
      if (typeof um === "function") {
        um(eventName, data);
      }
    } catch {
      // ignore
    }
  }

  function trackOnce(key, eventName, data) {
    if (!shouldTrack()) return;
    try {
      const k = `bc.umami.once.${key}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {
      // ignore
    }
    track(eventName, data);
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .bc-journey {
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.14);
        background: linear-gradient(140deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        padding: 14px;
      }
      .bc-journey__head { display:flex; align-items:flex-start; justify-content:space-between; gap: 12px; flex-wrap:wrap; }
      .bc-journey__title { margin:0; font: 800 16px/1.2 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; letter-spacing:-0.01em; }
      .bc-journey__sub { margin: 4px 0 0; color: rgba(255,255,255,0.66); font-size: 13px; line-height: 1.35; max-width: 90ch; }
      .bc-journey__cta { display:flex; gap: 10px; flex-wrap:wrap; align-items:center; justify-content:flex-end; }
      .bc-journey__btn {
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.03);
        color: rgba(255,255,255,0.93);
        padding: 10px 12px;
        font-size: 13px;
        cursor: pointer;
        text-decoration:none;
        display:inline-flex;
        gap: 10px;
        align-items:center;
        transition: transform .12s ease, border-color .2s ease, box-shadow .2s ease;
      }
      .bc-journey__btn:hover { transform: translateY(-1px); border-color: rgba(100,180,255,0.25); box-shadow: 0 0 18px rgba(34,167,255,0.20); text-decoration:none; }
      .bc-journey__btn--legendary {
        border-color: rgba(255,196,90,0.55);
        background: linear-gradient(180deg, rgba(255,196,90,0.16), rgba(255,196,90,0.08));
        box-shadow: 0 0 22px rgba(255,196,90,0.34), 0 0 44px rgba(255,153,0,0.14);
        font-weight: 800;
      }

      .bc-journey__list { margin-top: 12px; display:grid; gap: 10px; }
      .bc-journey[data-show-done="0"] .bc-step.is-done { display: none; }

      details.bc-group{
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(0,0,0,0.12);
        padding: 10px 10px 12px;
      }
      details.bc-group > summary{
        list-style:none;
        cursor:pointer;
        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 12px;
        font-weight: 900;
        color: rgba(255,255,255,0.90);
      }
      details.bc-group > summary::-webkit-details-marker{ display:none; }
      .bc-group__meta{ display:flex; gap: 8px; flex-wrap:wrap; align-items:center; justify-content:flex-end; }
      .bc-group__body{ margin-top: 10px; display:grid; gap: 10px; }
      .bc-step {
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.18);
        padding: 12px;
        display:flex;
        gap: 12px;
        align-items:flex-start;
        justify-content:space-between;
      }
      .bc-step.is-next { border-color: rgba(255,196,90,0.38); box-shadow: 0 0 22px rgba(255,196,90,0.14); }
      .bc-step.is-done { border-color: rgba(34,167,255,0.26); }
      .bc-step.is-locked { opacity: 0.78; }
      .bc-step__left { display:flex; gap: 12px; align-items:flex-start; min-width: 0; }
      .bc-lane {
        width: 14px; height: 14px; border-radius: 999px; margin-top: 3px;
        background: rgba(255,255,255,0.22);
        box-shadow: 0 0 18px rgba(255,255,255,0.08);
        flex: 0 0 auto;
      }
      .bc-lane[data-lane="bytecast"] { background: #22a7ff; box-shadow: 0 0 18px rgba(34,167,255,0.28); }
      .bc-lane[data-lane="training"] { background: #ffc45a; box-shadow: 0 0 18px rgba(255,196,90,0.24); }
      .bc-lane[data-lane="seed"] { background: #a66bff; box-shadow: 0 0 18px rgba(166,107,255,0.22); }
      .bc-lane[data-lane="badge"] { background: #ff6a2a; box-shadow: 0 0 18px rgba(255,106,42,0.18); }

      .bc-step__label { margin:0; font-weight: 800; color: rgba(255,255,255,0.92); white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }
      .bc-step__meta { margin: 4px 0 0; color: rgba(255,255,255,0.62); font-size: 12px; line-height: 1.35; }
      .bc-step__right { display:flex; gap: 8px; flex-wrap:wrap; align-items:center; justify-content:flex-end; }
      .bc-chip {
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.03);
        color: rgba(255,255,255,0.78);
        padding: 3px 10px;
        font: 800 11px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      .bc-chip--next { border-color: rgba(255,196,90,0.45); background: rgba(255,196,90,0.10); color: rgba(248,223,169,0.95); }
      .bc-chip--done { border-color: rgba(34,167,255,0.35); background: rgba(34,167,255,0.12); color: rgba(159,232,255,0.95); }
      .bc-chip--locked { border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.55); }
      .bc-step__open { text-decoration:none; }
      .bc-step__open:hover { text-decoration: underline; text-underline-offset: 3px; }
      .bc-step__open.is-disabled { pointer-events:none; opacity: 0.6; text-decoration:none; }
      @media (prefers-reduced-motion: reduce){
        .bc-journey__btn{ transition:none; }
        .bc-journey__btn:hover{ transform:none; }
      }
    `;
    document.head.appendChild(style);
  }

  function laneOf(step) {
    const lane = String(step?.lane || "").toLowerCase().trim();
    return lane || "unknown";
  }

  function groupOf(step) {
    const group = String(step?.group || "").trim();
    if (group) return group;
    const lane = laneOf(step);
    if (lane === "bytecast") return "ByteCast";
    if (lane === "training") return "Training";
    if (lane === "seed") return "Seeding";
    if (lane === "badge") return "Badge";
    return "Steps";
  }

  function dependsText(step) {
    const deps = Array.isArray(step?.depends_on) ? step.depends_on : [];
    if (!deps.length) return "";
    return `depends on: ${deps.join(", ")}`;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#39;");
  }

  async function renderJourneyMap(opts) {
    ensureStyle();
    const container = opts?.container;
    if (!container) return;

    const configUrl = opts?.configUrl || DEFAULT_CONFIG_URL;
    const requestedJourneyId = opts?.journeyId || "";
    const pickerEnabled = opts?.picker !== false;
    const surface = opts?.surface || "unknown";

    const config = await Loop.loadJourneyConfig(configUrl, null);
    const journeys = Array.isArray(config?.journeys) ? config.journeys : [];
    const storedJourneyId = (() => {
      try {
        const id = localStorage.getItem(ACTIVE_JOURNEY_KEY);
        if (id) return id;
        const legacy = localStorage.getItem(LEGACY_ACTIVE_JOURNEY_KEY);
        if (legacy) {
          localStorage.setItem(ACTIVE_JOURNEY_KEY, legacy);
          return legacy;
        }
      } catch {
        // ignore
      }
      return "";
    })();

    const defaultJourneyId = journeys.find((j) => j && j.isDefault)?.id || "";
    const desired = requestedJourneyId || storedJourneyId || defaultJourneyId || (journeys[0]?.id || "");
    const journeyId = journeys.some((j) => j && j.id === desired) ? desired : (journeys[0]?.id || "");
    const journey = Loop.getJourneyById(config, journeyId);
    if (!journey) {
      container.innerHTML = `<div class="bc-journey"><p class="bc-journey__sub">Journey not found.</p></div>`;
      return;
    }

    try { if (journeyId && journeyId !== storedJourneyId) localStorage.setItem(ACTIVE_JOURNEY_KEY, journeyId); } catch {}

    const wf2 = Loop.ensureWorkflowV2(journeyId);

    const badgeResult = Loop.ensureJourneyBadges(journey, wf2);
    if (badgeResult?.minted || badgeResult?.marked) {
      Loop.saveWorkflowV2?.(wf2, journeyId);
    }

    const rawSteps = Array.isArray(journey.steps) ? journey.steps : [];
    const steps = Loop.sortSteps ? Loop.sortSteps(rawSteps) : rawSteps.slice();
    const next = Loop.getNextStep(journey, wf2);
    const nextId = next?.id || "";

    trackOnce(
      `${surface}.${journeyId}`,
      "loop_loaded",
      { surface, journeyId, nextStepId: nextId, workflowVersion: "v2" }
    );

    const primaryHref = next?.href ? Loop.resolveFromRoot(next.href) : "";
    const primaryText = next?.cta || (next ? `Open: ${next.label}` : "No next step");

    const showDone = (() => {
      try {
        const raw = localStorage.getItem(SHOW_DONE_KEY);
        if (!raw) return true;
        return raw === "1";
      } catch {
        return true;
      }
    })();

    const pickerHtml = (pickerEnabled && journeys.length > 1) ? `
      <label style="display:flex; gap:8px; align-items:center; color: rgba(255,255,255,0.72); font: 800 11px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing:.06em; text-transform:uppercase;">
        Journey
        <select data-bc-journey-pick="1" style="border-radius:999px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.92); padding: 8px 10px; font: 700 12px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
          ${journeys.map((j) => {
            const id = j?.id || "";
            const label = j?.label || id;
            const sel = id === journeyId ? "selected" : "";
            return `<option value="${escapeHtml(id)}" ${sel}>${escapeHtml(label)}</option>`;
          }).join("")}
        </select>
      </label>
    ` : "";

    const showDoneHtml = `
      <label style="display:flex; gap:8px; align-items:center; color: rgba(255,255,255,0.72); font: 800 11px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing:.06em; text-transform:uppercase;">
        <input data-bc-show-done="1" type="checkbox" ${showDone ? "checked" : ""} style="width:16px;height:16px;accent-color:#22a7ff;" />
        show done
      </label>
    `;

    const stepHtml = (step) => {
      const done = Loop.isStepComplete(journey, step, wf2);
      const unlocked = Loop.isStepUnlocked(journey, step, wf2);
      const isNext = Boolean(step?.id && step.id === nextId);
      const status = done ? "done" : (isNext ? "next" : (unlocked ? "open" : "locked"));
      const href = step?.href ? Loop.resolveFromRoot(step.href) : "";
      const deps = dependsText(step);
      const lane = laneOf(step);
      const group = groupOf(step);
      const est = Number(step?.estimatedMinutes);
      const estText = Number.isFinite(est) && est > 0 ? `est: ${Math.round(est)}m` : "";

      const chip = done
        ? `<span class="bc-chip bc-chip--done">Done</span>`
        : (isNext ? `<span class="bc-chip bc-chip--next">Next</span>` : (unlocked ? `<span class="bc-chip">Open</span>` : `<span class="bc-chip bc-chip--locked">Locked</span>`));

      const open = unlocked && href
        ? `<a class="bc-step__open" data-bc-cta="1" data-step-id="${escapeHtml(step.id)}" data-lane="${escapeHtml(lane)}" href="${escapeHtml(href)}">Open</a>`
        : `<span class="bc-step__open is-disabled" title="${escapeHtml(deps || "Locked")}">Open</span>`;

      const metaParts = [deps, estText].filter(Boolean);
      const metaLine = metaParts.length ? `<div class="bc-step__meta" title="${escapeHtml(metaParts.join(" • "))}">${escapeHtml(metaParts.join(" • "))}</div>` : "";

      return `
        <div class="bc-step ${done ? "is-done" : ""} ${isNext ? "is-next" : ""} ${!unlocked && !done ? "is-locked" : ""}" data-status="${escapeHtml(status)}" data-group="${escapeHtml(group)}">
          <div class="bc-step__left">
            <span class="bc-lane" data-lane="${escapeHtml(lane)}" aria-hidden="true"></span>
            <div style="min-width:0;">
              <div class="bc-step__label" title="${escapeHtml(step.label || step.id)}">${escapeHtml(step.label || step.id)}</div>
              ${metaLine}
            </div>
          </div>
          <div class="bc-step__right">
            ${chip}
            ${open}
          </div>
        </div>
      `;
    };

    const grouped = new Map();
    for (const step of steps) {
      if (!step) continue;
      const done = Loop.isStepComplete(journey, step, wf2);
      if (!showDone && done) continue;
      const g = groupOf(step);
      if (!grouped.has(g)) grouped.set(g, []);
      grouped.get(g).push(step);
    }

    const groupEntries = [...grouped.entries()].map(([groupName, groupSteps]) => {
      const hasNext = groupSteps.some((s) => s && s.id === nextId);
      const doneCount = groupSteps.filter((s) => Loop.isStepComplete(journey, s, wf2)).length;
      const totalCount = groupSteps.length;
      const openAttr = hasNext ? "open" : "";
      const body = groupSteps.map(stepHtml).join("");
      return `
        <details class="bc-group" ${openAttr}>
          <summary>
            <span>${escapeHtml(groupName)}</span>
            <span class="bc-group__meta">
              <span class="bc-chip">${escapeHtml(String(doneCount))}/${escapeHtml(String(totalCount))}</span>
              ${hasNext ? `<span class="bc-chip bc-chip--next">Next</span>` : ``}
            </span>
          </summary>
          <div class="bc-group__body">${body}</div>
        </details>
      `;
    }).join("");

    container.innerHTML = `
      <div class="bc-journey" data-journey-id="${escapeHtml(journeyId)}" data-show-done="${showDone ? "1" : "0"}">
        <div class="bc-journey__head">
          <div>
            <h3 class="bc-journey__title">${escapeHtml(journey.label || "Journey")}</h3>
            <p class="bc-journey__sub">${escapeHtml(journey.description || "Follow the loop. Finish steps. Earn badges.")}</p>
          </div>
          <div class="bc-journey__cta">
            ${pickerHtml}
            ${showDoneHtml}
            ${primaryHref ? `<a class="bc-journey__btn bc-journey__btn--legendary" data-bc-primary="1" data-step-id="${escapeHtml(nextId)}" data-lane="${escapeHtml(laneOf(next))}" href="${escapeHtml(primaryHref)}">${escapeHtml(primaryText)}</a>` : `<span class="bc-journey__btn bc-journey__btn--legendary" style="opacity:.6; pointer-events:none;">${escapeHtml(primaryText)}</span>`}
          </div>
        </div>
        <div class="bc-journey__list" role="list" aria-label="Journey steps">
          ${groupEntries}
        </div>
      </div>
    `;

    if (!container.dataset.bcJourneyBound) {
      container.dataset.bcJourneyBound = "1";
      container.addEventListener("click", (ev) => {
        const a = ev.target?.closest?.("a[data-bc-cta],a[data-bc-primary]");
        if (!a) return;
        const stepId = a.getAttribute("data-step-id") || "";
        const lane = a.getAttribute("data-lane") || "";
        const primary = Boolean(a.hasAttribute("data-bc-primary"));
        track("cta_clicked", { version: LOOP_UI_VERSION, surface, journeyId, stepId, lane, primary });
      });

      container.addEventListener("change", (ev) => {
        const sel = ev.target?.closest?.("select[data-bc-journey-pick]");
        if (!sel) return;
        const nextJourneyId = String(sel.value || "").trim();
        if (!nextJourneyId) return;
        try { localStorage.setItem(ACTIVE_JOURNEY_KEY, nextJourneyId); } catch {}
        void renderJourneyMap({ ...opts, journeyId: nextJourneyId });
      });

      container.addEventListener("change", (ev) => {
        const cb = ev.target?.closest?.("input[data-bc-show-done]");
        if (!cb) return;
        const v = cb.checked ? "1" : "0";
        try { localStorage.setItem(SHOW_DONE_KEY, v); } catch {}
        void renderJourneyMap({ ...opts });
      });
    }
  }

  window.ByteCastLoopUI = {
    renderJourneyMap,
  };
})();

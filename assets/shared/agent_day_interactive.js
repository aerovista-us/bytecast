/**
 * Interactive journey stepper + hands-on practice labs for Agent Day episodes.
 *
 * Usage:
 *   ByteCastAgentDayInteractive.mountJourneyStepper({ profile, mount, storageKey, onProgress, listenApi })
 *   ByteCastAgentDayInteractive.mountPracticeLabs({ profile, mount, storageKey, onLabsComplete })
 */
(function (global) {
  "use strict";

  const POCKET_KEY = "bc.agent_day.pocket_law.v1";

  function savePocketLaw(entry) {
    try {
      localStorage.setItem(POCKET_KEY, JSON.stringify(entry));
    } catch {}
  }

  function readPocketLaw() {
    try {
      return JSON.parse(localStorage.getItem(POCKET_KEY) || "null");
    } catch {
      return null;
    }
  }

  /** Show yesterday's one line so Days 2–10 open with retention, not a syllabus dump. */
  function renderPocketLaw(mount, currentDay) {
    if (!mount) return;
    const pocket = readPocketLaw();
    if (!pocket?.law || !currentDay || pocket.day !== currentDay - 1) {
      mount.hidden = true;
      mount.innerHTML = "";
      return;
    }
    mount.hidden = false;
    mount.innerHTML = `<p class="pocket-law"><span class="pocket-law__label">Carry forward · Day ${pocket.day}</span> ${escapeHtml(pocket.law)}</p>`;
  }

  function resolveLabs(profile) {
    const reg = global.ByteCastAgentDayLabs?.REGISTRY || {};
    const ids = profile.interactives?.labs || [];
    const day = getDay(profile);
    if (!ids.length && day === 1) {
      return ["door_router", "state_sorter", "lost_agent"].map((id) => reg[id]).filter(Boolean);
    }
    return ids.map((id) => reg[id]).filter(Boolean);
  }

  function labChoices(profile, lab) {
    return global.ByteCastAgentDayLabs?.resolveChoices?.(profile, lab) || [];
  }

  function escapeHtml(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function loadJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function getDay(profile) {
    return profile?.episode_runtime?.day || profile?.interactives?.day || 1;
  }

  function doorChoices(profile) {
    return (profile.doors || []).map((d) => ({
      id: d.id,
      label: d.name
    }));
  }

  function stateChoices(profile) {
    return (profile.state_labels || []).map((s) => ({
      id: s.label,
      label: s.label
    }));
  }

  function mountJourneyStepper(opts) {
    const { profile, mount, storageKey, onProgress, listenApi, nxPlayer } = opts;
    if (!mount || !profile?.script?.sections?.length) return null;

    const day = getDay(profile);
    const Visuals = global.ByteCastAgentDayVisuals;
    const sections = profile.script.sections;
    let state = loadJson(storageKey, { index: 0, segments: {}, micro: {} });
    if (!state.segments) state.segments = {};
    if (!state.micro) state.micro = {};

    function persist() {
      saveJson(storageKey, state);
      onProgress?.(state);
    }

    function segmentDone(id) {
      return !!state.segments[id];
    }

    function allSegmentsDone() {
      return sections.every((s) => segmentDone(s.id));
    }

    function microPassed(id) {
      const check = Visuals?.microCheck?.(day, id);
      if (!check) return true;
      return state.micro[id] === true;
    }

    function canAdvanceFrom(index) {
      const seg = sections[index];
      if (!seg) return false;
      return microPassed(seg.id);
    }

    function render() {
      const idx = Math.min(state.index, sections.length - 1);
      const seg = sections[idx];
      const svg = Visuals?.svg?.(day, seg.id) || "";
      const highlight =
        Visuals?.highlight?.(day, seg.id, profile) ||
        (seg.paragraphs?.[0] ? String(seg.paragraphs[0]).slice(0, 180) + "…" : "");
      const micro = Visuals?.microCheck?.(day, seg.id);

      mount.innerHTML = `
        <div class="journey-stepper">
          <div class="stepper-track" role="tablist" aria-label="Journey segments">
            ${sections
              .map(
                (s, i) =>
                  `<button type="button" class="stepper-dot${i === idx ? " is-current" : ""}${segmentDone(s.id) ? " is-done" : ""}" data-goto="${i}" title="${escapeHtml(s.title)}" aria-label="Segment ${i + 1}: ${escapeHtml(s.title)}"></button>`
              )
              .join("")}
          </div>
          <article class="stepper-card" data-seg="${seg.id}">
            ${svg}
            <h3>${idx + 1}. ${escapeHtml(seg.title)}</h3>
            <div class="time" style="font-family:var(--mono);font-size:11px;color:var(--faint);margin-bottom:8px">${escapeHtml(seg.time || "")}</div>
            ${highlight ? `<p class="key-takeaway">${escapeHtml(highlight)}</p>` : ""}
            <details>
              <summary>Read full script</summary>
              ${(seg.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
            </details>
            ${
              micro
                ? `<fieldset class="micro-check${state.micro[seg.id] ? " is-pass" : ""}" data-micro="${seg.id}">
              <legend>Quick check</legend>
              <p style="margin:0 0 8px;font-size:13px">${escapeHtml(micro.q)}</p>
              ${micro.choices
                .map(
                  (c, i) =>
                    `<label class="choice" style="display:block;margin:6px 0"><input type="radio" name="micro_${seg.id}" value="${i}" ${state.micro[seg.id] ? "disabled" : ""}/> ${escapeHtml(c)}</label>`
                )
                .join("")}
              <p class="micro-feedback status" style="margin-top:8px;font-size:12px"></p>
            </fieldset>`
                : ""
            }
            <div class="stepper-nav">
              <button type="button" class="btn" data-prev ${idx === 0 ? "disabled" : ""}>← Previous</button>
              <button type="button" class="btn btn--ghost" data-listen>Listen to section</button>
              ${
                idx < sections.length - 1
                  ? `<button type="button" class="btn btn--primary" data-next ${canAdvanceFrom(idx) ? "" : "disabled"}>Next →</button>`
                  : `<button type="button" class="btn btn--primary" data-finish ${allSegmentsDone() && canAdvanceFrom(idx) ? "" : "disabled"}>Finish journey</button>`
              }
              <span class="stepper-progress">${idx + 1} / ${sections.length}</span>
            </div>
          </article>
        </div>`;

      mount.querySelectorAll("[data-goto]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.index = Number(btn.dataset.goto);
          persist();
          render();
        });
      });

      mount.querySelector("[data-prev]")?.addEventListener("click", () => {
        if (state.index > 0) {
          state.index--;
          persist();
          render();
        }
      });

      mount.querySelector("[data-next]")?.addEventListener("click", () => {
        if (!canAdvanceFrom(state.index)) return;
        state.segments[seg.id] = true;
        if (state.index < sections.length - 1) state.index++;
        persist();
        render();
      });

      mount.querySelector("[data-finish]")?.addEventListener("click", () => {
        if (!canAdvanceFrom(state.index)) return;
        state.segments[seg.id] = true;
        persist();
        render();
        onProgress?.(state, { journeyComplete: allSegmentsDone() });
      });

      mount.querySelector("[data-listen]")?.addEventListener("click", () => {
        if (listenApi?.startSection) listenApi.startSection(seg.id);
        else if (nxPlayer) {
          fetch("assets/narration.manifest.json", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .then((m) => {
              const track = m?.tracks?.find((t) => t.id === seg.id || t.sectionId === seg.id);
              if (track) nxPlayer.playTracks([track]);
            })
            .catch(() => {});
        }
      });

      if (micro) {
        mount.querySelectorAll(`input[name="micro_${seg.id}"]`).forEach((inp) => {
          inp.addEventListener("change", () => {
            const picked = Number(inp.value);
            const fb = mount.querySelector(".micro-feedback");
            if (picked === micro.answer) {
              state.micro[seg.id] = true;
              state.segments[seg.id] = true;
              persist();
              fb.textContent = micro.explain || "Correct.";
              render();
            } else {
              fb.textContent = "Not quite — re-read the key takeaway and try again.";
              mount.querySelector(".micro-check")?.classList.add("is-fail");
            }
          });
        });
      }
    }

    render();
    return {
      getState: () => state,
      allSegmentsDone,
      markAllDone() {
        sections.forEach((s) => {
          state.segments[s.id] = true;
        });
        persist();
        render();
      }
    };
  }

  function renderScenarioLab(lab, profile, labState, onUpdate) {
    const choices = labChoices(profile, lab);
    const scenarios = lab.scenarios || [];
    const idx = labState.index || 0;
    const score = labState.score || 0;
    const sc = scenarios[idx];
    if (!sc) {
      const passed = score >= (lab.passScore || scenarios.length);
      labState.done = passed;
      onUpdate();
      return `<p class="lab-score">${passed ? "✓" : "↻"} Score ${score}/${scenarios.length}. ${passed ? "Practice solid." : "Review Reference and retry."}</p>`;
    }
    return `
      <p class="lab-scenario"><strong>Scenario ${idx + 1}/${scenarios.length}:</strong> ${escapeHtml(sc.text)}</p>
      <div class="lab-choices">
        ${choices
          .map(
            (c) =>
              `<button type="button" class="lab-choice" data-choice="${escapeHtml(c.id)}">${escapeHtml(c.label)}</button>`
          )
          .join("")}
      </div>
      <p class="lab-score">Score: ${score}/${scenarios.length}</p>`;
  }

  function renderProtocolLab(lab, labState, onUpdate) {
    const step = labState.step || 0;
    const steps = lab.steps;
    if (step >= steps.length) {
      labState.done = true;
      onUpdate();
      return `<p class="lab-score">✓ Protocol complete — you surfaced uncertainty without expanding fog.</p>`;
    }
    const prompts = [
      "Stop expanding. Do not open new fronts.",
      "Name the unknown with precision: conflicting states, missing authority.",
      "Route to the right door: registry for authority, NXCore for live reality.",
      "Ask the minimum useful question — not a vague work-back.",
      "Leave a recovery note: checked, found, unresolved, next action."
    ];
    return `
      <p class="lab-scenario">${escapeHtml(lab.scenario)}</p>
      <div class="protocol-steps">
        ${steps
          .map(
            (s, i) =>
              `<div class="protocol-step${i < step ? " is-done" : ""}${i === step ? " is-active" : ""}">${i + 1}. ${s}</div>`
          )
          .join("")}
      </div>
      <p style="font-size:13px;color:var(--muted);margin:8px 0">${escapeHtml(prompts[step])}</p>
      <button type="button" class="btn btn--primary" data-protocol-next>Step ${step + 1}: ${steps[step]}</button>`;
  }

  function mountPracticeLabs(opts) {
    const { profile, mount, storageKey, onLabsComplete } = opts;
    if (!mount) return null;

    const labs = resolveLabs(profile);

    if (!labs.length) {
      mount.innerHTML = `<p class="sub">Practice labs coming soon for this day.</p>`;
      return null;
    }

    let state = loadJson(storageKey, { labs: {} });
    if (!state.labs) state.labs = {};

    function allLabsDone() {
      return labs.every((l) => state.labs[l.id]?.done);
    }

    function persist() {
      saveJson(storageKey, state);
      if (allLabsDone()) onLabsComplete?.(state);
    }

    function bindLabEvents(card, lab) {
      const labState = state.labs[lab.id] || { index: 0, score: 0, step: 0 };
      state.labs[lab.id] = labState;

      const rerender = () => {
        persist();
        render();
      };

      if (lab.type === "protocol") {
        card.querySelector("[data-protocol-next]")?.addEventListener("click", () => {
          labState.step = (labState.step || 0) + 1;
          rerender();
        });
        return;
      }

      card.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const sc = lab.scenarios[labState.index];
          const correct = btn.dataset.choice === sc.answer;
          btn.classList.add(correct ? "is-correct" : "is-wrong");
          if (correct) labState.score = (labState.score || 0) + 1;
          setTimeout(() => {
            labState.index = (labState.index || 0) + 1;
            rerender();
          }, correct ? 400 : 900);
        });
      });
    }

    function render() {
      mount.innerHTML = `
        <p class="panel-tip">Hands-on practice — complete all labs to unlock the final journey checkpoint.</p>
        <div class="practice-progress">
          ${labs
            .map(
              (l) =>
                `<span class="chip${state.labs[l.id]?.done ? " done" : ""}">${state.labs[l.id]?.done ? "✓" : "○"} ${escapeHtml(l.title)}</span>`
            )
            .join("")}
        </div>
        <div class="lab-grid">
          ${labs
            .map((lab) => {
              const labState = state.labs[lab.id] || {};
              let body = "";
              if (lab.type === "protocol") body = renderProtocolLab(lab, labState, () => render());
              else body = renderScenarioLab(lab, profile, labState, () => render());
              return `<div class="lab-card${labState.done ? " is-done" : ""}" data-lab="${lab.id}">
                <h3>${escapeHtml(lab.title)}</h3>
                <p class="lab-desc">${escapeHtml(lab.description)}</p>
                <div class="lab-body">${body}</div>
              </div>`;
            })
            .join("")}
        </div>`;

      labs.forEach((lab) => {
        const card = mount.querySelector(`[data-lab="${lab.id}"]`);
        if (card) bindLabEvents(card, lab);
      });
    }

    render();
    return { getState: () => state, allLabsDone };
  }

  global.ByteCastAgentDayInteractive = {
    mountJourneyStepper,
    mountPracticeLabs,
    savePocketLaw,
    readPocketLaw,
    renderPocketLaw,
    POCKET_KEY
  };
})(typeof window !== "undefined" ? window : globalThis);

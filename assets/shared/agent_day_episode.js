/**
 * Shared gate → journey → reference → check → prove shell for Agent Day episodes (5+).
 * Profile must include `episode_runtime` with workflow step ids and storage keys.
 */
(function () {
  const TAB_ORDER = ["gate", "journey", "practice", "ref", "engage", "prove"];
  const TAB_ORDER_CLASSIC = ["gate", "journey", "ref", "engage", "prove"];

  function $(s, r) {
    return (r || document).querySelector(s);
  }
  function $$(s, r) {
    return [...(r || document).querySelectorAll(s)];
  }

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 48);
  }

  function renderReferencePanels(profile) {
    const mount = $("#refMount");
    if (!mount) return;
    const panels = profile.reference_panels || [];
    mount.innerHTML = panels
      .map((panel) => {
        if (panel.type === "cards") {
          return `<h3 style="font-size:.95rem;margin-top:16px">${panel.title}</h3>
            <div class="ref-grid">${(panel.items || [])
              .map(
                (item) => `<div class="ref-card${item.variant === "alt" ? " ref-card--alt" : ""}">
                  ${item.label ? `<small>${item.label}</small>` : ""}
                  <strong>${item.title || item.label || ""}</strong>
                  <div class="sub" style="font-size:12px;margin-top:6px">${item.body || ""}</div>
                </div>`
              )
              .join("")}</div>`;
        }
        if (panel.type === "steps") {
          return `<h3 style="font-size:.95rem;margin-top:16px">${panel.title}</h3>
            <ol class="steps">${(panel.items || []).map((s) => `<li>${s}</li>`).join("")}</ol>`;
        }
        return `<h3 style="font-size:.95rem;margin-top:16px">${panel.title}</h3>
          <ul class="sub">${(panel.items || []).map((s) => `<li>${s}</li>`).join("")}</ul>`;
      })
      .join("");
  }

  const DAY_LINKS = [
    { day: 1, href: "../the_first_door/index.html" },
    { day: 2, href: "../finding_source_of_truth/index.html" },
    { day: 3, href: "../from_signal_to_action/index.html" },
    { day: 4, href: "../the_handoff_is_the_work/index.html" },
    { day: 5, href: "../working_the_queue/index.html" },
    { day: 6, href: "../safe_access_boundaries/index.html" },
    { day: 7, href: "../builder_client_experience/index.html" },
    { day: 8, href: "../writing_like_aerovista/index.html" },
    { day: 9, href: "../from_draft_to_deliverable/index.html" },
    { day: 10, href: "../trusted_agent_capstone/index.html" }
  ];

  function renderDaySpine(currentDay) {
    const mount = $("#daySpine");
    if (!mount || !currentDay) return;
    mount.innerHTML = DAY_LINKS.map((d) => {
      const cls = d.day === currentDay ? "is-current" : "";
      return `<a class="${cls}" href="${d.href}" title="Agent Day ${d.day}">D${d.day}</a>`;
    }).join("");
  }

  function renderLawRow(law) {
    const mount = $("#lawRow");
    if (!mount || !law) return;
    mount.innerHTML = `<span>${law}</span>`;
  }

  function renderPrevNav(rt) {
    const nav = $("#prevDayNav");
    if (!nav || !rt?.prev_days?.length) return;
    const recent = rt.prev_days.slice(-3);
    nav.innerHTML = recent
      .map((d) => `<a class="btn" href="${d.href}">Day ${d.day}</a>`)
      .join("");
  }

  window.ByteCastAgentDayEpisode = {
    async init() {
      const Loop = window.ByteCastLoop;
      const body = document.body;
      const slug = body.dataset.bcSlug;
      let profile = null;
      let segmentState = {};
      let gateChecked = {};
      let nxPlayer = null;
      let listenApi = null;
      let stepperApi = null;
      let labsApi = null;
      let labsComplete = false;
      let voById = {};

      const res = await fetch("./bytecast_ep_profile.json", { cache: "no-store" });
      profile = await res.json();
      const rt = profile.episode_runtime || {};
      const wf = rt.workflow || {};
      const SEG_KEY = rt.storage?.segments || `bc.${slug}.segments.v1`;
      const GATE_KEY = rt.storage?.gate || `bc.${slug}.gate.v1`;
      const QUIZ_KEY = rt.storage?.quiz || `bc.${slug}.quiz.v1`;
      const PROVE_KEY = rt.storage?.prove || `bc.${slug}.prove.v1`;
      const STEP_KEY = rt.storage?.stepper || `bc.${slug}.stepper.v1`;
      const LABS_KEY = rt.storage?.labs || `bc.${slug}.labs.v1`;

      const useStepper =
        profile.interactives?.journey_mode === "stepper" && document.getElementById("journeyStepper");
      const useLabs = profile.interactives?.labs?.length && document.getElementById("practiceLabs");
      const tabOrder = useLabs ? TAB_ORDER : TAB_ORDER_CLASSIC;

      try {
        const vo = await fetch("assets/voiceover_sections.json", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : null
        );
        voById = Object.fromEntries((vo?.sections || []).map((s) => [s.id, s]));
      } catch {}

      function renderHero() {
        $("#heroKicker").textContent = profile.content?.hero_kicker || `Agent Day ${rt.day || ""}`;
        $("#heroTitle").textContent =
          profile.episode?.title?.replace(/\s*[—–-]\s*Agent Day.*$/i, "") || profile.episode?.title || "";
        $("#heroSub").textContent = profile.content?.summary_short || "";
        const spine = $("#spineChips");
        if (spine) spine.innerHTML = `<span>${profile.content?.key_line || ""}</span>`;
        renderDaySpine(rt.day);
        renderLawRow(rt.law || profile.content?.key_line);
        window.ByteCastAgentDayInteractive?.renderPocketLaw?.(
          document.getElementById("pocketLaw"),
          rt.day
        );
      }

      function renderGate() {
        const gate = profile.episode_gate || profile[`day${rt.day}_gate`];
        if (!gate) return;
        $("#gateIntro").textContent = gate.title;
        $("#gateItems").innerHTML = (gate.items || [])
          .map(
            (text, i) =>
              `<label class="check"><input type="checkbox" data-gate="${i}" /> <span>${text}</span></label>`
          )
          .join("");
        $$("#gateItems input").forEach((inp) => {
          inp.addEventListener("change", () => {
            gateChecked[inp.dataset.gate] = inp.checked;
            $("#btnGate").disabled = !(gate.items || []).every((_, i) => gateChecked[i]);
          });
        });
        try {
          if (localStorage.getItem(GATE_KEY) === "1" || Loop?.isStepDone?.(Loop.readWorkflowV2(), wf.gate)) {
            $("#gateStatus").textContent = `Day ${rt.day} gate already recorded.`;
            unlockFrom("journey");
          }
        } catch {}
      }

      $("#btnGate")?.addEventListener("click", () => {
        Loop?.markStepDone?.(wf.gate, {
          episodeSlug: slug,
          gateAcknowledged: true,
          acknowledgedAt: new Date().toISOString()
        });
        try {
          localStorage.setItem(GATE_KEY, "1");
        } catch {}
        $("#gateStatus").textContent = "Gate recorded. Continue to Journey.";
        unlockFrom("journey");
        selectTab("journey");
        refreshProgress();
      });

      function initInteractives() {
        const Interactive = window.ByteCastAgentDayInteractive;
        if (!Interactive) return;

        if (useStepper) {
          stepperApi = Interactive.mountJourneyStepper({
            profile,
            mount: $("#journeyStepper"),
            storageKey: STEP_KEY,
            listenApi,
            nxPlayer,
            onProgress(st) {
              if (st?.segments) {
                Object.assign(segmentState, st.segments);
                try {
                  localStorage.setItem(SEG_KEY, JSON.stringify(segmentState));
                } catch {}
              }
              checkJourneyComplete();
              refreshProgress();
            }
          });
        }

        if (useLabs) {
          labsApi = Interactive.mountPracticeLabs({
            profile,
            mount: $("#practiceLabs"),
            storageKey: LABS_KEY,
            onLabsComplete() {
              labsComplete = true;
              checkJourneyComplete();
              refreshProgress();
            }
          });
          labsComplete = labsApi?.allLabsDone?.() || false;
        }
      }

      function renderSegmentsClassic() {
        try {
          segmentState = JSON.parse(localStorage.getItem(SEG_KEY) || "{}");
        } catch {
          segmentState = {};
        }
        $("#segments").innerHTML = (profile.script?.sections || [])
          .map((seg, idx) => {
            const done = segmentState[seg.id];
            const vo = voById[seg.id];
            const bodyHtml = (seg.paragraphs || [])
              .map((p) => `<p>${p}</p>`)
              .join("");
            return `<article class="seg${done ? " is-done" : ""}" data-seg="${seg.id}">
          <h3>${idx + 1}. ${seg.title}</h3>
          <div class="time">${seg.time || ""}</div>
          ${bodyHtml}
          <div class="seg-actions">
            <button type="button" class="btn btn--ghost" data-listen="${seg.id}">Listen to section</button>
            <button type="button" class="btn" data-mark="${seg.id}">${done ? "✓ Read" : "Mark read"}</button>
          </div>
        </article>`;
          })
          .join("");
        $$("#segments [data-mark]").forEach((btn) => {
          btn.addEventListener("click", () => {
            segmentState[btn.dataset.mark] = true;
            try {
              localStorage.setItem(SEG_KEY, JSON.stringify(segmentState));
            } catch {}
            renderSegments();
            checkJourneyComplete();
            refreshProgress();
          });
        });
        $$("#segments [data-listen]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.listen;
            if (listenApi?.startSection) listenApi.startSection(id);
            else if (voById[id]?.speakText && window.speechSynthesis) {
              window.speechSynthesis.cancel();
              const u = new SpeechSynthesisUtterance(voById[id].speakText);
              window.speechSynthesis.speak(u);
            }
            segmentState[id] = true;
            try {
              localStorage.setItem(SEG_KEY, JSON.stringify(segmentState));
            } catch {}
            renderSegments();
            checkJourneyComplete();
            refreshProgress();
          });
        });
        checkJourneyComplete();
      }

      function renderSegments() {
        if (useStepper) return;
        renderSegmentsClassic();
      }

      function checkJourneyComplete() {
        const ids = (profile.script?.sections || []).map((s) => s.id);
        const segsDone =
          stepperApi?.allSegmentsDone?.() || (ids.length && ids.every((id) => segmentState[id]));
        const labsOk =
          !profile.interactives?.labs_required || labsComplete || labsApi?.allLabsDone?.();
        const all = segsDone && labsOk;
        if ($("#btnJourneyDone")) $("#btnJourneyDone").disabled = !all;
        if ($("#journeyStatus")) {
          if (segsDone && !labsOk) {
            $("#journeyStatus").textContent = "Segments done — complete Practice labs to continue.";
          } else if (all) {
            $("#journeyStatus").textContent = "Journey + practice complete. Mark journey complete to continue.";
          }
        }
      }

      $("#btnJourneyDone")?.addEventListener("click", () => {
        Loop?.markStepDone?.(wf.segments, {
          episodeSlug: slug,
          segmentsComplete: true,
          segmentCount: (profile.script?.sections || []).length
        });
        $("#journeyStatus").textContent = "Journey complete.";
        unlockFrom("ref");
        selectTab("engage");
        refreshProgress();
      });

      function markAllSegmentsRead() {
        stepperApi?.markAllDone?.();
        (profile.script?.sections || []).forEach((s) => {
          segmentState[s.id] = true;
        });
        try {
          localStorage.setItem(SEG_KEY, JSON.stringify(segmentState));
        } catch {}
        renderSegments();
        checkJourneyComplete();
      }

      function initListen() {
        nxPlayer = window.NxcoreNarrationPlayer?.create?.();
        const forgeHint = `npm run forge:agent-day${rt.day}`;
        if (nxPlayer) {
          nxPlayer.onProgress((pct, label) => {
            $("#forgedStatus").textContent = `Playing: ${label} (${Math.round(pct)}%)`;
          });
          nxPlayer.onComplete(() => {
            $("#forgedStatus").textContent = "Forged journey complete.";
            markAllSegmentsRead();
          });
          nxPlayer.onError(() => {
            $("#forgedStatus").textContent = `No forged audio yet — use Listen below or run ${forgeHint}.`;
          });
          fetch("assets/narration.manifest.json", { cache: "no-store" })
            .then((r) => (r.ok ? r.json() : null))
            .then((m) => {
              if (m?.tracks?.length) {
                $("#forgedStatus").textContent = `NXCore audio ready (${m.tracks.length} segments).`;
              }
            })
            .catch(() => {});
        }

        $("#btnPlayForged")?.addEventListener("click", async () => {
          try {
            const m = await fetch("assets/narration.manifest.json", { cache: "no-store" }).then((r) => {
              if (!r.ok) throw new Error("no manifest");
              return r.json();
            });
            nxPlayer?.playTracks(m.tracks);
          } catch {
            $("#forgedStatus").textContent = `Manifest missing. Run: python scripts/agent_day_voiceover_build.py ${rt.day} && ${forgeHint}`;
          }
        });
        $("#btnStopForged")?.addEventListener("click", () => {
          nxPlayer?.stop?.();
          window.speechSynthesis?.cancel();
          $("#forgedStatus").textContent = "Stopped.";
        });

        if (window.ByteCastListenMode?.init) {
          window.ByteCastListenMode.init({
            mount: $("#listenModeMount"),
            jsonUrl: "assets/voiceover_sections.json",
            onListenGate: () => markAllSegmentsRead(),
            onReady(api) {
              listenApi = api;
              if (useStepper) initInteractives();
            }
          });
        }
      }

      function renderQuiz() {
        const quiz = profile.engagement?.quiz || {};
        if ($("#quizTitle")) $("#quizTitle").textContent = quiz.title || "Knowledge Check";
        const Q = quiz.questions || [];
        $("#quiz").innerHTML = Q.map(
          (q) => `<fieldset style="border:0;padding:0;margin:16px 0">
          <legend style="font-weight:600;margin-bottom:8px">${q.q}</legend>
          ${q.choices.map((c, i) => `<label class="choice"><input type="radio" name="${q.id}" value="${i}" /> ${c}</label>`).join("")}
        </fieldset>`
        ).join("");
        try {
          const saved = JSON.parse(localStorage.getItem(QUIZ_KEY) || "{}");
          if (saved.passed) $("#quizStatus").textContent = `Passed (${Math.round(saved.score * 100)}%).`;
        } catch {}
      }

      $("#btnGrade")?.addEventListener("click", () => {
        const Q = profile.engagement?.quiz?.questions || [];
        let correct = 0;
        Q.forEach((q) => {
          const picked = document.querySelector(`input[name="${q.id}"]:checked`);
          if (picked && Number(picked.value) === q.answer_index) correct++;
        });
        const score = Q.length ? correct / Q.length : 0;
        const pass = score >= (profile.engagement?.quiz?.pass_threshold || 0.8);
        try {
          localStorage.setItem(QUIZ_KEY, JSON.stringify({ score, passed: pass }));
        } catch {}
        $("#quizStatus").innerHTML = pass
          ? `<span class="status">Passed (${Math.round(score * 100)}%).</span>`
          : `<span class="warn">Score ${Math.round(score * 100)}% — review Reference and try again.</span>`;
        if (pass) {
          Loop?.markStepDone?.(wf.engage, {
            episodeSlug: slug,
            engageQuizPassed: true,
            engageQuizScore: score
          });
          unlockFrom("prove");
          refreshProgress();
        }
      });

      function renderProve() {
        const p = profile.prove;
        $("#proveTitle").textContent = p.title;
        $("#proveDesc").textContent = p.description;
        $("#proveForm").innerHTML = (p.fields || [])
          .map(
            (f) => `<div class="field">
          <label for="pf_${f.id}">${f.label}${f.required ? " *" : ""}</label>
          ${f.rows > 1
            ? `<textarea id="pf_${f.id}" name="${f.id}" ${f.required ? "required" : ""}></textarea>`
            : `<input id="pf_${f.id}" name="${f.id}" ${f.required ? "required" : ""} />`}
        </div>`
          )
          .join("");
        try {
          const saved = JSON.parse(localStorage.getItem(PROVE_KEY) || "{}");
          Object.entries(saved).forEach(([k, v]) => {
            const el = $(`#pf_${k}`);
            if (el) el.value = v;
          });
          if (saved.submitted) $("#proveStatus").textContent = rt.prove_saved_message || "Drill submitted.";
        } catch {}
        $("#proveForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const data = {};
          (p.fields || []).forEach((f) => {
            const el = $(`#pf_${f.id}`);
            if (el) data[f.id] = el.value.trim();
          });
          const missing = (p.fields || []).filter((f) => f.required && !data[f.id]);
          if (missing.length) {
            $("#proveStatus").innerHTML = `<span class="warn">Fill required fields: ${missing.map((m) => m.label.split(".")[0]).join(", ")}</span>`;
            return;
          }
          const bundle = { ...data, submitted: true, submittedAt: new Date().toISOString() };
          try {
            localStorage.setItem(PROVE_KEY, JSON.stringify(bundle));
          } catch {}
          Loop?.markStepDone?.(wf.prove, {
            episodeSlug: slug,
            drillSubmitted: true,
            drill: data,
            ...(rt.prove_meta || {})
          });
          if (wf.complete) {
            Loop?.markStepDone?.(wf.complete, {
              episodeSlug: slug,
              dayComplete: true,
              day: rt.day
            });
          }
          window.ByteCastAgentDayInteractive?.savePocketLaw?.({
            day: rt.day,
            law: profile.content?.key_line || rt.law || "",
            title: profile.episode?.title || `Day ${rt.day}`,
            savedAt: new Date().toISOString()
          });
          $("#proveStatus").textContent = rt.prove_complete_message || "Drill saved. Continue on the Golden Path.";
          refreshProgress();
          window.ByteCastHandoffFooter?.render?.({ profile, container: document.getElementById("bc-handoff-footer") });
        });
      }

      function unlockFrom(panelId) {
        const idx = tabOrder.indexOf(panelId);
        $$(".tab").forEach((tab) => {
          const pi = tabOrder.indexOf(tab.dataset.panel);
          if (pi <= idx + 1) tab.classList.remove("is-locked");
        });
      }

      function unlockTabs() {
        const workflow = Loop?.readWorkflowV2?.() || {};
        if (Loop?.isStepDone?.(workflow, wf.gate)) unlockFrom("journey");
        if (Loop?.isStepDone?.(workflow, wf.segments)) unlockFrom("ref");
        if (Loop?.isStepDone?.(workflow, wf.engage)) unlockFrom("prove");
      }

      function selectTab(id) {
        $$(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.panel === id ? "true" : "false"));
        $$(".panel").forEach((p) => p.classList.toggle("is-active", p.id === `panel-${id}`));
      }

      $$(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          if (tab.classList.contains("is-locked")) return;
          selectTab(tab.dataset.panel);
        });
      });

      function refreshProgress() {
        const workflow = Loop?.readWorkflowV2?.() || {};
        const chips = [
          ["Gate", Loop?.isStepDone?.(workflow, wf.gate)],
          ["Journey", Loop?.isStepDone?.(workflow, wf.segments)],
          ...(useLabs ? [["Practice", labsComplete || labsApi?.allLabsDone?.()]] : []),
          ["Check", Loop?.isStepDone?.(workflow, wf.engage)],
          ["Prove", Loop?.isStepDone?.(workflow, wf.prove)]
        ];
        $("#progressChips").innerHTML = chips
          .map(([l, d]) => `<span class="chip${d ? " done" : ""}">${l}${d ? " ✓" : ""}</span>`)
          .join("");
      }

      renderHero();
      renderPrevNav(rt);
      renderGate();
      if (useStepper || useLabs) initInteractives();
      renderSegments();
      renderReferencePanels(profile);
      renderQuiz();
      renderProve();
      initListen();
      refreshProgress();
      unlockTabs();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.bcAgentDayShell === "1") {
      window.ByteCastAgentDayEpisode.init().catch((err) => {
        const sub = document.getElementById("heroSub");
        if (sub) sub.textContent = "Unable to load profile: " + err.message;
      });
    }
  });
})();

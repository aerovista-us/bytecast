
(() => {
  const PROFILE_URL = "./bytecast_ep_profile.json";
  const Loop = window.ByteCastLoop || null;
  let CFG = { slug: "lumina_rev_101", code: "EP-LUM-101", journeyId: "lumina_revenue_v1", listenStep: "lum101_listen", slideStep: "lum101_slide", engageStep: "lum101_engage", storagePrefix: "lumina_rev_101" };
  const viewState = {
    activePanelId: "listen-panel",
    slideIndex: 0,
    slideTotal: 0,
    listenDone: false,
    slideDone: false,
    engageDone: false,
    visitedPanels: new Set(["listen-panel"])
  };
  const TAB_FLOW = [
    { id: "listen-panel", tab: "#tab-listen", jump: "#jumpListen", title: "Listen", step: "1" },
    { id: "lesson-slides", tab: "#tab-lesson-slides", jump: "#jumpSlides", title: "Slides", step: "2" },
    { id: "refstrip", tab: "#tab-refstrip", jump: "#jumpRef", title: "Reference", step: "3" },
    { id: "engage", tab: "#tab-engage", jump: "#jumpEngage", title: "Engage", step: "4" }
  ];
  const $ = (s, r = document) => r.querySelector(s);
  const escapeHtml = (v) => String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const pill = (label, value) => `<span class="pill"><span class="spark"></span><strong>${escapeHtml(label)}</strong> ${escapeHtml(value)}</span>`;
  const loadJson = async (url) => { const response = await fetch(url); if (!response.ok) throw new Error(`Fetch failed ${response.status}`); return response.json(); };
  const currentTab = () => TAB_FLOW.find((item) => item.id === viewState.activePanelId) || TAB_FLOW[0];

  function getGateState() {
    let listenDone = viewState.listenDone;
    let slideDone = viewState.slideDone;
    let engageDone = viewState.engageDone;
    if (Loop) {
      try {
        const wf2 = Loop.ensureWorkflowV2(CFG.journeyId || Loop.getActiveJourneyId?.() || "lumina_revenue_v1");
        listenDone = listenDone || Loop.isStepDone(wf2, CFG.listenStep);
        slideDone = slideDone || Loop.isStepDone(wf2, CFG.slideStep);
        engageDone = engageDone || Loop.isStepDone(wf2, CFG.engageStep);
      } catch (_) {}
    }
    return {
      listenDone,
      slideDone,
      engageDone,
      referenceDone: viewState.visitedPanels.has("refstrip"),
      ready: listenDone && slideDone && engageDone
    };
  }

  function isSectionDone(panelId, gates) {
    if (panelId === "listen-panel") return gates.listenDone;
    if (panelId === "lesson-slides") return gates.slideDone;
    if (panelId === "refstrip") return gates.referenceDone;
    if (panelId === "engage") return gates.engageDone;
    return false;
  }

  function getRecommendedAction(gates) {
    if (!gates.listenDone) return { panelId: "listen-panel", label: "1 Listen", action: "listen", status: "Start here" };
    if (!gates.slideDone) {
      if (viewState.activePanelId === "lesson-slides" && viewState.slideTotal > 0 && viewState.slideIndex < viewState.slideTotal - 1) {
        return { panelId: "lesson-slides", label: "Next Slide", action: "slide-next", status: `Slide ${viewState.slideIndex + 1} of ${viewState.slideTotal}` };
      }
      return { panelId: "lesson-slides", label: "2 Slides", action: "slides", status: "Next up" };
    }
    if (!gates.referenceDone) return { panelId: "refstrip", label: "3 Reference", action: "reference", status: "Quick scan" };
    if (!gates.engageDone) return { panelId: "engage", label: "4 Engage", action: "engage", status: "Final section" };
    return { panelId: "next", label: ($("#nextEp")?.textContent || "Continue").trim(), action: "continue", status: "Unlocked" };
  }

  function getGuideCopy(gates) {
    if (viewState.activePanelId === "listen-panel") {
      return gates.listenDone
        ? "Listen is complete. The next useful click is 2 Slides so the overview becomes concrete examples."
        : "Start here. One clean listen pass gives the overview and clears the first gate.";
    }
    if (viewState.activePanelId === "lesson-slides") {
      if (gates.slideDone) return "You reached the end of the deck. Use 3 Reference as the quick reinforcement pass before the quiz.";
      return `Work through the deck in order. When you reach the last slide, the next click becomes 3 Reference.`;
    }
    if (viewState.activePanelId === "refstrip") {
      return "Reference is the light reinforcement stop. Skim the governed links here, then move into 4 Engage.";
    }
    if (gates.engageDone) {
      return "The episode gates are clear. Continue is now the right next click.";
    }
    return "Use Quest to rehearse the behavior, then pass the quiz to clear the final gate.";
  }

  function renderHint(node, detail) {
    if (!node) return;
    node.classList.toggle("is-ready", Boolean(detail.ready));
    const button = detail.label
      ? `<button class="btn ${detail.primary ? "btn--primary" : ""}" type="button" data-guide-action="${escapeHtml(detail.action || "")}">${escapeHtml(detail.label)}</button>`
      : "";
    node.innerHTML = `<div class="sectionHint__copy"><strong>${escapeHtml(detail.title)}</strong><div class="muted">${escapeHtml(detail.copy)}</div></div>${button}`;
  }

  function renderSectionHints() {
    const gates = getGateState();
    renderHint($("#listenHint"), gates.listenDone
      ? { title: "Listen complete", copy: "This section is done. Next click: 2 Slides.", label: "2 Slides", action: "slides", ready: true, primary: true }
      : { title: "Start with the overview", copy: "Run one full listen pass here. When it finishes, move to 2 Slides.", label: "1 Listen", action: "listen", ready: viewState.activePanelId === "listen-panel", primary: viewState.activePanelId === "listen-panel" });
    const slideReady = gates.slideDone || (viewState.activePanelId === "lesson-slides" && viewState.slideTotal > 0 && viewState.slideIndex === viewState.slideTotal - 1);
    const slideCopy = !viewState.slideTotal
      ? "Slides are loading. Once the deck is ready, move through it in order."
      : slideReady
        ? "You are at the end of the slide deck. Next click: 3 Reference."
        : `You are on slide ${viewState.slideIndex + 1} of ${viewState.slideTotal}. Reach the last slide, then click 3 Reference.`;
    renderHint($("#slidesHint"), slideReady
      ? { title: "Slides complete", copy: slideCopy, label: "3 Reference", action: "reference", ready: true, primary: true }
      : { title: "Move through the deck", copy: slideCopy, label: viewState.slideTotal > 1 ? "Next Slide" : "2 Slides", action: viewState.slideTotal > 1 ? "slide-next" : "slides", ready: viewState.activePanelId === "lesson-slides", primary: viewState.activePanelId === "lesson-slides" });
    renderHint($("#refHint"), gates.referenceDone
      ? { title: "Reference checked", copy: "You have seen the supporting links. Next click: 4 Engage.", label: "4 Engage", action: "engage", ready: true, primary: true }
      : { title: "Use this as a fast reinforcement pass", copy: "This section explains where to look when you need the governed version later. After this, click 4 Engage.", label: "4 Engage", action: "engage", ready: viewState.activePanelId === "refstrip", primary: viewState.activePanelId === "refstrip" });
    renderHint($("#engageHint"), gates.engageDone
      ? { title: "Engage complete", copy: "The final gate is clear. Next click: Continue.", label: ($("#nextEp")?.textContent || "Continue").trim(), action: "continue", ready: true, primary: true }
      : { title: "Finish here", copy: "Pass the quiz to clear the final gate. Once it passes, Continue becomes the next click.", label: "Stay in Engage", action: "engage", ready: viewState.activePanelId === "engage", primary: viewState.activePanelId === "engage" });
  }

  function renderSectionGuide() {
    const gates = getGateState();
    const current = currentTab();
    const recommendation = getRecommendedAction(gates);
    $("#guideTitle").textContent = `${current.step}. ${current.title}`;
    $("#guideCopy").textContent = getGuideCopy(gates);
    $("#guideBtn").textContent = recommendation.label;
    $("#guideBtn").dataset.guideAction = recommendation.action;
    $("#guideStatus").textContent = `Next click: ${recommendation.label}`;
    $("#guideProgress").innerHTML = TAB_FLOW.map((item) => {
      const classes = ["sectionGuide__step"];
      if (item.id === viewState.activePanelId) classes.push("is-current");
      if (isSectionDone(item.id, gates)) classes.push("is-done");
      return `<span class="${classes.join(" ")}"><strong>${escapeHtml(item.step)}</strong> ${escapeHtml(item.title)}</span>`;
    }).join("");
    TAB_FLOW.forEach((item) => {
      const jump = $(item.jump);
      const stepEls = Array.from(document.querySelectorAll(".startCard__step"));
      const stepEl = stepEls[Number(item.step) - 1];
      if (jump) {
        const isRecommended = recommendation.panelId === item.id;
        jump.classList.toggle("btn--primary", isRecommended);
        jump.classList.toggle("btn--quiet", !isRecommended);
      }
      if (stepEl) {
        stepEl.classList.toggle("is-active", item.id === viewState.activePanelId);
        stepEl.classList.toggle("is-done", isSectionDone(item.id, gates));
      }
    });
  }

  function syncTopControls() {
    const onSlides = viewState.activePanelId === "lesson-slides";
    $("#btnPrev").hidden = !onSlides;
    $("#btnNext").hidden = !onSlides;
  }

  function showTab(panelId) {
    viewState.activePanelId = panelId;
    viewState.visitedPanels.add(panelId);
    TAB_FLOW.forEach(({ id, tab }) => {
      const panel = document.getElementById(id);
      const button = document.querySelector(tab);
      const on = id === panelId;
      button?.classList.toggle("is-active", on);
      button?.setAttribute("aria-selected", String(on));
      if (panel) on ? panel.removeAttribute("hidden") : panel.setAttribute("hidden", "");
    });
    syncTopControls();
    renderSectionGuide();
    renderSectionHints();
  }

  function scrollLesson() {
    $("#lessonTabs")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleGuideAction(action) {
    if (action === "listen") { showTab("listen-panel"); scrollLesson(); return; }
    if (action === "slides") { showTab("lesson-slides"); scrollLesson(); return; }
    if (action === "reference") { showTab("refstrip"); scrollLesson(); return; }
    if (action === "engage") { showTab("engage"); scrollLesson(); return; }
    if (action === "slide-next") {
      if (viewState.activePanelId !== "lesson-slides") { showTab("lesson-slides"); scrollLesson(); }
      $("#btnNext")?.click();
      return;
    }
    if (action === "slide-prev") {
      if (viewState.activePanelId !== "lesson-slides") { showTab("lesson-slides"); scrollLesson(); }
      $("#btnPrev")?.click();
      return;
    }
    if (action === "continue") {
      const nextEl = $("#nextEp");
      if (!nextEl) return;
      nextEl.click();
    }
  }

  function renderReferences(profile) {
    const ref = profile.references || {};
    const links = Array.isArray(ref.links) ? ref.links : [];
    $("#refBlurb").textContent = ref.blurb || $("#refBlurb").textContent;
    $("#refLinks").innerHTML = links.length
      ? links.map((item) => `<a class="btn${item.primary ? " btn--primary" : ""}" href="${escapeHtml(item.href || "#")}">${escapeHtml(item.label || item.href || "Reference")}</a>`).join("")
      : `<span class="muted">No references listed for this pack yet.</span>`;
  }

  function renderSlides(profile) {
    const slidesEl = $("#slides");
    const dotsEl = $("#dots");
    const slides = Array.isArray(profile.slides) ? profile.slides : [];
    slidesEl.innerHTML = "";
    dotsEl.innerHTML = "";
    viewState.slideIndex = 0;
    viewState.slideTotal = slides.length;
    if (!slides.length) {
      slidesEl.innerHTML = `<div class="slide is-active"><div class="card"><h4>No slides</h4><p class="muted">This pack is missing slide data.</p></div></div>`;
      renderSectionGuide();
      renderSectionHints();
      return;
    }
    slides.forEach((slide, index) => {
      const node = document.createElement("article");
      const bullets = Array.isArray(slide.bullets) ? slide.bullets : [];
      const takeaway = slide.takeaway || bullets[0] || slide.goal || "";
      node.className = "slide" + (index === 0 ? " is-active" : "");
      node.dataset.title = slide.title || `Slide ${index + 1}`;
      node.dataset.slideId = slide.id || `s${index + 1}`;
      node.innerHTML = `<div class="slideGrid"><div class="card"><div class="slideId">${escapeHtml(CFG.code)} | ${escapeHtml(node.dataset.slideId)}</div><h4>${escapeHtml(slide.title || `Slide ${index + 1}`)}</h4><p class="muted" style="margin:8px 0 0;"><span style="font-family:var(--mono);">Goal:</span> ${escapeHtml(slide.goal || "Review the commercial judgment here.")}</p><ul>${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul></div><div class="callout"><div class="k">Takeaway</div><p style="margin:10px 0 0;line-height:1.6;"><strong>${escapeHtml(takeaway)}</strong></p></div></div>`;
      slidesEl.appendChild(node);
      const dot = document.createElement("button");
      dot.className = "dotBtn";
      dot.type = "button";
      dot.title = node.dataset.title;
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => goTo(index));
      dotsEl.appendChild(dot);
    });
    const slideEls = Array.from(document.querySelectorAll("#slides .slide"));
    let idx = 0;
    function syncDots() {
      viewState.slideIndex = idx;
      viewState.slideTotal = slideEls.length;
      Array.from(document.querySelectorAll("#dots .dotBtn")).forEach((button, buttonIndex) => button.setAttribute("aria-current", String(buttonIndex === idx)));
      $("#deckTitle").textContent = slideEls[idx]?.dataset?.title || "Slides";
      $("#slideProg").textContent = `${idx + 1} / ${slideEls.length}`;
      renderSectionGuide();
      renderSectionHints();
    }
    function goTo(nextIndex) {
      idx = (nextIndex + slideEls.length) % slideEls.length;
      slideEls.forEach((slideEl, slideIndex) => slideEl.classList.toggle("is-active", slideIndex === idx));
      syncDots();
      if (idx === slideEls.length - 1) {
        viewState.slideDone = true;
        try { Loop?.markStepDone?.(CFG.slideStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, gate: "slide" }); } catch (_) {}
        renderGates();
      }
    }
    $("#btnPrev").onclick = () => goTo(idx - 1);
    $("#btnNext").onclick = () => goTo(idx + 1);
    window.addEventListener("keydown", (event) => {
      const tag = event.target?.tagName?.toLowerCase?.();
      if (tag === "input" || tag === "textarea" || event.target?.isContentEditable) return;
      if (viewState.activePanelId !== "lesson-slides") return;
      if (event.key === "ArrowLeft") goTo(idx - 1);
      if (event.key === "ArrowRight") goTo(idx + 1);
    });
    syncDots();
  }

  function renderQuest(profile) {
    const quest = profile?.engagement?.quest;
    const questList = $("#questList");
    const key = `${CFG.storagePrefix}_quest`;
    if (!quest || !Array.isArray(quest.items)) { questList.innerHTML = `<p class="muted">No quest in profile.</p>`; return; }
    $("#questTitle").textContent = quest.title || "Quest";
    $("#questBlurb").textContent = quest.prompt || $("#questBlurb").textContent;
    const saved = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
    questList.innerHTML = quest.items.map((item) => {
      const checked = saved.has(item.id) ? "checked" : "";
      return `<label style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><input type="checkbox" data-qid="${escapeHtml(item.id)}" ${checked} style="accent-color:var(--neon);" /> <span>${escapeHtml(item.text || "")}</span></label>`;
    }).join("");
    questList.onchange = (event) => {
      const box = event.target;
      if (!box.matches("[data-qid]")) return;
      const id = box.getAttribute("data-qid");
      if (box.checked) saved.add(id); else saved.delete(id);
      localStorage.setItem(key, JSON.stringify([...saved]));
    };
  }

  function renderQuiz(profile) {
    const quiz = profile?.engagement?.quiz;
    const quizEl = $("#quiz");
    const key = `${CFG.storagePrefix}_quiz`;
    if (!quiz || !quiz.enabled || !Array.isArray(quiz.questions)) { quizEl.innerHTML = `<p class="muted">No quiz enabled.</p>`; return; }
    $("#quizBlurb").textContent = quiz.prompt || $("#quizBlurb").textContent;
    const questions = quiz.questions;
    const passThreshold = Number(quiz.pass_threshold || 0.8);
    let state = JSON.parse(localStorage.getItem(key) || "{}");
    function render() {
      const answers = state.answers || {};
      const score = typeof state.score === "number" ? state.score : null;
      const passed = Boolean(state.passed);
      const graded = Boolean(state.graded);
      quizEl.innerHTML = `<div style="display:grid;gap:12px;">${questions.map((question) => { const selected = answers[question.id]; const wrong = graded && selected !== undefined && selected !== question.answer_index; return `<div class="card"><b>${escapeHtml(question.q || "")}</b><div style="margin-top:8px;display:grid;gap:6px;">${(question.choices || []).map((choice, index) => `<div class="quizChoice ${graded && index === question.answer_index ? "quizChoice--correct" : ""} ${wrong && index === selected ? "quizChoice--wrong" : ""}"><label><input type="radio" name="${escapeHtml(question.id)}" value="${index}" ${selected === index ? "checked" : ""} style="accent-color:var(--neon);" /> ${escapeHtml(choice)}</label></div>`).join("")}</div>${graded ? `<div class="quizExplain">${escapeHtml(question.explain || "")}</div>` : ""}</div>`; }).join("")}<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;"><button class="btn btn--primary" type="button" id="gradeQuiz">Grade</button><button class="btn" type="button" id="resetQuiz">Reset</button><span class="chip">Score: ${score === null ? "-" : Math.round(score * 100) + "%"}</span><span class="chip">${passed ? "PASS" : "-"}</span></div></div>`;
      quizEl.querySelectorAll('input[type="radio"]').forEach((input) => input.addEventListener("change", () => { state.answers = state.answers || {}; state.answers[input.name] = Number(input.value); localStorage.setItem(key, JSON.stringify(state)); }));
      $("#gradeQuiz").onclick = () => {
        let correct = 0;
        questions.forEach((question) => { if (state.answers?.[question.id] === question.answer_index) correct += 1; });
        state.score = correct / questions.length;
        state.passed = state.score >= passThreshold;
        state.graded = true;
        localStorage.setItem(key, JSON.stringify(state));
        if (state.passed) viewState.engageDone = true;
        if (state.passed && Loop) { try { Loop.markStepDone(CFG.engageStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, engageQuizPassed: true, engageQuizScore: state.score }); } catch (_) {} }
        render(); renderGates();
      };
      $("#resetQuiz").onclick = () => { state = {}; viewState.engageDone = false; localStorage.removeItem(key); render(); renderGates(); };
    }
    render();
  }

  function renderGates() {
    const gates = getGateState();
    const note = $("#gateNote");
    $("#gateRow").innerHTML = [
      `<span class="gatePill ${gates.listenDone ? "gatePill--on" : "gatePill--off"}">Listen</span>`,
      `<span class="gatePill ${gates.slideDone ? "gatePill--on" : "gatePill--off"}">Slides</span>`,
      `<span class="gatePill ${gates.engageDone ? "gatePill--on" : "gatePill--off"}">Engage</span>`
    ].join("");
    note.textContent = gates.ready
      ? `${CFG.code} gates complete. Next step is unlocked.`
      : `Next focus: ${getRecommendedAction(gates).label}${Loop ? "" : " | Open from Playlist to save gate progress."}`;
    $("#nextEp").classList.toggle("btn--primary", gates.ready);
    renderSectionGuide();
    renderSectionHints();
  }

  async function main() {
    let profile;
    try { profile = await loadJson(PROFILE_URL); } catch (error) { console.error(error); $("#heroSub").textContent = "Could not load bytecast_ep_profile.json. Use a local web server."; return; }
    const episode = profile.episode || {};
    const routing = profile.routing || {};
    CFG = { ...CFG, slug: routing.slug || CFG.slug, code: episode.code || CFG.code, journeyId: routing.journey_id || CFG.journeyId, listenStep: routing.listen_step || CFG.listenStep, slideStep: routing.slide_step || CFG.slideStep, engageStep: routing.engage_step || CFG.engageStep, storagePrefix: routing.storage_prefix || CFG.storagePrefix };
    try { Loop?.setActiveJourneyId?.(CFG.journeyId); } catch (_) {}
    document.title = `ByteCast ${CFG.code} | ${episode.title || "Lumina Revenue Lane"}`;
    $("#topEp").textContent = `ByteCast | ${CFG.code}`; $("#topTitle").textContent = episode.title || ""; $("#heroTitle").textContent = CFG.code; $("#heroSub").textContent = episode.title || "";
    $("#heroNote").textContent = profile.content?.summary_short || ""; $("#startCopy").textContent = profile.content?.start_here || $("#startCopy").textContent; $("#heroKicker").textContent = profile.content?.hero_kicker || "Lumina Revenue Lane"; $("#keyLine").textContent = profile.content?.key_line || profile.content?.summary_short || $("#keyLine").textContent;
    $("#heroNextTag").textContent = profile.advance?.tag || "THEN"; $("#heroNextLabel").textContent = profile.advance?.label || "Keep going"; $("#listenGateLabel").textContent = CFG.listenStep; $("#nextDesc").textContent = profile.advance?.description || $("#nextDesc").textContent; $("#footerLeft").textContent = `${CFG.code} | ${episode.title || "Lumina Revenue Lane"}`;
    const tags = Array.isArray(profile.content?.tags) ? profile.content.tags : []; const runtime = Number(episode.runtime_target_minutes);
    $("#metaPills").innerHTML = [pill(CFG.code, episode.type || "episode"), episode.date ? pill("date", episode.date) : "", Number.isFinite(runtime) && runtime > 0 ? pill("target", `~${runtime} min`) : "", tags.length ? pill("tags", tags.slice(0, 4).join(" | ")) : ""].filter(Boolean).join("");
    if (profile.navigation?.previous_href) { const prevBtn = $("#prevEpisodeBtn"); prevBtn.href = profile.navigation.previous_href; prevBtn.textContent = profile.navigation.previous_label || "Previous"; prevBtn.hidden = false; }
    if (profile.advance?.href) $("#nextEp").href = profile.advance.href; $("#nextEp").textContent = profile.advance?.cta || profile.advance?.label || "Continue";
    renderReferences(profile); renderSlides(profile); renderQuest(profile); renderQuiz(profile);
    const audioEl = $("#audio"); const files = Array.isArray(profile.media?.audio_files) ? profile.media.audio_files : []; audioEl.replaceChildren();
    files.forEach((file) => { if (!file?.path) return; const source = document.createElement("source"); source.src = file.path; source.type = "audio/mpeg"; audioEl.appendChild(source); });
    if (files.length) { audioEl.load(); $("#audioLine").textContent = files[0].label || $("#audioLine").textContent; } else { $("#audioLine").textContent = "Read episode overview uses browser TTS. No packaged MP3 is bundled yet."; }
    try { localStorage.setItem("bytecast.last_episode.href.v1", `episodes/${CFG.slug}/index.html`); localStorage.setItem("bytecast.last_episode.time.v1", String(Date.now())); } catch (_) {}
    TAB_FLOW.forEach(({ id, tab }) => document.querySelector(tab)?.addEventListener("click", () => showTab(id)));
    $("#jumpListen").onclick = () => { showTab("listen-panel"); scrollLesson(); };
    $("#jumpSlides").onclick = () => { showTab("lesson-slides"); scrollLesson(); };
    $("#jumpRef").onclick = () => { showTab("refstrip"); scrollLesson(); };
    $("#jumpEngage").onclick = () => { showTab("engage"); scrollLesson(); };
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-guide-action]");
      if (!trigger) return;
      handleGuideAction(trigger.dataset.guideAction || "");
    });
    const markListenGate = () => {
      viewState.listenDone = true;
      try { Loop?.markStepDone?.(CFG.listenStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, gate: "listen" }); } catch (_) {}
      renderGates();
    };
    const Listen = window.ByteCastListenMode;
    if (Listen && $("#listenModeMount")) {
      Listen.init({ mount: $("#listenModeMount"), jsonUrl: "assets/voiceover_sections.json", onListenGate: markListenGate, hiddenAudio: files.length ? audioEl : null, audioListenSeconds: 25, showListenTab: () => { showTab("listen-panel"); scrollLesson(); }, onReady(api, data) { const heroAttach = $("#heroListenAttach"); if (heroAttach && data.heroSectionId) Listen.attachSectionButton(heroAttach, api, data.heroSectionId); const slideMap = data.slideSectionMap || {}; Array.from(document.querySelectorAll("#slides .slide")).forEach((slide) => { const sectionId = slideMap[slide.dataset.slideId]; const card = slide.querySelector(".slideGrid .card"); if (sectionId && card) Listen.attachSectionButton(card, api, sectionId); }); } });
    }
    try {
      const quizState = JSON.parse(localStorage.getItem(`${CFG.storagePrefix}_quiz`) || "{}");
      if (quizState.passed) viewState.engageDone = true;
      if (quizState.passed && Loop) Loop.markStepDone(CFG.engageStep, { journeyId: CFG.journeyId, episodeSlug: CFG.slug, episodeCode: CFG.code, engageQuizPassed: true, engageQuizScore: quizState.score });
    } catch (_) {}
    showTab("listen-panel");
    renderGates();
  }
  main();
})();

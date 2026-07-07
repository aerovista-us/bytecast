(() => {
  const PROFILE_URL = "./bytecast_ep_profile.json";
  const VOICEOVER_URL = "./assets/voiceover_sections.json";
  const STORAGE_NS = "bytecast.infographic.v1";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const synth = window.speechSynthesis || null;
  const SpeechCtor = window.SpeechSynthesisUtterance || null;

  const state = {
    profile: null,
    voiceover: null,
    activePanelId: "listen-panel",
    activeHotspotId: "",
    currentSectionId: "",
    visitedHotspots: new Set(),
    completedSections: new Set(),
    listenDone: false,
    exploreDone: false,
    engageDone: false,
    quizState: {},
    zoom: 1,
    speaking: false,
    utteranceQueue: [],
  };

  function basename(path) {
    const value = String(path || "");
    const parts = value.split(/[\\/]/).filter(Boolean);
    return parts[parts.length - 1] || value;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function slugKey(suffix) {
    const slug = state.profile?.routing?.storage_prefix || state.profile?.routing?.slug || state.profile?.episode?.code || "infographic";
    return `${STORAGE_NS}.${slug}.${suffix}`;
  }

  function persistState() {
    try {
      localStorage.setItem(slugKey("visited"), JSON.stringify([...state.visitedHotspots]));
      localStorage.setItem(slugKey("sections"), JSON.stringify([...state.completedSections]));
      localStorage.setItem(slugKey("listenDone"), state.listenDone ? "1" : "0");
      localStorage.setItem(slugKey("exploreDone"), state.exploreDone ? "1" : "0");
      localStorage.setItem(slugKey("engageDone"), state.engageDone ? "1" : "0");
      localStorage.setItem(slugKey("quiz"), JSON.stringify(state.quizState || {}));
      localStorage.setItem("bytecast.last_episode.href.v1", `episodes/${state.profile.routing.slug}/index.html`);
      localStorage.setItem("bytecast.last_episode.time.v1", String(Date.now()));
    } catch {
      // ignore
    }
  }

  function loadPersistedState() {
    try {
      state.visitedHotspots = new Set(JSON.parse(localStorage.getItem(slugKey("visited")) || "[]"));
      state.completedSections = new Set(JSON.parse(localStorage.getItem(slugKey("sections")) || "[]"));
      state.listenDone = localStorage.getItem(slugKey("listenDone")) === "1";
      state.exploreDone = localStorage.getItem(slugKey("exploreDone")) === "1";
      state.engageDone = localStorage.getItem(slugKey("engageDone")) === "1";
      state.quizState = JSON.parse(localStorage.getItem(slugKey("quiz")) || "{}");
    } catch {
      // ignore
    }
  }

  async function loadJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Fetch failed ${response.status} for ${url}`);
    return response.json();
  }

  function findHotspot(id) {
    return (state.profile?.infographic?.hotspots || []).find((hotspot) => hotspot.id === id) || null;
  }

  function markHotspotVisited(id) {
    if (!id) return;
    state.visitedHotspots.add(id);
    const total = state.profile?.infographic?.hotspots?.length || 0;
    state.exploreDone = total > 0 && state.visitedHotspots.size >= total;
    persistState();
  }

  function focusHotspot(id, options = {}) {
    const hotspot = findHotspot(id);
    if (!hotspot) return;
    state.activeHotspotId = hotspot.id;
    if (!options.skipVisit) {
      markHotspotVisited(hotspot.id);
    }
    renderHotspotList();
    renderHotspotDetail();
    updateStageOverlay();
    if (!options.skipScroll) {
      scrollStageToHotspot(hotspot);
    }
    renderProgress();
    renderAfterPanel();
  }

  function showPanel(panelId) {
    state.activePanelId = panelId;
    const defs = [
      ["listen-panel", "#tab-listen"],
      ["explore-panel", "#tab-explore"],
      ["reference-panel", "#tab-reference"],
      ["engage-panel", "#tab-engage"],
    ];
    defs.forEach(([id, tabSelector]) => {
      const panel = document.getElementById(id);
      const tab = $(tabSelector);
      const active = id === panelId;
      if (panel) {
        if (active) panel.removeAttribute("hidden");
        else panel.setAttribute("hidden", "");
      }
      if (tab) {
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", String(active));
      }
    });
  }

  function chooseVoice() {
    if (!synth?.getVoices) return null;
    const voices = synth.getVoices();
    const rank = (voice) => {
      const hay = `${voice.name || ""} ${voice.lang || ""}`;
      let score = 0;
      if (/en-US/i.test(voice.lang || "")) score += 50;
      else if (/^en/i.test(voice.lang || "")) score += 25;
      if (/natural|neural|online/i.test(hay)) score += 35;
      if (/microsoft|google|apple/i.test(hay)) score += 15;
      if (/aria|ava|jenny|guy|davis|mark|samantha|daniel/i.test(hay)) score += 8;
      if (voice.default) score += 4;
      return score;
    };
    return voices.slice().sort((left, right) => rank(right) - rank(left))[0] || null;
  }

  function supportsSpeech() {
    return Boolean(synth && SpeechCtor);
  }

  function stopSpeech() {
    if (synth?.speaking || synth?.paused) synth.cancel();
    state.speaking = false;
    state.utteranceQueue = [];
    const status = $("#listenStatus");
    if (status) status.textContent = "Voiceover stopped.";
  }

  function speakSection(section, { markComplete = true, focus = true } = {}) {
    if (!section || !supportsSpeech()) {
      const status = $("#listenStatus");
      if (status) status.textContent = "Browser voiceover is unavailable here. Use the guide cards and mark Listen complete when finished.";
      return;
    }
    stopSpeech();
    const voice = chooseVoice();
    const utterance = new SpeechCtor(section.speakText || section.displayText || "");
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "en-US";
    } else {
      utterance.lang = "en-US";
    }
    utterance.rate = 0.98;
    utterance.pitch = 0.95;
    utterance.onstart = () => {
      state.speaking = true;
      state.currentSectionId = section.id;
      if (focus && section.hotspotId) {
        focusHotspot(section.hotspotId);
      }
      renderVoiceoverCards();
      const status = $("#listenStatus");
      if (status) status.textContent = `Playing section: ${section.title}`;
    };
    utterance.onend = () => {
      state.speaking = false;
      if (markComplete) {
        state.completedSections.add(section.id);
        if (section.hotspotId) markHotspotVisited(section.hotspotId);
      }
      persistState();
      renderVoiceoverCards();
      renderProgress();
      const status = $("#listenStatus");
      if (status) status.textContent = `${section.title} complete.`;
    };
    utterance.onerror = () => {
      state.speaking = false;
      const status = $("#listenStatus");
      if (status) status.textContent = "Browser voiceover failed. You can still use the script cards and mark Listen complete.";
    };
    synth.speak(utterance);
  }

  function speakAll() {
    if (!supportsSpeech()) {
      const status = $("#listenStatus");
      if (status) status.textContent = "This browser does not expose speech synthesis. Use the guide cards and mark Listen complete.";
      return;
    }
    const sections = state.voiceover?.sections || [];
    if (!sections.length) return;
    stopSpeech();
    const voice = chooseVoice();
    state.speaking = true;
    state.utteranceQueue = sections.slice();

    const playNext = () => {
      const next = state.utteranceQueue.shift();
      if (!next) {
        state.speaking = false;
        state.listenDone = true;
        persistState();
        renderVoiceoverCards();
        renderProgress();
        renderAfterPanel();
        const status = $("#listenStatus");
        if (status) status.textContent = "Guided voiceover complete. Listen gate cleared.";
        return;
      }
      state.currentSectionId = next.id;
      if (next.hotspotId) {
        focusHotspot(next.hotspotId);
      }
      renderVoiceoverCards();
      const utterance = new SpeechCtor(next.speakText || next.displayText || "");
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-US";
      } else {
        utterance.lang = "en-US";
      }
      utterance.rate = 0.97;
      utterance.pitch = 0.95;
      utterance.onend = () => {
        state.completedSections.add(next.id);
        if (next.hotspotId) markHotspotVisited(next.hotspotId);
        persistState();
        playNext();
      };
      utterance.onerror = () => {
        state.speaking = false;
        const status = $("#listenStatus");
        if (status) status.textContent = "Voiceover stopped early. You can resume by playing a section card or marking Listen complete.";
      };
      synth.speak(utterance);
    };

    const status = $("#listenStatus");
    if (status) status.textContent = "Playing guided voiceover across the map.";
    playNext();
  }

  function renderHero() {
    const profile = state.profile;
    document.title = `ByteCast | ${profile.episode.code} | ${profile.episode.title}`;
    $("#heroEyebrow").textContent = `${profile.episode.code} • ${profile.content.hero_kicker}`;
    $("#heroTitle").textContent = profile.episode.title;
    $("#heroLead").textContent = profile.content.summary_long;
    $("#heroKeyLine").textContent = profile.content.key_line;
    $("#startCopy").textContent = profile.content.start_here;
    $("#heroPills").innerHTML = [
      `<span class="ig-chip"><strong>mode</strong> infographic training pilot</span>`,
      `<span class="ig-chip"><strong>source</strong> AV_AppEchosystemMap.png</span>`,
      `<span class="ig-chip"><strong>flow</strong> Listen • Explore • Reference • Engage</span>`,
      ...((profile.content.tags || []).slice(0, 4).map((tag) => `<span class="ig-chip">${escapeHtml(tag)}</span>`))
    ].join("");
    $("#jumpExplore").addEventListener("click", () => {
      showPanel("explore-panel");
      $("#explore-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    $("#jumpListen").addEventListener("click", () => {
      showPanel("listen-panel");
      $("#listen-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function renderVoiceoverCards() {
    const host = $("#voiceoverCards");
    if (!host) return;
    host.innerHTML = (state.voiceover?.sections || []).map((section) => {
      const isCurrent = section.id === state.currentSectionId && state.speaking;
      const isComplete = state.completedSections.has(section.id);
      return `
        <article class="ig-card ig-voice-card${isCurrent ? " is-current" : ""}${isComplete ? " is-complete" : ""}">
          <div class="ig-voice-card__meta">
            <span class="ig-k">${escapeHtml(section.title)}</span>
            <span class="ig-score">${isComplete ? "covered" : "pending"}</span>
          </div>
          <p>${escapeHtml(section.displayText)}</p>
          <div class="ig-row">
            <button type="button" class="ig-btn ig-btn--quiet" data-speak-section="${escapeHtml(section.id)}">Play section</button>
            ${section.hotspotId ? `<button type="button" class="ig-btn ig-btn--quiet" data-focus-hotspot="${escapeHtml(section.hotspotId)}">Focus hotspot</button>` : ""}
          </div>
        </article>`;
    }).join("");
  }

  function renderExploreShell() {
    const info = state.profile.infographic;
    const host = $("#stageMount");
    if (!host) return;
    const imageHref = escapeHtml(info.image);
    host.innerHTML = `
      <div class="ig-stage-shell" id="igStageShell">
        <div class="ig-stage-inner" id="igStageInner">
          <svg class="ig-stage-svg" id="igStageSvg" viewBox="0 0 ${info.width} ${info.height}" aria-label="${escapeHtml(info.alt)}">
            <image class="ig-stage-image" href="${imageHref}" x="0" y="0" width="${info.width}" height="${info.height}" preserveAspectRatio="xMidYMid meet"></image>
            <g id="stageHitLayer">
              ${(info.hotspots || []).map((hotspot, index) => `
                <g class="ig-stage-hit" data-stage-hotspot="${escapeHtml(hotspot.id)}" data-hotspot-id="${escapeHtml(hotspot.id)}" aria-label="${escapeHtml(hotspot.nav_label || hotspot.title)}">
                  <rect
                    class="ig-stage-hit__rect"
                    x="${hotspot.shape.x}"
                    y="${hotspot.shape.y}"
                    width="${hotspot.shape.width}"
                    height="${hotspot.shape.height}"
                    rx="${hotspot.shape.rx || 18}"
                    ry="${hotspot.shape.ry || 18}"
                  ></rect>
                  <circle class="ig-stage-hit__dot" cx="${hotspot.anchor.x}" cy="${hotspot.anchor.y}" r="13"></circle>
                  <text class="ig-stage-hit__num" x="${hotspot.anchor.x}" y="${hotspot.anchor.y + 5}" text-anchor="middle">${index + 1}</text>
                </g>`).join("")}
            </g>
            <g id="visitedLayer"></g>
            <rect class="ig-dim" id="dimTop" x="0" y="0" width="${info.width}" height="0"></rect>
            <rect class="ig-dim" id="dimLeft" x="0" y="0" width="0" height="${info.height}"></rect>
            <rect class="ig-dim" id="dimRight" x="${info.width}" y="0" width="0" height="${info.height}"></rect>
            <rect class="ig-dim" id="dimBottom" x="0" y="${info.height}" width="${info.width}" height="0"></rect>
            <rect class="ig-active-hotspot" id="activeRect" x="0" y="0" width="0" height="0" rx="18" ry="18"></rect>
            <g id="hotspotLabel" class="ig-hotspot-label">
              <line id="hotspotLabelLine" class="ig-hotspot-line" x1="0" y1="0" x2="0" y2="0"></line>
              <rect id="hotspotLabelRect" x="0" y="0" width="0" height="0" rx="14" ry="14"></rect>
              <text id="hotspotLabelText" x="0" y="0"></text>
            </g>
          </svg>
        </div>
      </div>`;
  }

  function syncStageHitState() {
    $$("[data-stage-hotspot]").forEach((element) => {
      const id = element.getAttribute("data-stage-hotspot");
      element.classList.toggle("is-active", id === state.activeHotspotId);
      element.classList.toggle("is-done", state.visitedHotspots.has(id));
    });
  }

  function scrollStageToHotspot(hotspot) {
    const shell = $("#igStageShell");
    if (!shell || !hotspot?.shape) return;
    const centerX = (hotspot.shape.x + hotspot.shape.width / 2) * state.zoom;
    const centerY = (hotspot.shape.y + hotspot.shape.height / 2) * state.zoom;
    const left = Math.max(0, centerX - shell.clientWidth / 2);
    const top = Math.max(0, centerY - shell.clientHeight / 2);
    shell.scrollTo({ left, top, behavior: "smooth" });
  }

  function updateStageOverlay() {
    const hotspot = findHotspot(state.activeHotspotId);
    if (!hotspot) return;
    const shape = hotspot.shape;
    const x = shape.x;
    const y = shape.y;
    const width = shape.width;
    const height = shape.height;
    const stageWidth = state.profile.infographic.width;
    const stageHeight = state.profile.infographic.height;
    const pad = 18;
    $("#dimTop").setAttribute("height", Math.max(0, y - pad));
    $("#dimLeft").setAttribute("y", Math.max(0, y - pad));
    $("#dimLeft").setAttribute("width", Math.max(0, x - pad));
    $("#dimLeft").setAttribute("height", Math.min(stageHeight, height + pad * 2));
    $("#dimRight").setAttribute("x", Math.min(stageWidth, x + width + pad));
    $("#dimRight").setAttribute("y", Math.max(0, y - pad));
    $("#dimRight").setAttribute("width", Math.max(0, stageWidth - (x + width + pad)));
    $("#dimRight").setAttribute("height", Math.min(stageHeight, height + pad * 2));
    $("#dimBottom").setAttribute("y", Math.min(stageHeight, y + height + pad));
    $("#dimBottom").setAttribute("height", Math.max(0, stageHeight - (y + height + pad)));

    const activeRect = $("#activeRect");
    activeRect.setAttribute("x", x);
    activeRect.setAttribute("y", y);
    activeRect.setAttribute("width", width);
    activeRect.setAttribute("height", height);
    activeRect.setAttribute("rx", shape.rx || 18);
    activeRect.setAttribute("ry", shape.ry || 18);

    const visitedLayer = $("#visitedLayer");
    visitedLayer.innerHTML = [...state.visitedHotspots]
      .map((id) => findHotspot(id))
      .filter(Boolean)
      .map((visited) => {
        const s = visited.shape;
        return `<rect class="ig-visited" x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="${s.rx || 18}" ry="${s.ry || 18}"></rect>`;
      })
      .join("");
    syncStageHitState();

    const label = hotspot.nav_label || hotspot.title;
    const anchorX = hotspot.anchor.x;
    const anchorY = hotspot.anchor.y;
    const labelX = hotspot.anchor.label_x;
    const labelY = hotspot.anchor.label_y;
    const labelWidth = Math.max(150, label.length * 10 + 28);
    $("#hotspotLabelLine").setAttribute("x1", anchorX);
    $("#hotspotLabelLine").setAttribute("y1", anchorY);
    $("#hotspotLabelLine").setAttribute("x2", labelX);
    $("#hotspotLabelLine").setAttribute("y2", labelY + 16);
    $("#hotspotLabelRect").setAttribute("x", labelX);
    $("#hotspotLabelRect").setAttribute("y", labelY);
    $("#hotspotLabelRect").setAttribute("width", labelWidth);
    $("#hotspotLabelRect").setAttribute("height", 36);
    $("#hotspotLabelText").setAttribute("x", labelX + 14);
    $("#hotspotLabelText").setAttribute("y", labelY + 23);
    $("#hotspotLabelText").textContent = label;
  }

  function renderHotspotList() {
    const host = $("#hotspotList");
    if (!host) return;
    const hotspots = state.profile.infographic.hotspots || [];
    host.innerHTML = hotspots.map((hotspot, index) => {
      const isActive = hotspot.id === state.activeHotspotId;
      const isDone = state.visitedHotspots.has(hotspot.id);
      return `
        <button type="button" class="ig-btn ig-hotspot-btn${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}" data-hotspot-id="${escapeHtml(hotspot.id)}">
          <span>
            <strong>${index + 1}. ${escapeHtml(hotspot.nav_label || hotspot.title)}</strong><br />
            <span class="ig-hotspot-btn__meta">${escapeHtml(hotspot.subtitle)}</span>
          </span>
          <span class="ig-hotspot-btn__meta">${isDone ? "visited" : "new"}</span>
        </button>`;
    }).join("");
  }

  function renderHotspotDetail() {
    const hotspot = findHotspot(state.activeHotspotId);
    const host = $("#hotspotDetail");
    if (!host || !hotspot) return;
    host.innerHTML = `
      <article class="ig-detail">
        <span class="ig-detail__kicker">${escapeHtml(hotspot.kicker)}</span>
        <h3 style="margin-top:12px;">${escapeHtml(hotspot.title)}</h3>
        <p>${escapeHtml(hotspot.summary)}</p>
        <div class="ig-detail__insight">
          <div class="ig-k">What the training adds</div>
          <p style="margin-top:8px;">${escapeHtml(hotspot.insight)}</p>
        </div>
        <ul class="ig-bullet-list">${(hotspot.details || []).map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>
        <div class="ig-detail__coach">
          <div class="ig-k">Coach Note</div>
          <p style="margin-top:8px;">${escapeHtml(hotspot.coach)}</p>
        </div>
        <ul class="ig-warning-list">${(hotspot.pitfalls || []).map((pitfall) => `<li>${escapeHtml(pitfall)}</li>`).join("")}</ul>
      </article>`;
  }

  function renderReferencePanel() {
    const profile = state.profile;
    $("#referenceBlurb").textContent = profile.references.blurb;
    $("#referenceCards").innerHTML = (profile.references.cards || []).map((card) => `
      <article class="ig-reference-card">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.body)}</p>
      </article>`).join("");
    $("#referenceLinks").innerHTML = (profile.references.links || []).map((link) => `
      <a class="ig-btn${link.primary ? " ig-btn--primary" : ""}" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join("");
  }

  function renderQuest() {
    const quest = state.profile.engagement.quest;
    $("#questTitle").textContent = quest.title;
    $("#questPrompt").textContent = quest.prompt;
    const host = $("#questList");
    host.innerHTML = (quest.items || []).map((item) => `
      <label class="ig-chip" style="display:flex; width:100%; border-radius:16px; padding:12px 14px;">
        <input type="checkbox" data-quest-item="${escapeHtml(item.id)}" style="margin-right:10px; accent-color:#40b8ff;" />
        <span>${escapeHtml(item.text)}</span>
      </label>`).join("");
  }

  function renderQuiz() {
    const quiz = state.profile.engagement.quiz;
    const host = $("#quizMount");
    if (!quiz?.enabled) {
      host.innerHTML = `<p class="ig-muted">Quiz unavailable for this pilot.</p>`;
      return;
    }
    const answers = state.quizState.answers || {};
    const graded = Boolean(state.quizState.graded);
    const score = typeof state.quizState.score === "number" ? state.quizState.score : null;
    const passed = Boolean(state.quizState.passed);
    host.innerHTML = `
      <div class="ig-card-list" style="flex-direction:column;">
        ${(quiz.questions || []).map((question, index) => `
          <article class="ig-card ig-quiz-question">
            <h3>${index + 1}. ${escapeHtml(question.q)}</h3>
            ${(question.choices || []).map((choice, choiceIndex) => {
              const selected = answers[question.id] === choiceIndex;
              const correct = question.answer_index === choiceIndex;
              const classes = [
                "ig-quiz-choice",
                graded && correct ? "is-correct" : "",
                graded && selected && !correct ? "is-wrong" : "",
              ].filter(Boolean).join(" ");
              return `<label class="${classes}"><input type="radio" name="${escapeHtml(question.id)}" value="${choiceIndex}" ${selected ? "checked" : ""} /> ${escapeHtml(choice)}</label>`;
            }).join("")}
            ${graded ? `<p class="ig-muted"><strong>Why:</strong> ${escapeHtml(question.explain || "")}</p>` : ""}
          </article>`).join("")}
        <div class="ig-row">
          <button type="button" class="ig-btn ig-btn--primary" id="gradeQuiz">Grade quiz</button>
          <button type="button" class="ig-btn ig-btn--quiet" id="resetQuiz">Reset</button>
          <span class="ig-chip"><strong>score</strong> ${score === null ? "—" : `${Math.round(score * 100)}%`}</span>
          <span class="ig-chip"><strong>status</strong> ${passed ? "pass" : graded ? "try again" : "not graded"}</span>
        </div>
      </div>`;

    $$('input[type="radio"]', host).forEach((input) => {
      input.addEventListener("change", () => {
        state.quizState.answers = state.quizState.answers || {};
        state.quizState.answers[input.name] = Number(input.value);
        persistState();
      });
    });

    $("#gradeQuiz")?.addEventListener("click", () => {
      const total = quiz.questions.length || 1;
      let correct = 0;
      quiz.questions.forEach((question) => {
        if (state.quizState.answers?.[question.id] === question.answer_index) {
          correct += 1;
        }
      });
      state.quizState.score = correct / total;
      state.quizState.passed = state.quizState.score >= Number(quiz.pass_threshold || 0.8);
      state.quizState.graded = true;
      state.engageDone = state.quizState.passed;
      persistState();
      renderQuiz();
      renderProgress();
      renderAfterPanel();
    });

    $("#resetQuiz")?.addEventListener("click", () => {
      state.quizState = {};
      state.engageDone = false;
      persistState();
      renderQuiz();
      renderProgress();
      renderAfterPanel();
    });
  }

  function renderProgress() {
    const hotspots = state.profile.infographic.hotspots || [];
    const progress = [
      { label: "Listen", done: state.listenDone, active: state.activePanelId === "listen-panel" },
      { label: `Explore ${state.visitedHotspots.size}/${hotspots.length}`, done: state.exploreDone, active: state.activePanelId === "explore-panel" },
      { label: "Reference", done: state.activePanelId === "reference-panel", active: state.activePanelId === "reference-panel" },
      { label: "Engage", done: state.engageDone, active: state.activePanelId === "engage-panel" },
    ];
    $("#progressPills").innerHTML = progress.map((item) => `
      <span class="ig-progress__pill${item.done ? " is-done" : ""}${item.active ? " is-active" : ""}">${escapeHtml(item.label)}</span>`).join("");
    $("#exploreMeta").textContent = `${state.visitedHotspots.size} of ${hotspots.length} hotspot regions explored`;
  }

  function renderAfterPanel() {
    const status = $("#afterStatus");
    const detail = $("#afterDetail");
    if (state.listenDone && state.exploreDone && state.engageDone) {
      status.textContent = "Pilot complete";
      detail.textContent = "You cleared the pilot pattern. The useful next comparison is EP-002 so you can line the infographic mental model up against the broader division overview.";
      return;
    }
    if (!state.listenDone) {
      status.textContent = "Start with Listen";
      detail.textContent = "The voiceover gives the map a job: it teaches how to route thinking, not just what the poster says.";
      return;
    }
    if (!state.exploreDone) {
      status.textContent = "Work the hotspot layer";
      detail.textContent = "Each hotspot adds the missing operator judgment: owner, decision cue, anti-pattern, and escalation logic.";
      return;
    }
    if (!state.engageDone) {
      status.textContent = "Finish the quiz";
      detail.textContent = "The last step checks whether the map changed your reasoning, not just your recall.";
      return;
    }
  }

  function bindEvents() {
    $("#tab-listen")?.addEventListener("click", () => showPanel("listen-panel"));
    $("#tab-explore")?.addEventListener("click", () => showPanel("explore-panel"));
    $("#tab-reference")?.addEventListener("click", () => showPanel("reference-panel"));
    $("#tab-engage")?.addEventListener("click", () => showPanel("engage-panel"));

    $("#playAll")?.addEventListener("click", () => speakAll());
    $("#stopVoice")?.addEventListener("click", () => stopSpeech());
    $("#markListenDone")?.addEventListener("click", () => {
      state.listenDone = true;
      persistState();
      renderProgress();
      renderAfterPanel();
      $("#listenStatus").textContent = "Listen marked complete manually.";
    });

    document.addEventListener("click", (event) => {
      const speakButton = event.target.closest("[data-speak-section]");
      if (speakButton) {
        const id = speakButton.getAttribute("data-speak-section");
        const section = (state.voiceover?.sections || []).find((item) => item.id === id);
        if (section) speakSection(section);
        return;
      }

      const focusButton = event.target.closest("[data-focus-hotspot]");
      if (focusButton) {
        const id = focusButton.getAttribute("data-focus-hotspot");
        showPanel("explore-panel");
        focusHotspot(id);
        return;
      }

      const hotspotButton = event.target.closest("[data-hotspot-id]");
      if (hotspotButton) {
        focusHotspot(hotspotButton.getAttribute("data-hotspot-id"));
        return;
      }
    });

    $("#prevHotspot")?.addEventListener("click", () => {
      const hotspots = state.profile.infographic.hotspots || [];
      const currentIndex = hotspots.findIndex((hotspot) => hotspot.id === state.activeHotspotId);
      if (currentIndex < 0) return;
      const next = hotspots[(currentIndex - 1 + hotspots.length) % hotspots.length];
      focusHotspot(next.id);
    });

    $("#nextHotspot")?.addEventListener("click", () => {
      const hotspots = state.profile.infographic.hotspots || [];
      const currentIndex = hotspots.findIndex((hotspot) => hotspot.id === state.activeHotspotId);
      if (currentIndex < 0) return;
      const next = hotspots[(currentIndex + 1) % hotspots.length];
      focusHotspot(next.id);
    });

    $("#zoomOut")?.addEventListener("click", () => {
      state.zoom = Math.max(1, Number((state.zoom - 0.2).toFixed(2)));
      $("#igStageInner").style.transform = `scale(${state.zoom})`;
      $("#zoomValue").textContent = `${Math.round(state.zoom * 100)}%`;
      const activeHotspot = findHotspot(state.activeHotspotId);
      if (activeHotspot) scrollStageToHotspot(activeHotspot);
    });

    $("#zoomIn")?.addEventListener("click", () => {
      state.zoom = Math.min(1.8, Number((state.zoom + 0.2).toFixed(2)));
      $("#igStageInner").style.transform = `scale(${state.zoom})`;
      $("#zoomValue").textContent = `${Math.round(state.zoom * 100)}%`;
      const activeHotspot = findHotspot(state.activeHotspotId);
      if (activeHotspot) scrollStageToHotspot(activeHotspot);
    });
  }

  async function boot() {
    try {
      state.profile = await loadJson(PROFILE_URL);
      state.voiceover = await loadJson(VOICEOVER_URL);
    } catch (error) {
      console.error(error);
      $("#appMount").innerHTML = `<div class="ig-panel"><div class="ig-panel__body"><p>Could not load the infographic pilot files. Use a local web server and reload this page.</p></div></div>`;
      return;
    }

    loadPersistedState();
    renderHero();
    renderExploreShell();
    renderVoiceoverCards();
    renderReferencePanel();
    renderQuest();
    renderQuiz();
    bindEvents();
    showPanel("listen-panel");

    const firstHotspot = state.profile.infographic.hotspots[0];
    state.activeHotspotId = firstHotspot?.id || "";
    focusHotspot(state.activeHotspotId, { skipVisit: true });
    renderProgress();
    renderAfterPanel();
  }

  boot();
})();

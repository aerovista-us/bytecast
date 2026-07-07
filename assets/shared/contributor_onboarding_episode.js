/**
 * Contributor Onboarding — shared episode runtime.
 * Reads content from ./bytecast_ep_profile.json
 */
(() => {
  const Loop = window.ByteCastLoop;
  const SlideArt = window.ContributorOnboardingSlideArt || null;
  const synth = window.speechSynthesis || null;
  const JID = "contributor_onboarding_training";
  const LISTEN_GATE_MS = 12000;

  const epNum = Math.max(0, Math.min(4, parseInt(document.body?.dataset?.bcEp || "0", 10) || 0));
  const prefix = `co_ep${epNum}`;
  const slug = String(document.body?.dataset?.bcSlug || "").trim() || `contributor_onboarding_ep${epNum}`;

  function markStep(stepId, meta = {}) {
    if (!Loop) return;
    Loop.markStepDone(stepId, { journeyId: JID, episodeSlug: slug, ...meta });
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  async function loadProfile() {
    const response = await fetch("./bytecast_ep_profile.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load profile: ${response.status}`);
    return response.json();
  }

  function renderPage(profile) {
    const episode = profile.episode || {};
    const content = profile.content || {};
    const training = profile.training || {};
    const engage = training.engage || {};
    const slides = training.slides || [];
    const final = training.final_assessment || null;

    document.title = `ByteCast — Contributor Onboarding • ${episode.title || `Ep ${epNum}`}`;
    setText("heroEyebrow", training.eyebrow || "Contributor Onboarding");
    setText("heroTitle", episode.title || `Ep ${epNum}`);
    setText("heroLead", content.summary_long || content.summary_short || "");

    const chips = document.getElementById("heroChips");
    if (chips) {
      chips.innerHTML = (training.chips || []).map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("");
    }

    const script = document.getElementById("readScript");
    if (script) {
      script.innerHTML = (training.transcript || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    }

    const slidesRoot = document.getElementById("slides");
    if (slidesRoot) {
      slidesRoot.innerHTML = slides
        .map(
          (slide, index) => `<div class="slide${index === 0 ? " is-active" : ""}" data-title="${escapeHtml(slide.title)}">
            <div class="slide-visual" data-slide-art="${escapeHtml(slide.id)}" aria-hidden="true"></div>
            <p class="sub">${escapeHtml(slide.body)}</p>
            <div class="note-grid">
              ${(slide.notes || []).map((note) => `<article class="mini">${escapeHtml(note)}</article>`).join("")}
            </div>
          </div>`
        )
        .join("");
    }

    const sources = document.getElementById("sourceList");
    if (sources) {
      sources.innerHTML = (training.sources || []).map((source) => `<li><code>${escapeHtml(source)}</code></li>`).join("");
    }

    const engagePrompt = document.getElementById("engagePrompt");
    if (engagePrompt) engagePrompt.textContent = engage.prompt || "";

    const engageOptions = document.getElementById("engageOptions");
    if (engageOptions) {
      engageOptions.innerHTML = (engage.options || [])
        .map(
          (option, index) =>
            `<label class="choice"><input type="radio" name="engage" value="${index}"${
              option.correct ? ' data-correct="true"' : ""
            } /> ${escapeHtml(option.label)}</label>`
        )
        .join("");
    }

    const finalSection = document.getElementById("finalSection");
    const finalIntro = document.getElementById("finalIntro");
    const finalQuestions = document.getElementById("finalQuestions");
    if (final && finalSection && finalIntro && finalQuestions) {
      finalSection.hidden = false;
      finalIntro.textContent = final.intro || "";
      finalQuestions.innerHTML = (final.questions || [])
        .map(
          (question) => `<div class="final-block">
            <p class="final-q">${escapeHtml(question.prompt)}</p>
            ${(question.options || [])
              .map(
                (option, index) =>
                  `<label class="choice"><input type="radio" name="${escapeHtml(question.name)}" value="${index}"${
                    option.correct ? ' data-correct="true"' : ""
                  } /> ${escapeHtml(option.label)}</label>`
              )
              .join("")}
          </div>`
        )
        .join("");
    } else if (finalSection) {
      finalSection.hidden = true;
    }

    document.querySelectorAll(".slide-visual[data-slide-art]").forEach((el) => {
      const key = el.dataset.slideArt;
      el.innerHTML = SlideArt && SlideArt[prefix] ? SlideArt[prefix](key) : "";
    });
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      document.querySelectorAll(".bc-art animate, .bc-art animateTransform").forEach((node) => node.remove());
    }

    return { slides, final };
  }

  let listenMarked = false;
  let listenTimer = 0;
  let listenStartedAt = 0;
  let listenRemainingMs = LISTEN_GATE_MS;

  function setReadStatus(message) {
    setText("readStatus", message);
  }

  function clearListenTimer() {
    if (listenTimer) {
      window.clearTimeout(listenTimer);
      listenTimer = 0;
    }
  }

  function markListen() {
    if (listenMarked) return;
    listenMarked = true;
    listenRemainingMs = 0;
    clearListenTimer();
    markStep(`${prefix}_listen`, { gate: "listen", listenMode: "read_aloud" });
  }

  function resetListenTimer() {
    clearListenTimer();
    listenStartedAt = 0;
    listenRemainingMs = LISTEN_GATE_MS;
  }

  function startListenTimer() {
    if (listenMarked || listenRemainingMs <= 0) {
      markListen();
      return;
    }
    clearListenTimer();
    listenStartedAt = Date.now();
    listenTimer = window.setTimeout(() => {
      listenRemainingMs = 0;
      markListen();
      setReadStatus("Listen complete. Progress saved for this browser.");
    }, listenRemainingMs);
  }

  function pauseListenTimer() {
    if (!listenTimer || !listenStartedAt) return;
    const elapsed = Date.now() - listenStartedAt;
    listenRemainingMs = Math.max(0, listenRemainingMs - elapsed);
    listenStartedAt = 0;
    clearListenTimer();
  }

  function scoreVoice(voice) {
    if (!voice) return -1;
    let score = 0;
    const name = `${voice.name || ""} ${voice.lang || ""}`;
    if (/en-US/i.test(voice.lang || "")) score += 60;
    else if (/^en/i.test(voice.lang || "")) score += 30;
    if (/natural|neural|online/i.test(name)) score += 40;
    if (/microsoft|google|apple/i.test(name)) score += 20;
    if (/aria|ava|jenny|guy|libby|davis|zira|david|mark|samantha|daniel/i.test(name)) score += 10;
    if (voice.default) score += 5;
    return score;
  }

  function pickVoice() {
    if (!synth?.getVoices) return null;
    return synth.getVoices().slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
  }

  function getTranscriptText() {
    return Array.from(document.querySelectorAll("#readScript p"))
      .map((node) => node.textContent?.trim() || "")
      .filter(Boolean)
      .join("\n\n");
  }

  function bindReadAloud() {
    const pauseButton = document.getElementById("btnPauseReadAloud");
    function syncPauseLabel() {
      if (!pauseButton) return;
      pauseButton.textContent = synth?.paused ? "Resume" : "Pause";
    }

    function stopReadAloud(message) {
      pauseListenTimer();
      if (synth?.speaking || synth?.paused) synth.cancel();
      syncPauseLabel();
      if (message) setReadStatus(message);
    }

    document.getElementById("btnReadAloud")?.addEventListener("click", () => {
      const transcript = getTranscriptText();
      if (!transcript) return setReadStatus("No read-aloud script was found on this page.");
      if (!synth) return setReadStatus("This browser does not expose Speech Synthesis. Use the manual listen button.");

      stopReadAloud();
      resetListenTimer();
      const utterance = new SpeechSynthesisUtterance(transcript);
      const voice = pickVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "en-US";
      } else {
        utterance.lang = "en-US";
      }
      utterance.onstart = () => {
        startListenTimer();
        syncPauseLabel();
        setReadStatus(voice ? `Reading aloud with ${voice.name}.` : "Reading aloud with the browser default voice.");
      };
      utterance.onend = () => {
        clearListenTimer();
        markListen();
        syncPauseLabel();
        setReadStatus("Read-aloud complete. Listen step saved for this browser.");
      };
      utterance.onerror = () => {
        pauseListenTimer();
        syncPauseLabel();
        setReadStatus("Read-aloud failed in this browser. Use the manual listen button instead.");
      };
      synth.speak(utterance);
    });

    pauseButton?.addEventListener("click", () => {
      if (!synth || (!synth.speaking && !synth.paused)) return;
      if (synth.paused) {
        synth.resume();
        startListenTimer();
        syncPauseLabel();
        setReadStatus("Read-aloud resumed.");
      } else {
        synth.pause();
        pauseListenTimer();
        syncPauseLabel();
        setReadStatus("Read-aloud paused.");
      }
    });

    document.getElementById("btnStopReadAloud")?.addEventListener("click", () => stopReadAloud("Read-aloud stopped. Restart it or use the manual listen button."));
    document.getElementById("btnListenDone")?.addEventListener("click", () => {
      markListen();
      setReadStatus("Listen marked complete manually. Progress saved for this browser.");
    });
    syncPauseLabel();
  }

  function bindSlides(slides) {
    const slideNodes = Array.from(document.querySelectorAll("#slides .slide"));
    let slideIdx = 0;
    let slideMarked = false;
    function syncSlides() {
      slideNodes.forEach((slide, index) => slide.classList.toggle("is-active", index === slideIdx));
      const titleEl = document.getElementById("slideTitle");
      if (titleEl && slideNodes[slideIdx]) titleEl.textContent = slideNodes[slideIdx].dataset.title || `Slide ${slideIdx + 1}`;
      if (slides.length && slideIdx === slides.length - 1 && !slideMarked) {
        slideMarked = true;
        markStep(`${prefix}_slide`, { gate: "slide" });
      }
    }
    document.getElementById("btnSlidePrev")?.addEventListener("click", () => {
      if (!slideNodes.length) return;
      slideIdx = (slideIdx - 1 + slideNodes.length) % slideNodes.length;
      syncSlides();
    });
    document.getElementById("btnSlideNext")?.addEventListener("click", () => {
      if (!slideNodes.length) return;
      slideIdx = (slideIdx + 1) % slideNodes.length;
      syncSlides();
    });
    syncSlides();
  }

  function bindEngage(final) {
    const engageForm = document.getElementById("engageForm");
    engageForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = engageForm.querySelector('input[name="engage"]:checked');
      const hint = document.getElementById("engageHint");
      if (selected?.dataset?.correct !== "true") {
        if (hint) hint.textContent = "Not quite. Pick the answer that matches the operating model, then try again.";
        return;
      }
      markStep(`${prefix}_engage`, { gate: "engage", engageQuizPassed: true, engageQuizScore: 1 });
      if (hint) hint.textContent = "Engage complete. Progress saved for this browser.";
    });

    if (!final) return;
    document.getElementById("finalForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const names = Array.from(new Set(Array.from(document.querySelectorAll("#finalForm input[type='radio']")).map((input) => input.name)));
      const passed = names.every((name) => document.querySelector(`#finalForm input[name="${name}"]:checked`)?.dataset?.correct === "true");
      const hint = document.getElementById("finalHint");
      if (!passed) {
        if (hint) hint.textContent = "Passing requires every final check to be correct.";
        return;
      }
      markStep("co_final_assessment", {
        mission: "contributor_onboarding_final",
        understandingCheckPassed: true,
        finalAssessmentPassed: true,
        finalAssessmentAt: new Date().toISOString()
      });
      if (hint) hint.textContent = "Final assessment recorded. Progress saved for this browser.";
    });
  }

  (async () => {
    if (Loop) {
      try {
        Loop.setActiveJourneyId(JID);
      } catch {}
    }
    const { slides, final } = renderPage(await loadProfile());
    bindReadAloud();
    bindSlides(slides || []);
    bindEngage(final);
  })().catch((error) => {
    console.error(error);
    setReadStatus("Episode content failed to load.");
  });
})();

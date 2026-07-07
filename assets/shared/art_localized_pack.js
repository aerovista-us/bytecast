/**
 * The Art Localized — pack-driven episode (Phase AVHQ packs).
 * body[data-bc-ep][data-bc-slug][data-bc-manifest="../The_Art_Localized_PhaseN_Pack_AVHQ/pack_manifest.json"]
 * Populates #audio, #slides, #engageForm; ep4 optional #finalForm from manifest.final_assessment
 */
(() => {
  const Loop = window.ByteCastLoop;
  const JID = "art_localized_training";

  const epNum = Math.max(0, Math.min(4, parseInt(document.body?.dataset?.bcEp || "0", 10) || 0));
  const prefix = `ep${epNum}`;
  const slug =
    String(document.body?.dataset?.bcSlug || "").trim() || `art_localized_ep${epNum}`;
  const manifestRel = String(document.body?.dataset?.bcManifest || "").trim();

  if (Loop) {
    try {
      Loop.setActiveJourneyId(JID);
    } catch {
      // ignore
    }
  }

  function markStep(stepId, meta = {}) {
    if (!Loop) return;
    Loop.markStepDone(stepId, { journeyId: JID, episodeSlug: slug, ...meta });
  }

  function packBaseFromManifestUrl(manifestUrl) {
    try {
      const u = new URL(manifestUrl, window.location.href);
      u.pathname = String(u.pathname || "").replace(/[^/]+$/, "");
      return u.toString();
    } catch {
      return "";
    }
  }

  function resolvePackAsset(packBase, rel) {
    const r = String(rel || "").trim();
    if (!r || !packBase) return "";
    try {
      return new URL(r.replace(/^\//, ""), packBase).toString();
    } catch {
      return "";
    }
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return res.json();
  }

  function buildEngageForm(manifest) {
    const form = document.getElementById("engageForm");
    if (!form) return null;
    const eng = manifest?.engage && typeof manifest.engage === "object" ? manifest.engage : {};
    const prompt = String(eng.prompt || "Pick the best answer.");
    const options = Array.isArray(eng.options) ? eng.options : [];
    const correctValue = options.find((o) => o && o.correct)?.value;
    const hintId = "engageHint";
    form.innerHTML = `
      <p class="sub" style="margin:0 0 8px;">${prompt}</p>
      ${options
        .map(
          (o) => `
      <label><input type="radio" name="engage" value="${String(o.value)}" data-correct="${o.correct ? "1" : "0"}" /> ${String(o.label || "")}</label>`
        )
        .join("")}
      <div class="row" style="margin-top:10px;">
        <button type="submit" class="btn btn--primary" id="engageSubmit">Submit Engage</button>
      </div>
      <p id="${hintId}"></p>
    `;
    return { correctValue, hintId };
  }

  function buildFinalForm(manifest) {
    const wrap = document.getElementById("finalAssessmentMount");
    if (!wrap) return;
    const fa = manifest?.final_assessment && typeof manifest.final_assessment === "object" ? manifest.final_assessment : null;
    if (!fa || epNum !== 4) {
      wrap.innerHTML = "";
      return;
    }
    const intro = String(fa.intro || "");
    const questions = Array.isArray(fa.questions) ? fa.questions : [];
    wrap.innerHTML = `
      <h2>Final assessment</h2>
      <p class="sub" style="margin:0 0 8px;">${intro}</p>
      <form id="finalForm">
        ${questions
          .map((q, qi) => {
            const name = String(q.name || `q${qi}`);
            const opts = Array.isArray(q.options) ? q.options : [];
            return `
            <p class="final-q">${String(q.prompt || "")}</p>
            ${opts
              .map(
                (o) => `
            <label><input type="radio" name="${name}" value="${String(o.value)}" data-correct="${o.correct ? "1" : "0"}" /> ${String(o.label || "")}</label>`
              )
              .join("")}`;
          })
          .join("")}
        <div class="row" style="margin-top:10px;">
          <button type="submit" class="btn btn--primary">Submit final assessment</button>
        </div>
        <p id="finalHint"></p>
      </form>
    `;
  }

  function wireFinalFromManifest(manifest) {
    const fa = manifest?.final_assessment && typeof manifest.final_assessment === "object" ? manifest.final_assessment : null;
    if (!fa || epNum !== 4) return;
    const questions = Array.isArray(fa.questions) ? fa.questions : [];
    const finalForm = document.getElementById("finalForm");
    finalForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      for (let i = 0; i < questions.length; i += 1) {
        const name = String(questions[i].name || `q${i}`);
        const picked = finalForm.querySelector(`input[name="${name}"]:checked`);
        if (!picked || picked.dataset.correct !== "1") ok = false;
      }
      if (!ok) {
        const el = document.getElementById("finalHint");
        if (el) el.textContent = String(fa.failHint || "All questions must be correct to pass.");
        return;
      }
      markStep("final_assessment", {
        mission: "art_localized_final",
        understandingCheckPassed: true,
        finalAssessmentPassed: true,
        finalAssessmentAt: new Date().toISOString(),
      });
      const el = document.getElementById("finalHint");
      if (el) el.textContent = String(fa.passHint || "Final assessment recorded. Progress saved for this browser.");
    });
  }

  async function boot() {
    if (!manifestRel) return;

    let manifestUrl = "";
    try {
      manifestUrl = new URL(manifestRel, window.location.href).toString();
    } catch {
      return;
    }

    let manifest;
    try {
      manifest = await loadJson(manifestUrl);
    } catch (err) {
      const el = document.getElementById("packLoadError");
      if (el) {
        el.style.display = "block";
        el.textContent = `Could not load pack manifest. Check the path and network. (${String(err?.message || err)})`;
      }
      return;
    }

    const packBase = packBaseFromManifestUrl(manifestUrl);
    const titleEl = document.getElementById("episodeTitle");
    if (titleEl && manifest.title) titleEl.textContent = String(manifest.title);

    const audioEl = document.getElementById("audio");
    const audioCfg = manifest.audio && typeof manifest.audio === "object" ? manifest.audio : {};
    const primary = resolvePackAsset(packBase, audioCfg.primary);
    const fallback = resolvePackAsset(packBase, audioCfg.fallback);
    if (audioEl && primary) {
      audioEl.src = primary;
      audioEl.addEventListener(
        "error",
        () => {
          if (fallback && audioEl.src !== fallback) {
            audioEl.src = fallback;
            try {
              audioEl.load();
            } catch {
              // ignore
            }
          }
        },
        { once: true }
      );
      try {
        audioEl.load();
      } catch {
        // ignore
      }
    }

    const slidesEl = document.getElementById("slides");
    const slideList = Array.isArray(manifest.slides) ? manifest.slides : [];
    if (slidesEl) {
      slidesEl.innerHTML = slideList
        .map(
          (s, i) => `
      <div class="slide${i === 0 ? " is-active" : ""}" data-title="${String(s.title || `Slide ${i + 1}`)}">
        ${String(s.html || "")}
      </div>`
        )
        .join("");
    }

    const engageMeta = buildEngageForm(manifest);
    buildFinalForm(manifest);

    const slides = Array.from(document.querySelectorAll("#slides .slide"));
    let slideIdx = 0;
    let slideMarked = false;
    let listenMarked = false;

    function markListen() {
      if (listenMarked) return;
      listenMarked = true;
      markStep(`${prefix}_listen`, { gate: "listen" });
    }

    function markSlideGate() {
      if (slideMarked) return;
      slideMarked = true;
      markStep(`${prefix}_slide`, { gate: "slide" });
    }

    function syncSlides() {
      slides.forEach((s, j) => s.classList.toggle("is-active", j === slideIdx));
      const st = document.getElementById("slideTitle");
      if (st && slides[slideIdx]) st.textContent = slides[slideIdx].dataset.title || `Slide ${slideIdx + 1}`;
      if (slides.length && slideIdx === slides.length - 1) markSlideGate();
    }

    function goSlide(delta) {
      if (!slides.length) return;
      slideIdx = (slideIdx + delta + slides.length) % slides.length;
      syncSlides();
    }

    const audio = document.getElementById("audio");
    if (audio) {
      audio.addEventListener("timeupdate", () => {
        try {
          if (Number(audio.currentTime) >= 12) markListen();
        } catch {
          // ignore
        }
      });
      audio.addEventListener("ended", () => markListen());
    }
    document.getElementById("btnListenDone")?.addEventListener("click", () => markListen());
    document.getElementById("btnSlidePrev")?.addEventListener("click", () => goSlide(-1));
    document.getElementById("btnSlideNext")?.addEventListener("click", () => goSlide(1));
    syncSlides();

    const engageForm = document.getElementById("engageForm");
    engageForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const picked = engageForm.querySelector('input[name="engage"]:checked');
      const ok = picked && picked.dataset.correct === "1";
      if (!ok) {
        const el = document.getElementById("engageHint");
        if (el) el.textContent = "Not quite — pick the best answer, then try again.";
        return;
      }
      markStep(`${prefix}_engage`, {
        gate: "engage",
        engageQuizPassed: true,
        engageQuizScore: 1,
      });
      const el = document.getElementById("engageHint");
      if (el) el.textContent = "Engage complete. Progress saved for this browser.";
    });

    wireFinalFromManifest(manifest);
  }

  void boot();
})();

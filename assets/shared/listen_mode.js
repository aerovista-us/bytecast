/**
 * ByteCast Day 1 listen mode: Web Speech API + teleprompter pane.
 * @see docs/day1/LISTEN_MODE.md
 */
(function (global) {
  "use strict";

  function splitChunks(text) {
    const t = String(text || "")
      .replace(/([.!?])(?=[A-Za-z0-9])/g, "$1 ")
      .replace(/\s+/g, " ")
      .trim();
    if (!t) return [];
    const raw = t.split(/(?<=[.!?])\s+/).filter(Boolean);
    const out = [];
    let buf = "";
    for (const p of raw) {
      if ((buf + " " + p).trim().length <= 120 && buf) {
        buf = (buf + " " + p).trim();
      } else {
        if (buf) out.push(buf);
        buf = p;
      }
    }
    if (buf) out.push(buf);
    return out;
  }

  function createEl(tag, cls, html) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (html != null) el.innerHTML = html;
    return el;
  }

  function normalizeSpeakText(text) {
    return String(text || "")
      .replace(/([.!?])(?=[A-Za-z0-9])/g, "$1 ")
      .replace(/\bACOS\b/g, "A C O S")
      .replace(/\bSOT\b/g, "S O T")
      .replace(/\bHQ\b/g, "H Q")
      .replace(/\bTR-001A\b/g, "T R zero zero one A")
      .replace(/\bEP-0*([0-9]+)\b/gi, function (_, n) {
        return "Episode " + String(Number(n));
      })
      .replace(/episodes\s*\/\s*<slug>\s*\/?/gi, "episodes slash slug")
      .replace(/->|=>|→/g, " to ")
      .replace(/\s*&\s*/g, " and ")
      .replace(/\s*\/\s*/g, " slash ")
      .replace(/[<>]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function scoreVoice(voice) {
    if (!voice) return -1;
    const name = String(voice.name || "");
    const lang = String(voice.lang || "");
    let score = 0;
    if (/^en[-_]?us$/i.test(lang) || /^en[-_]?us\b/i.test(lang)) score += 40;
    else if (/^en\b/i.test(lang) || /^en[-_]/i.test(lang)) score += 22;
    if (/natural|neural|online/i.test(name)) score += 24;
    if (/microsoft|google/i.test(name)) score += 10;
    if (/aria|jenny|guy|davis|ava|andrew/i.test(name)) score += 8;
    if (voice.localService) score += 2;
    if (voice.default) score += 1;
    return score;
  }

  function pickBestVoice() {
    try {
      const synth = global.speechSynthesis;
      if (!synth || typeof synth.getVoices !== "function") return null;
      const voices = synth.getVoices() || [];
      if (!voices.length) return null;
      let best = null;
      let bestScore = -1;
      voices.forEach(function (voice) {
        const score = scoreVoice(voice);
        if (score > bestScore) {
          best = voice;
          bestScore = score;
        }
      });
      return best;
    } catch (_) {
      return null;
    }
  }

  /**
   * @param {object} options
   * @param {string} [options.jsonUrl] - used with fetch (http/https). On file://, .load.js is loaded instead.
   * @param {object} [options.jsonPayload] - inline payload (skips fetch / .load.js)
   * @param {HTMLElement} options.mount - host for strip + pane + controls
   * @param {function} [options.onListenGate] - idempotent listen proof
   * @param {HTMLAudioElement|null} [options.hiddenAudio]
   * @param {number} [options.audioListenSeconds=30]
   * @param {function} [options.showListenTab] - () => void
   * @param {string} [options.overviewLabel]
   * @param {string|false} [options.listenPanelId] - element id whose `hidden` attribute triggers stop (default `listen-panel`; `false` to disable)
   */
  function init(options) {
    const mount = options.mount;
    if (!mount) return;

    const onListenGate =
      typeof options.onListenGate === "function" ? options.onListenGate : function () {};
    let gateFired = false;
    function fireGate() {
      if (gateFired) return;
      gateFired = true;
      try {
        onListenGate();
      } catch (_) {}
    }

    const audioEl = options.hiddenAudio || null;
    const audioSec = Math.max(5, Number(options.audioListenSeconds) || 30);
    if (audioEl) {
      const onAudioProgress = function () {
        try {
          const t = audioEl.currentTime || 0;
          if (t >= audioSec || audioEl.ended) {
            audioEl.removeEventListener("timeupdate", onAudioProgress);
            fireGate();
          }
        } catch (_) {}
      };
      audioEl.addEventListener("timeupdate", onAudioProgress);
      audioEl.addEventListener("ended", function () {
        fireGate();
      });
    }

    const root = createEl("div", "bytecast-listen bytecast-listen-dim-exempt");
    const top = createEl("div", "bytecast-listen__top");
    const strip = createEl(
      "p",
      "bytecast-listen__strip",
      "<strong>Listen:</strong> Use <strong>Read episode overview</strong> for the full lesson. The follow-along view stays centered and tracks the voice. In Microsoft Edge, <strong>Ctrl+Shift+U</strong> also reads selected text."
    );
    const meta = createEl("div", "bytecast-listen__meta");
    const controls = createEl("div", "bytecast-listen__controls");
    const btnOverview = createEl(
      "button",
      "bytecast-listen__btn bytecast-listen__btn--primary",
      options.overviewLabel || "Read episode overview"
    );
    btnOverview.type = "button";
    const btnPause = createEl("button", "bytecast-listen__btn", "Pause");
    btnPause.type = "button";
    btnPause.disabled = true;
    const btnStop = createEl("button", "bytecast-listen__btn", "Stop");
    btnStop.type = "button";
    btnStop.disabled = true;
    const status = createEl("div", "bytecast-listen__status", "");
    const live = createEl("div", "bytecast-listen__live");
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");

    const pane = createEl("div", "bytecast-listen-pane");
    const track = createEl("div", "bytecast-listen-pane__track");
    pane.appendChild(track);

    controls.appendChild(btnOverview);
    controls.appendChild(btnPause);
    controls.appendChild(btnStop);
    meta.appendChild(controls);
    meta.appendChild(status);
    top.appendChild(strip);
    top.appendChild(meta);
    root.appendChild(top);
    root.appendChild(live);
    root.appendChild(pane);
    mount.appendChild(root);

    let payload = null;
    let byId = {};
    let queue = [];
    let chunkEls = [];
    let idx = 0;
    let modeOverview = false;
    let speaking = false;
    let paused = false;
    /** Bumped on every cancel; utterance onend/onerror must match or the chain stops (Edge/Chromium often still fire onend after cancel()). */
    let speakSessionGen = 0;

    try {
      if (global.speechSynthesis && typeof global.speechSynthesis.getVoices === "function") {
        global.speechSynthesis.getVoices();
      }
    } catch (_) {}

    function setDim(on) {
      document.body.classList.toggle("bytecast-listen-dim", Boolean(on));
    }

    function syncPlaybackUi() {
      root.classList.toggle("is-speaking", Boolean(speaking));
      root.classList.toggle("is-paused", Boolean(paused));
      btnOverview.disabled = Boolean(speaking);
      btnPause.disabled = !speaking;
      btnPause.textContent = paused ? "Resume" : "Pause";
      btnStop.disabled = !speaking;
      if (!speaking) {
        status.textContent = "";
        live.textContent = "";
        return;
      }
      status.textContent = paused ? "Paused. Resume or Stop." : "Playing... Pause or Stop.";
      live.textContent = status.textContent;
    }

    function cancelSpeech() {
      speakSessionGen += 1;
      queue = [];
      idx = 0;
      try {
        global.speechSynthesis.cancel();
      } catch (_) {}
      try {
        if (global.speechSynthesis.paused) global.speechSynthesis.resume();
      } catch (_) {}
      try {
        global.speechSynthesis.cancel();
      } catch (_) {}
      chunkEls.forEach((c) => c.classList.remove("is-active"));
      speaking = false;
      paused = false;
      syncPlaybackUi();
      setDim(false);
    }

    (function wireStopWhenListenHidden() {
      if (options.listenPanelId === false) return;
      var panelId = typeof options.listenPanelId === "string" ? options.listenPanelId : "listen-panel";
      var panel = document.getElementById(panelId);
      if (!panel) return;
      try {
        var obs = new MutationObserver(function () {
          if (panel.hasAttribute("hidden")) cancelSpeech();
        });
        obs.observe(panel, { attributes: true, attributeFilter: ["hidden"] });
      } catch (_) {}
    })();

    function renderChunksForText(fullText) {
      track.innerHTML = "";
      chunkEls = [];
      const parts = splitChunks(fullText);
      parts.forEach((p) => {
        const span = createEl("span", "bytecast-listen-pane__chunk");
        span.textContent = p + " ";
        track.appendChild(span);
        chunkEls.push(span);
      });
      track.scrollTop = 0;
    }

    function activateChunk(i) {
      chunkEls.forEach((c, j) => c.classList.toggle("is-active", j === i));
      const el = chunkEls[i];
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }

    function speakNext(sessionGen) {
      if (sessionGen !== speakSessionGen) return;
      if (idx >= queue.length) {
        chunkEls.forEach((c) => c.classList.remove("is-active"));
        speaking = false;
        paused = false;
        syncPlaybackUi();
        setDim(false);
        if (modeOverview && sessionGen === speakSessionGen) fireGate();
        modeOverview = false;
        return;
      }
      const item = queue[idx];
      const u = new SpeechSynthesisUtterance(item.text);
      const voice = pickBestVoice();
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang || "en-US";
      } else {
        u.lang = "en-US";
      }
      u.rate = 0.97;
      u.pitch = 1;
      u.volume = 1;
      u.onstart = function () {
        if (sessionGen !== speakSessionGen) return;
        activateChunk(item.chunkIndex);
      };
      u.onend = function () {
        if (sessionGen !== speakSessionGen) return;
        idx += 1;
        speakNext(sessionGen);
      };
      u.onerror = function () {
        if (sessionGen !== speakSessionGen) return;
        idx += 1;
        speakNext(sessionGen);
      };
      try {
        global.speechSynthesis.speak(u);
      } catch (_) {
        if (sessionGen !== speakSessionGen) return;
        idx += 1;
        speakNext(sessionGen);
      }
    }

    function startSpeaking(fullText, isOverview) {
      if (speaking) return;
      const showTab = options.showListenTab;
      if (typeof showTab === "function") showTab();

      cancelSpeech();
      modeOverview = Boolean(isOverview);
      const parts = splitChunks(fullText);
      if (!parts.length) return;

      speaking = true;
      paused = false;
      syncPlaybackUi();
      status.textContent = "Playing… Stop to cancel.";
      live.textContent = status.textContent;
      syncPlaybackUi();
      setDim(true);

      renderChunksForText(fullText);
      queue = parts.map((text, chunkIndex) => ({ text: normalizeSpeakText(text), chunkIndex }));
      idx = 0;
      const sessionGen = speakSessionGen;
      speakNext(sessionGen);
    }

    btnStop.addEventListener("click", function () {
      modeOverview = false;
      cancelSpeech();
    });

    btnPause.addEventListener("click", function () {
      if (!speaking) return;
      try {
        if (paused || global.speechSynthesis.paused) {
          global.speechSynthesis.resume();
          paused = false;
        } else {
          global.speechSynthesis.pause();
          paused = true;
        }
      } catch (_) {
        return;
      }
      syncPlaybackUi();
    });

    btnOverview.addEventListener("click", function () {
      if (!payload || speaking) return;
      const order = payload.overviewOrder || [];
      const texts = order.map((id) => byId[id]?.speakText).filter(Boolean);
      if (!texts.length) return;
      btnOverview.disabled = true;
      startSpeaking(texts.join("\n"), true);
    });

    function startSection(sectionId) {
      if (!payload) return;
      const sec = byId[sectionId];
      if (!sec || !sec.speakText) return;
      if (speaking) cancelSpeech();
      btnOverview.disabled = true;
      startSpeaking(sec.speakText, false);
    }

    const api = {
      startSection: startSection,
      stop: cancelSpeech,
      ready: function () {
        return Boolean(payload);
      },
    };

    function applyPayload(data) {
      if (!data || typeof data !== "object") return;
      payload = data;
      (data.sections || []).forEach(function (s) {
        byId[s.id] = s;
      });
      try {
        delete global.ByteCastVoiceoverSections;
      } catch (_) {}
      if (typeof options.onReady === "function") {
        try {
          options.onReady(api, data);
        } catch (_) {}
      }
    }

    function failLoad(msg) {
      status.textContent = msg;
    }

    var isFileOrigin =
      global.location && /^file:/i.test(String(global.location.protocol || ""));

    if (options.jsonPayload && typeof options.jsonPayload === "object") {
      applyPayload(options.jsonPayload);
    } else if (isFileOrigin && global.ByteCastVoiceoverSections && typeof global.ByteCastVoiceoverSections === "object") {
      applyPayload(global.ByteCastVoiceoverSections);
    } else if (isFileOrigin) {
      var jsonUrl = String(options.jsonUrl || "");
      var loadJs = jsonUrl.replace(/\.json$/i, ".load.js");
      if (!loadJs || loadJs === jsonUrl) {
        failLoad(
          "file:// cannot load narration via fetch. Expected assets/voiceover_sections.load.js (run python scripts/voiceover_md_to_json.py) or use a local web server."
        );
      } else {
        var tag = document.createElement("script");
        tag.async = true;
        tag.onload = function () {
          var d = global.ByteCastVoiceoverSections;
          if (d && typeof d === "object") applyPayload(d);
          else
            failLoad(
              "voiceover_sections.load.js did not set window.ByteCastVoiceoverSections. Regenerate voiceover assets."
            );
        };
        tag.onerror = function () {
          failLoad(
            "Could not load " +
              loadJs +
              " — regenerate with python scripts/voiceover_md_to_json.py or open over http://localhost."
          );
        };
        tag.src = loadJs;
        document.head.appendChild(tag);
      }
    } else if (options.jsonUrl) {
      fetch(options.jsonUrl)
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .then(applyPayload)
        .catch(function () {
          failLoad(
            "Could not load narration data. Check voiceover_sections.json or your network. For file://, use generated voiceover_sections.load.js."
          );
        });
    } else {
      failLoad("Listen mode: missing jsonUrl or jsonPayload.");
    }

    return api;
  }

  function attachSectionButton(containerEl, listenApi, sectionId) {
    if (!containerEl || !listenApi) return;
    const wrap = createEl("div", "bytecast-listen-section bytecast-listen-dim-exempt");
    const hint = createEl(
      "p",
      "bytecast-listen-section__hint",
      "<strong>Read this section</strong> — plays this part and scrolls the listen panel."
    );
    const btn = createEl("button", "bytecast-listen-section__btn", "Read this section");
    btn.type = "button";
    btn.addEventListener("click", function () {
      listenApi.startSection(sectionId);
    });
    wrap.appendChild(hint);
    wrap.appendChild(btn);
    containerEl.appendChild(wrap);
  }

  global.ByteCastListenMode = {
    init: init,
    attachSectionButton: attachSectionButton,
  };
})(typeof window !== "undefined" ? window : globalThis);

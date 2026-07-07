(function () {
  // Some environments (or injected scripts) may reference this global.
  // When opening pages via `file://`, it can be missing and throw a ReferenceError.
  // A harmless stub prevents the page from breaking before narration handlers run.
  try {
    if (typeof globalThis.learningToolsRuntime === "undefined") {
      globalThis.learningToolsRuntime = {};
    }
  } catch {
    // ignore
  }

  const dock = document.querySelector("[data-audio-dock]") || document.querySelector("[data-audio-bar]") || null;
  const dockTitle = document.querySelector("[data-audio-title]") || null;
  const dockDisclosure = document.querySelector("[data-audio-disclosure]") || null;
  const dockFill = document.querySelector("[data-audio-fill]") || document.querySelector("[data-progress-fill]") || null;
  const stopButton = document.querySelector("[data-audio-stop]") || document.querySelector("[data-stop]") || null;
  const synth = window.speechSynthesis || null;
  const scrollProgress = document.querySelector("[data-scroll-progress]") || null;
  const toTopButton = document.querySelector("[data-to-top]") || null;

  let activeAudio = null;
  let activeSources = [];
  let activeIndex = 0;
  let speechQueue = [];
  let speechIndex = 0;
  let voiceRetryScheduled = false;

  function setPlaying(isPlaying) {
    const body = document.body;
    if (!body) return;
    if (isPlaying) {
      body.dataset.audioPlaying = "true";
    } else {
      delete body.dataset.audioPlaying;
    }
  }

  function setDock(title, disclosure) {
    if (!dock) return;
    dock.hidden = false;
    if (dockTitle) dockTitle.textContent = title || "ByteCast narration";
    if (dockDisclosure) dockDisclosure.textContent = disclosure || "";
    setProgress(0);
  }

  function setProgress(value) {
    if (!dockFill) return;
    const clamped = Math.max(0, Math.min(100, value));
    dockFill.style.width = clamped + "%";
  }

  function stopEverything(message) {
    setPlaying(false);
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.src = "";
      activeAudio = null;
    }
    activeSources = [];
    activeIndex = 0;
    speechQueue = [];
    speechIndex = 0;
    if (synth) synth.cancel();
    setProgress(0);
    if (message && dockTitle) dockTitle.textContent = message;
  }

  function updateScrollUi() {
    const root = document.documentElement;
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    const value = Math.max(0, Math.min(1, window.scrollY / max));
    if (scrollProgress) {
      scrollProgress.style.width = value * 100 + "%";
    }
    if (toTopButton) {
      toTopButton.classList.toggle("show", window.scrollY > 320);
    }
  }

  function narrationTextFromSelector(selector) {
    if (!selector) return "";
    const node = document.querySelector(selector);
    if (!node) return "";
    // `<template>` contents are stored under `.content` (not always exposed via `.textContent`).
    if (node.content && node.content.textContent != null) {
      return String(node.content.textContent || "").trim();
    }
    return String(node.textContent || "").trim();
  }

  function narrationTextFromReadTrigger(trigger) {
    const selector = trigger.getAttribute("data-read-target");
    if (selector) {
      const node = document.querySelector(selector);
      if (node) return (node.innerText || node.textContent || "").trim();
    }

    const closest = trigger.closest("section, article, main");
    if (closest) return (closest.innerText || closest.textContent || "").trim();
    return (document.body.innerText || document.body.textContent || "").trim();
  }

  function playGeneratedAudio(title, sources) {
    stopEverything();
    activeSources = sources.slice();
    setDock(title, "AI-generated voice preview");
    setPlaying(true);

    function startSource(index) {
      activeIndex = index;
      const audio = new Audio(activeSources[index]);
      activeAudio = audio;

      audio.addEventListener("timeupdate", function () {
        const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 1;
        const progress = ((activeIndex + audio.currentTime / duration) / activeSources.length) * 100;
        setProgress(progress);
      });

      audio.addEventListener("ended", function () {
        const nextIndex = index + 1;
        if (nextIndex < activeSources.length) {
          startSource(nextIndex);
          return;
        }
        setProgress(100);
        setPlaying(false);
        if (dockTitle) dockTitle.textContent = title + " complete";
      });

      audio.play().catch(function () {
        setPlaying(false);
        if (dockTitle) dockTitle.textContent = "Unable to play generated audio";
      });
    }

    startSource(0);
  }

  function selectBestVoice(voices) {
    if (!voices || !voices.length) return null;

    // Strong preference: Microsoft Brian (Natural) if available.
    const brianNatural = voices.find((v) => {
      const hay = `${v.name} ${v.lang}`;
      return (
        /brian/i.test(hay) &&
        /microsoft/i.test(v.name) &&
        /natural/i.test(v.name) &&
        /(en-us|en[_-]us|english)/i.test(hay)
      );
    });
    if (brianNatural) return brianNatural;

    const brianAny = voices.find((v) => {
      const hay = `${v.name} ${v.lang}`;
      return /brian/i.test(hay) && /(en-us|en[_-]us|english)/i.test(hay);
    });
    if (brianAny) return brianAny;

    // Prefer common Edge/Microsoft "Natural" style voice naming.
    const preferredPatterns = [
      /microsoft.*(natural)/i,
      /microsoft.*(davis|guy|ryan|steffan|aaron|mark)/i,
      /(davis|guy|ryan|steffan|aaron|mark)/i,
      /microsoft.*en-us/i,
      /(en-us).*natural/i,
      /english.*male/i,
      /en-us/i,
      /english/i,
    ];

    for (const pattern of preferredPatterns) {
      const match = voices.find((voice) => pattern.test(`${voice.name} ${voice.lang}`));
      if (match) return match;
    }

    return voices[0] || null;
  }

  function normalizeSpeechText(text) {
    // Ellipses create a very long dwell/pause in many Microsoft Natural voices.
    // Convert them into tighter sentence boundaries for a more natural pace.
    return String(text || "")
      .replace(/\u2026/g, ". ")
      .replace(/\.{3,}/g, ". ")
      .replace(/\s+\./g, ".")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  async function pickVoiceAsync() {
    if (!synth) return null;

    const voicesNow = synth.getVoices();
    const initial = voicesNow && voicesNow.length ? voicesNow : null;
    if (initial) return selectBestVoice(initial);

    // In some environments (notably `file://`) voices load asynchronously.
    // Wait for `voiceschanged` before giving up.
    return new Promise((resolve) => {
      let settled = false;

      const finish = (voices) => {
        if (settled) return;
        settled = true;
        try {
          synth.removeEventListener("voiceschanged", onChange);
        } catch {
          // ignore
        }
        resolve(selectBestVoice(voices) || null);
      };

      const onChange = () => {
        const v = synth.getVoices();
        if (v && v.length) finish(v);
      };

      try {
        synth.addEventListener("voiceschanged", onChange);
      } catch {
        // ignore
      }

      setTimeout(() => {
        finish(synth.getVoices());
      }, 2000);
    });
  }

  function chunkForSpeech(text) {
    const paragraphs = normalizeSpeechText(text)
      .replace(/\r\n?/g, "\n")
      .split(/\n{2,}/)
      .map(function (part) {
        return part.replace(/\s+/g, " ").trim();
      })
      .filter(Boolean);

    const chunks = [];
    let current = "";
    const maxLength = 260;

    // Keep paragraphs from becoming forced hard-pauses by not flushing at each break.
    paragraphs.forEach(function (paragraph, paragraphIndex) {
      const sentences = paragraph.match(/[^.!?]+[.!?]?/g) || [paragraph];
      sentences.forEach(function (sentence) {
        const clean = sentence.trim();
        if (!clean) return;
        const candidate = current ? current + " " + clean : clean;
        if (candidate.length <= maxLength) {
          current = candidate;
        } else {
          if (current) chunks.push(current);
          current = clean;
        }
      });

      // Add a small boundary between paragraphs without forcing a full utterance break.
      if (paragraphIndex < paragraphs.length - 1) {
        if (current && current.length > maxLength * 0.92) {
          chunks.push(current);
          current = "";
        }
      }
    });

    if (current) chunks.push(current);
    return chunks;
  }

  async function speakFallback(title, text) {
    if (!synth) {
      if (dockTitle) dockTitle.textContent = "Speech synthesis is not available";
      return;
    }

    const narration = normalizeSpeechText(text);
    if (!narration) {
      if (dockTitle) dockTitle.textContent = "No narration text found";
      setProgress(0);
      return;
    }

    stopEverything();
    setDock(title, "Loading browser voice");
    const voice = await pickVoiceAsync();

    speechQueue = chunkForSpeech(narration);
    speechIndex = 0;
    setDock(title, "Browser speech fallback");
    setPlaying(true);

    function speakNext() {
      if (!speechQueue.length) {
        setProgress(100);
        setPlaying(false);
        if (dockTitle) dockTitle.textContent = title + " complete";
        return;
      }

      const chunk = speechQueue.shift();
      const utterance = new SpeechSynthesisUtterance(chunk);
      // Slightly faster rate reduces perceived punctuation dwell time.
      utterance.rate = 0.98;
      utterance.pitch = 0.9;
      utterance.volume = 1;
      // Force English for consistency across pages; also helps multilingual voices avoid mis-detection.
      utterance.lang = (voice && voice.lang) || "en-US";
      if (voice) utterance.voice = voice;

      utterance.onend = function () {
        speechIndex += 1;
        const total = speechIndex + speechQueue.length;
        const progress = total ? (speechIndex / total) * 100 : 100;
        setProgress(progress);
        speakNext();
      };

      utterance.onerror = function () {
        if (dockTitle) dockTitle.textContent = "Speech playback stopped";
        stopEverything();
      };

      synth.speak(utterance);
    }

    speakNext();
  }

  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-play-narration]");
    if (trigger) {
      const title = trigger.getAttribute("data-title") || "ByteCast narration";
      const sources = (trigger.getAttribute("data-audio-sources") || "")
        .split("|")
        .map(function (value) {
          return value.trim();
        })
        .filter(Boolean);
      const narrationText = narrationTextFromSelector(trigger.getAttribute("data-narration-source"));

      if (sources.length) {
        playGeneratedAudio(title, sources);
      } else {
        speakFallback(title, narrationText);
      }
    }

    const legacyRead = event.target.closest("[data-read]");
    if (legacyRead) {
      const title = legacyRead.getAttribute("data-label") || legacyRead.textContent || "ByteCast narration";
      const narrationText = narrationTextFromReadTrigger(legacyRead);
      speakFallback(title, narrationText);
    }

    const stopTarget = event.target.closest("[data-audio-stop], [data-stop]");
    if (stopTarget) {
      stopEverything("Narration stopped");
    }
  });

  if (stopButton) {
    stopButton.addEventListener("click", function () {
      stopEverything("Narration stopped");
    });
  }

  window.addEventListener("beforeunload", function () {
    stopEverything();
  });

  if (toTopButton) {
    toTopButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", updateScrollUi, { passive: true });
  window.addEventListener("resize", updateScrollUi);
  updateScrollUi();
})();

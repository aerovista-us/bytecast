/**
 * The Art Localized — Training shared runtime.
 * Expects: body[data-bc-ep="0|1|2|3|4"][data-bc-slug="art_localized_epN"]
 * Listen controls: #btnReadAloud, #btnPauseReadAloud, #btnStopReadAloud, #btnListenDone, #readStatus, #readScript
 * Slide controls: #slides .slide, #btnSlidePrev, #btnSlideNext, #slideTitle
 * Engage form: #engageForm with inputs carrying data-correct="true" on the right answer
 * Proof mission: #missionForm with required inputs/textareas carrying data-proof-field
 * Ep4 only: #finalForm with radio inputs carrying data-correct="true" on correct answers
 */
(() => {
  const Loop = window.ByteCastLoop;
  const synth = window.speechSynthesis || null;
  const JID = "art_localized_training";
  const LISTEN_GATE_MS = 12000;

  const epNum = Math.max(0, Math.min(4, parseInt(document.body?.dataset?.bcEp || "0", 10) || 0));
  const prefix = `ep${epNum}`;
  const slug = String(document.body?.dataset?.bcSlug || "").trim() || `art_localized_ep${epNum}`;
  const vb = 'viewBox="0 0 360 220" width="360" height="220" role="img"';
  const slideArt = {
    ep0: {
      s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Localized creativity signal">
        <circle cx="180" cy="110" r="62" fill="rgba(225,193,110,0.08)" stroke="#e1c16e" stroke-width="2">
          <animate attributeName="r" values="58;66;58" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="180" cy="110" r="34" fill="rgba(162,214,249,0.14)" stroke="#a2d6f9" stroke-width="1.5"/>
        ${[[92,70],[268,70],[110,162],[250,162]].map(([x,y],i)=>`<g><line x1="180" y1="110" x2="${x}" y2="${y}" stroke="rgba(162,214,249,0.35)" stroke-dasharray="4 5"><animate attributeName="stroke-opacity" values="0.25;0.65;0.25" dur="${2.1+i*0.2}s" repeatCount="indefinite"/></line><circle cx="${x}" cy="${y}" r="10" fill="rgba(162,214,249,0.2)" stroke="#a2d6f9"/></g>`).join("")}
        <text x="180" y="114" text-anchor="middle" fill="rgba(245,241,233,0.95)" font-size="11" font-weight="700">LOCAL</text>
      </svg>`,
      s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Shared context and handoff">
        <rect x="32" y="70" width="82" height="82" rx="14" fill="rgba(225,193,110,0.1)" stroke="#e1c16e"/>
        <rect x="139" y="46" width="82" height="82" rx="14" fill="rgba(162,214,249,0.1)" stroke="#a2d6f9"/>
        <rect x="246" y="70" width="82" height="82" rx="14" fill="rgba(122,230,199,0.1)" stroke="#7ae6c7"/>
        <path d="M114 111 H139" stroke="#a2d6f9" stroke-width="2.5" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" from="0" to="22" dur="1.8s" repeatCount="indefinite"/></path>
        <path d="M221 111 H246" stroke="#7ae6c7" stroke-width="2.5" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" from="0" to="22" dur="1.8s" repeatCount="indefinite"/></path>
        <text x="73" y="116" text-anchor="middle" fill="#f5f1e9" font-size="10" font-weight="700">INPUT</text>
        <text x="180" y="92" text-anchor="middle" fill="#f5f1e9" font-size="10" font-weight="700">OWNER</text>
        <text x="287" y="116" text-anchor="middle" fill="#f5f1e9" font-size="10" font-weight="700">PROOF</text>
      </svg>`,
      s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Narrative sound and visual system">
        <path d="M24 126 Q62 64 100 126 T176 126 T252 126 T328 126" fill="none" stroke="#a2d6f9" stroke-width="3">
          <animate attributeName="d" values="M24 126 Q62 64 100 126 T176 126 T252 126 T328 126;M24 126 Q62 170 100 126 T176 126 T252 126 T328 126;M24 126 Q62 64 100 126 T176 126 T252 126 T328 126" dur="3.4s" repeatCount="indefinite"/>
        </path>
        <rect x="62" y="58" width="68" height="42" rx="10" fill="rgba(225,193,110,0.12)" stroke="#e1c16e"/>
        <rect x="146" y="42" width="68" height="42" rx="10" fill="rgba(162,214,249,0.12)" stroke="#a2d6f9"/>
        <rect x="230" y="58" width="68" height="42" rx="10" fill="rgba(122,230,199,0.12)" stroke="#7ae6c7"/>
      </svg>`,
      s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Handoff checklist">
        ${[0,1,2].map((i)=>`<g transform="translate(68,${54+i*44})"><circle cx="14" cy="14" r="12" fill="none" stroke="#7ae6c7" stroke-width="2"><animate attributeName="stroke-opacity" values="0.45;1;0.45" dur="${1.8+i*0.2}s" repeatCount="indefinite"/></circle><path d="M8 14 L12 18 L20 9" fill="none" stroke="#7ae6c7" stroke-width="2" stroke-linecap="round"/><rect x="38" y="2" width="${140-i*20}" height="24" rx="8" fill="rgba(162,214,249,0.08)" stroke="rgba(162,214,249,0.35)"/></g>`).join("")}
        <text x="180" y="202" text-anchor="middle" fill="rgba(245,241,233,0.55)" font-size="9">Weeks 1-4 move in sequence</text>
      </svg>`,
    },
    ep1: {
      s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Lead and support divisions">
        <circle cx="180" cy="110" r="30" fill="rgba(143,128,255,0.18)" stroke="#8f80ff" stroke-width="2"/>
        <text x="180" y="114" text-anchor="middle" fill="#f8f7ff" font-size="10" font-weight="700">LUMINA</text>
        ${[[86,70,'ECHO'],[274,70,'VESPERA'],[180,172,'SKYFORGE']].map(([x,y,t],i)=>`<g><line x1="180" y1="110" x2="${x}" y2="${y}" stroke="rgba(121,215,255,0.38)" stroke-dasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="18" dur="${2+i*0.2}s" repeatCount="indefinite"/></line><circle cx="${x}" cy="${y}" r="18" fill="rgba(121,215,255,0.14)" stroke="#79d7ff"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#f8f7ff" font-size="8" font-weight="700">${t}</text></g>`).join("")}
      </svg>`,
      s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Onboarding pipeline">
        <line x1="180" y1="40" x2="180" y2="182" stroke="rgba(121,215,255,0.35)" stroke-width="3" stroke-linecap="round"/>
        ${[['JOIN',48],['VERIFY',92],['WELCOME',136],['PARTNER',180]].map(([t,y],i)=>`<g><circle cx="180" cy="${y}" r="14" fill="rgba(143,128,255,0.16)" stroke="#8f80ff"><animate attributeName="r" values="12;16;12" dur="${2+i*0.2}s" repeatCount="indefinite"/></circle><text x="180" y="${y+4}" text-anchor="middle" fill="#f8f7ff" font-size="7" font-weight="700">${t}</text></g>`).join("")}
      </svg>`,
      s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Spotlight content engine">
        <rect x="42" y="58" width="84" height="104" rx="12" fill="rgba(121,215,255,0.1)" stroke="#79d7ff"/>
        <polygon points="78,96 78,124 102,110" fill="#79d7ff"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite"/></polygon>
        <rect x="138" y="46" width="84" height="116" rx="12" fill="rgba(143,128,255,0.1)" stroke="#8f80ff"/>
        <line x1="154" y1="78" x2="206" y2="78" stroke="rgba(248,247,255,0.35)" stroke-width="3"/>
        <line x1="154" y1="98" x2="206" y2="98" stroke="rgba(248,247,255,0.25)" stroke-width="3"/>
        <line x1="154" y1="118" x2="194" y2="118" stroke="rgba(248,247,255,0.25)" stroke-width="3"/>
        <rect x="234" y="58" width="84" height="104" rx="12" fill="rgba(142,240,191,0.08)" stroke="#8ef0bf"/>
        <path d="M248 116 Q268 72 288 116 T328 116" fill="none" stroke="#8ef0bf" stroke-width="3"><animate attributeName="d" values="M248 116 Q268 72 288 116 T328 116;M248 116 Q268 156 288 116 T328 116;M248 116 Q268 72 288 116 T328 116" dur="2.8s" repeatCount="indefinite"/></path>
      </svg>`,
      s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Growth metrics and regions">
        ${[[62,150,70],[142,130,90],[222,108,112],[302,86,136]].map(([x,y,h],i)=>`<g><rect x="${x-18}" y="${y}" width="36" height="${h}" rx="8" fill="rgba(143,128,255,0.14)" stroke="#8f80ff"><animate attributeName="opacity" values="0.5;1;0.5" dur="${2+i*0.2}s" repeatCount="indefinite"/></rect><circle cx="${x}" cy="${y-14}" r="8" fill="rgba(121,215,255,0.18)" stroke="#79d7ff"/></g>`).join("")}
        <path d="M62 144 C112 112 168 96 302 74" fill="none" stroke="#79d7ff" stroke-width="3" stroke-dasharray="7 6"><animate attributeName="stroke-dashoffset" from="0" to="26" dur="2.4s" repeatCount="indefinite"/></path>
      </svg>`,
    },
    ep2: {
      s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Partnership tiers">
        ${[['COMMUNITY',70],['CULTURAL',180],['ALLY',290]].map(([t,x],i)=>`<g><rect x="${x-42}" y="${74-i*10}" width="84" height="${88+i*10}" rx="14" fill="rgba(255,157,87,0.12)" stroke="#ff9d57"/><text x="${x}" y="118" text-anchor="middle" fill="#fff4ee" font-size="9" font-weight="700">${t}</text></g>`).join("")}
        <path d="M70 176 H290" stroke="rgba(255,210,157,0.35)" stroke-width="2"/>
      </svg>`,
      s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Partnership opportunities">
        <circle cx="180" cy="110" r="24" fill="rgba(255,157,87,0.18)" stroke="#ff9d57"/>
        <text x="180" y="114" text-anchor="middle" fill="#fff4ee" font-size="9" font-weight="700">OFFER</text>
        ${[[78,74,'EVENT'],[282,74,'SPONSOR'],[180,176,'RESIDENCY']].map(([x,y,t],i)=>`<g><line x1="180" y1="110" x2="${x}" y2="${y}" stroke="rgba(255,210,157,0.35)" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="18" dur="${2+i*0.2}s" repeatCount="indefinite"/></line><rect x="${x-34}" y="${y-18}" width="68" height="36" rx="10" fill="rgba(255,210,157,0.08)" stroke="#ffd29d"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="#fff4ee" font-size="8" font-weight="700">${t}</text></g>`).join("")}
      </svg>`,
      s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Division collaboration map">
        <circle cx="180" cy="110" r="28" fill="rgba(255,157,87,0.15)" stroke="#ff9d57"/>
        ${[[90,58],[180,40],[270,58],[90,162],[180,180],[270,162]].map(([x,y],i)=>`<g><line x1="180" y1="110" x2="${x}" y2="${y}" stroke="rgba(255,210,157,0.28)" stroke-dasharray="5 5"><animate attributeName="stroke-opacity" values="0.25;0.7;0.25" dur="${1.8+i*0.15}s" repeatCount="indefinite"/></line><circle cx="${x}" cy="${y}" r="14" fill="rgba(255,210,157,0.12)" stroke="#ffd29d"/></g>`).join("")}
      </svg>`,
      s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Proof stack">
        ${[0,1,2].map((i)=>`<g transform="translate(${110+i*14},${58+i*14})"><rect width="120" height="84" rx="10" fill="rgba(255,244,238,0.03)" stroke="${i===2?'#ff9d57':'rgba(255,210,157,0.28)'}"/><line x1="18" y1="26" x2="88" y2="26" stroke="rgba(255,244,238,0.28)" stroke-width="3"/><line x1="18" y1="46" x2="98" y2="46" stroke="rgba(255,244,238,0.18)" stroke-width="3"/></g>`).join("")}
        <circle cx="260" cy="72" r="9" fill="rgba(255,157,87,0.18)" stroke="#ff9d57"><animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite"/></circle>
      </svg>`,
    },
    ep3: {
      s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Launch video signal">
        <rect x="56" y="48" width="248" height="124" rx="18" fill="rgba(66,191,255,0.08)" stroke="#42bfff"/>
        <circle cx="180" cy="110" r="30" fill="rgba(66,191,255,0.15)" stroke="#42bfff"/>
        <polygon points="170,94 170,126 198,110" fill="#7ae8ff"><animate attributeName="opacity" values="0.45;1;0.45" dur="1.6s" repeatCount="indefinite"/></polygon>
        ${[0,1,2].map((i)=>`<circle cx="180" cy="110" r="${48+i*18}" fill="none" stroke="rgba(122,232,255,0.18)" stroke-width="1.5"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="${2+i*0.25}s" repeatCount="indefinite"/></circle>`).join("")}
      </svg>`,
      s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Ambassador network">
        ${[[74,86],[126,52],[236,52],[286,96],[118,166],[244,166]].map(([x,y],i)=>`<g><line x1="180" y1="110" x2="${x}" y2="${y}" stroke="rgba(122,232,255,0.28)" stroke-dasharray="4 5"><animate attributeName="stroke-dashoffset" from="0" to="18" dur="${2+i*0.15}s" repeatCount="indefinite"/></line><circle cx="${x}" cy="${y}" r="14" fill="rgba(66,191,255,0.16)" stroke="#42bfff"/></g>`).join("")}
        <circle cx="180" cy="110" r="24" fill="rgba(156,241,167,0.15)" stroke="#9cf1a7"/>
      </svg>`,
      s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Microsite surface">
        <rect x="42" y="34" width="276" height="152" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(122,232,255,0.35)"/>
        <rect x="60" y="52" width="240" height="34" rx="10" fill="rgba(66,191,255,0.1)" stroke="#42bfff"/>
        <rect x="60" y="98" width="110" height="70" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(122,232,255,0.28)"/>
        <rect x="184" y="98" width="116" height="24" rx="8" fill="rgba(156,241,167,0.08)" stroke="#9cf1a7"><animate attributeName="opacity" values="0.45;1;0.45" dur="1.9s" repeatCount="indefinite"/></rect>
        <rect x="184" y="132" width="116" height="36" rx="8" fill="rgba(66,191,255,0.08)" stroke="rgba(122,232,255,0.3)"/>
      </svg>`,
      s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Education and impact loop">
        <path d="M72 150 C110 78 250 78 288 150" fill="none" stroke="#9cf1a7" stroke-width="3"/>
        <rect x="86" y="62" width="74" height="60" rx="12" fill="rgba(66,191,255,0.08)" stroke="#42bfff"/>
        <rect x="200" y="62" width="74" height="60" rx="12" fill="rgba(156,241,167,0.08)" stroke="#9cf1a7"/>
        <rect x="144" y="142" width="72" height="42" rx="12" fill="rgba(122,232,255,0.08)" stroke="#7ae8ff"/>
        <circle cx="180" cy="162" r="8" fill="rgba(156,241,167,0.18)" stroke="#9cf1a7"><animate attributeName="r" values="6;10;6" dur="1.7s" repeatCount="indefinite"/></circle>
      </svg>`,
    },
    ep4: {
      s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Vision to value">
        ${[[82,150,42],[148,128,64],[214,102,90],[280,72,120]].map(([x,y,h],i)=>`<g><rect x="${x-18}" y="${y}" width="36" height="${h}" rx="8" fill="rgba(242,195,96,0.12)" stroke="#f2c360"/><circle cx="${x}" cy="${y-16}" r="8" fill="rgba(255,220,160,0.18)" stroke="#ffdca0"><animate attributeName="cy" values="${y-16};${y-22};${y-16}" dur="${2+i*0.2}s" repeatCount="indefinite"/></circle></g>`).join("")}
        <path d="M82 144 C132 118 180 104 280 66" fill="none" stroke="#ffdca0" stroke-width="3" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="2.4s" repeatCount="indefinite"/></path>
      </svg>`,
      s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Marketplace mechanics">
        <rect x="58" y="48" width="244" height="126" rx="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,220,160,0.32)"/>
        <rect x="78" y="68" width="104" height="86" rx="12" fill="rgba(242,195,96,0.1)" stroke="#f2c360"/>
        <rect x="196" y="68" width="84" height="18" rx="6" fill="rgba(255,220,160,0.1)" stroke="#ffdca0"/>
        <rect x="196" y="96" width="84" height="18" rx="6" fill="rgba(255,220,160,0.06)" stroke="rgba(255,220,160,0.24)"/>
        <rect x="196" y="124" width="84" height="18" rx="6" fill="rgba(153,239,176,0.08)" stroke="#99efb0"><animate attributeName="opacity" values="0.45;1;0.45" dur="1.8s" repeatCount="indefinite"/></rect>
      </svg>`,
      s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Division pathway map">
        <circle cx="180" cy="110" r="26" fill="rgba(242,195,96,0.16)" stroke="#f2c360"/>
        <text x="180" y="114" text-anchor="middle" fill="#fcf4e1" font-size="8" font-weight="700">VALUE</text>
        ${[[82,58],[180,40],[278,58],[82,162],[180,180],[278,162]].map(([x,y],i)=>`<g><line x1="180" y1="110" x2="${x}" y2="${y}" stroke="rgba(255,220,160,0.28)" stroke-dasharray="4 5"><animate attributeName="stroke-opacity" values="0.25;0.75;0.25" dur="${1.9+i*0.15}s" repeatCount="indefinite"/></line><circle cx="${x}" cy="${y}" r="14" fill="rgba(255,220,160,0.08)" stroke="#ffdca0"/></g>`).join("")}
      </svg>`,
      s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Operator checklist">
        ${[0,1,2].map((i)=>`<g transform="translate(70,${62+i*44})"><rect width="220" height="28" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,220,160,0.22)"/><circle cx="22" cy="14" r="9" fill="rgba(153,239,176,0.14)" stroke="#99efb0"><animate attributeName="r" values="7;10;7" dur="${1.8+i*0.2}s" repeatCount="indefinite"/></circle><path d="M18 14 L21 17 L27 10" fill="none" stroke="#99efb0" stroke-width="2" stroke-linecap="round"/></g>`).join("")}
        <path d="M180 38 V52" stroke="#f2c360" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    },
  };

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

  let listenMarked = false;
  let listenTimer = 0;
  let listenStartedAt = 0;
  let listenRemainingMs = LISTEN_GATE_MS;

  function setReadStatus(message) {
    const el = document.getElementById("readStatus");
    if (el) el.textContent = message;
  }

  function renderSlideArt() {
    const artSet = slideArt[prefix];
    if (!artSet) return;
    document.querySelectorAll(".slide-visual[data-slide-art]").forEach((el) => {
      const key = el.dataset.slideArt;
      el.innerHTML = artSet[key] || "";
    });
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      document.querySelectorAll(".bc-art animate, .bc-art animateTransform").forEach((node) => node.remove());
    }
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

  const pauseButton = document.getElementById("btnPauseReadAloud");

  function syncPauseLabel() {
    if (!pauseButton) return;
    pauseButton.textContent = synth?.paused ? "Resume" : "Pause";
  }

  function getTranscriptText() {
    return Array.from(document.querySelectorAll("#readScript p"))
      .map((node) => node.textContent?.trim() || "")
      .filter(Boolean)
      .join("\n\n");
  }

  // Rank voices to prefer high-quality English voices when the browser exposes them.
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
    const voices = synth.getVoices().slice().sort((a, b) => scoreVoice(b) - scoreVoice(a));
    return voices[0] || null;
  }

  function stopReadAloud(message) {
    pauseListenTimer();
    if (synth?.speaking || synth?.paused) synth.cancel();
    syncPauseLabel();
    if (message) setReadStatus(message);
  }

  function startReadAloud() {
    const transcript = getTranscriptText();
    if (!transcript) {
      setReadStatus("No read-aloud script was found on this page.");
      return;
    }
    if (!synth) {
      setReadStatus("This browser does not expose Speech Synthesis. Use the manual listen button.");
      return;
    }

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
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      startListenTimer();
      syncPauseLabel();
      setReadStatus(
        voice
          ? `Reading aloud with ${voice.name}. Listen completes after about 12 seconds of active playback.`
          : "Reading aloud with the browser default voice."
      );
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
  }

  document.getElementById("btnReadAloud")?.addEventListener("click", () => startReadAloud());

  pauseButton?.addEventListener("click", () => {
    if (!synth || (!synth.speaking && !synth.paused)) return;
    if (synth.paused) {
      synth.resume();
      startListenTimer();
      syncPauseLabel();
      setReadStatus("Read-aloud resumed.");
      return;
    }
    synth.pause();
    pauseListenTimer();
    syncPauseLabel();
    setReadStatus("Read-aloud paused.");
  });

  document.getElementById("btnStopReadAloud")?.addEventListener("click", () => {
    stopReadAloud("Read-aloud stopped. Restart it or use the manual listen button.");
  });

  document.getElementById("btnListenDone")?.addEventListener("click", () => {
    markListen();
    setReadStatus("Listen marked complete manually. Progress saved for this browser.");
  });

  syncPauseLabel();

  const slides = Array.from(document.querySelectorAll("#slides .slide"));
  let slideIdx = 0;
  let slideMarked = false;

  function markSlideGate() {
    if (slideMarked) return;
    slideMarked = true;
    markStep(`${prefix}_slide`, { gate: "slide" });
  }

  function syncSlides() {
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === slideIdx));
    const titleEl = document.getElementById("slideTitle");
    if (titleEl && slides[slideIdx]) {
      titleEl.textContent = slides[slideIdx].dataset.title || `Slide ${slideIdx + 1}`;
    }
    if (slides.length && slideIdx === slides.length - 1) markSlideGate();
  }

  function goSlide(delta) {
    if (!slides.length) return;
    slideIdx = (slideIdx + delta + slides.length) % slides.length;
    syncSlides();
  }

  document.getElementById("btnSlidePrev")?.addEventListener("click", () => goSlide(-1));
  document.getElementById("btnSlideNext")?.addEventListener("click", () => goSlide(1));
  renderSlideArt();
  syncSlides();

  const engageForm = document.getElementById("engageForm");
  engageForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = engageForm.querySelector('input[name="engage"]:checked');
    const correct = selected?.dataset?.correct === "true";
    const hint = document.getElementById("engageHint");
    if (!correct) {
      if (hint) hint.textContent = "Not quite. Pick the answer that matches the operating model, then try again.";
      return;
    }
    markStep(`${prefix}_engage`, {
      gate: "engage",
      engageQuizPassed: true,
      engageQuizScore: 1,
    });
    if (hint) hint.textContent = "Engage complete. Progress saved for this browser.";
  });

  const missionForm = document.getElementById("missionForm");
  missionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Array.from(missionForm.querySelectorAll("[data-proof-field]"));
    const proof = {};
    let firstMissing = null;
    fields.forEach((field) => {
      const key = field.dataset.proofField;
      const value = String(field.value || "").trim();
      if (!value && !firstMissing) firstMissing = field;
      if (key) proof[key] = value;
    });

    const hint = document.getElementById("missionHint");
    if (firstMissing) {
      firstMissing.focus();
      if (hint) hint.textContent = "Fill every proof field before recording this mission.";
      return;
    }

    markStep(`${prefix}_mission`, {
      gate: "proof_mission",
      mission: `art_localized_ep${epNum}_proof`,
      proofFieldsComplete: true,
      proofRecordedAt: new Date().toISOString(),
      ...proof,
    });
    if (hint) hint.textContent = "Proof mission recorded. Progress saved for this browser.";
  });

  if (epNum === 4) {
    const finalForm = document.getElementById("finalForm");
    finalForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const names = Array.from(new Set(Array.from(finalForm.querySelectorAll('input[type="radio"]')).map((input) => input.name)));
      const passed = names.every((name) => finalForm.querySelector(`input[name="${name}"]:checked`)?.dataset?.correct === "true");
      const hint = document.getElementById("finalHint");
      if (!passed) {
        if (hint) hint.textContent = "Passing requires every final check to be correct.";
        return;
      }
      markStep("final_assessment", {
        mission: "art_localized_final",
        understandingCheckPassed: true,
        finalAssessmentPassed: true,
        finalAssessmentAt: new Date().toISOString(),
      });
      if (hint) hint.textContent = "Final assessment recorded. Progress saved for this browser.";
    });
  }
})();

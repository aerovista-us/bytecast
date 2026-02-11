(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Insight cards
  qsa(".card[data-insight]").forEach(card => {
    card.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(isOpen));
      const reveal = qs(".card__reveal", card);
      if (reveal) reveal.setAttribute("aria-hidden", String(!isOpen));
    });
  });

  // Path progression
  const nodes = qsa(".path__node");
  const meterBar = qs("#meterBar");
  const meterText = qs("#meterText");

  const setProgress = () => {
    const done = nodes.filter(n => n.classList.contains("is-done")).length;
    const total = nodes.length || 1;
    const pct = Math.round((done / total) * 100);
    if (meterBar) meterBar.style.width = `${pct}%`;
    if (meterText) meterText.textContent = `${pct}% complete`;
  };

  const unlockStep = (step) => {
    const next = nodes.find(n => Number(n.dataset.step) === step);
    if (!next) return;
    next.classList.add("is-active");
    const btn = qs(".node__btn", next);
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Mark complete";
    }
  };

  nodes.forEach(node => {
    const btn = qs(".node__btn", node);
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      node.classList.remove("is-active");
      node.classList.add("is-done");
      btn.disabled = true;
      btn.textContent = "Done";
      const step = Number(node.dataset.step);
      unlockStep(step + 1);
      setProgress();
    });
  });

  setProgress();

  // Ambient toggle
  const ambientBtn = qs("#ambientBtn");
  if (ambientBtn) {
    ambientBtn.addEventListener("click", () => {
      const on = document.body.classList.toggle("is-ambient");
      ambientBtn.setAttribute("aria-pressed", String(on));
    });
  }

  // Optional quiz gate
  const quiz = qs("#quiz");
  if (quiz) {
    const btn = qs("#quizBtn");
    const input = qs("#quizInput");
    const status = qs("#quizStatus");
    const passPct = Number(quiz.dataset.passpct || "80");

    const update = (msg, ok) => {
      if (!status) return;
      status.textContent = msg;
      status.style.color = ok ? "rgba(255,216,138,.95)" : "rgba(233,239,231,.70)";
    };

    const score = (text) => {
      const parts = String(text || "").split(",").map(s => s.trim()).filter(Boolean);
      const pct = Math.min(100, Math.round((parts.length / 5) * 100));
      return pct;
    };

    const KEY = "seed_quiz_passed";
    const passed = localStorage.getItem(KEY) === "1";
    if (passed) update("Badge earned ✔ (stored locally)", true);

    if (btn && input) {
      btn.addEventListener("click", () => {
        const pct = score(input.value || "");
        const ok = pct >= passPct;
        if (ok) {
          localStorage.setItem(KEY, "1");
          update(`Badge earned ✔ (${pct}%)`, true);
        } else {
          update(`Not quite (${pct}%). Add more specifics and try again.`, false);
        }
      });
    }
  }

  // Optional PWA install + SW
  let deferredPrompt = null;
  const installBtn = qs("#installBtn");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();

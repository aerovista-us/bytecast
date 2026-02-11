/* My Title
   Seed Bundle JS:
   - Insight reveal toggles
   - Sequential path progression
   - Ambient toggle
   - Optional PWA install prompt + SW registration
*/

(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

// --- Seed Option: Analytics (Umami) ---
// Enable by setting window.__UMAMI__.enabled = true.
// Safe defaults: disabled on file:// and domain-guarded.
const __umamiCfg = (window.__UMAMI__ ||= {
  enabled: true,
  url: "https://stats.aerocoreos.com",
  websiteId: "5f012bc0-4545-474a-a689-19c01818fadc",
  domains: ["aerovista-us.github.io"],
  disableOnFileProtocol: true,
});

(function initUmami() {
  try {
    if (!__umamiCfg?.enabled) return;

    const params = new URLSearchParams(location.search);
    if (params.has("no_analytics")) return;

    if (__umamiCfg.disableOnFileProtocol && location.protocol === "file:") return;

    if (Array.isArray(__umamiCfg.domains) && __umamiCfg.domains.length) {
      const host = location.hostname || "";
      const ok = __umamiCfg.domains.some(d => d === host || (d.startsWith(".") && host.endsWith(d)));
      if (!ok) return;
    }

    const s = document.createElement("script");
    s.defer = true;
    s.src = String(__umamiCfg.url || "").replace(/\/$/, "") + "/script.js";
    s.setAttribute("data-website-id", String(__umamiCfg.websiteId || ""));
    document.head.appendChild(s);
  } catch (_) {
    // never block the experience if analytics fails
  }
})();

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
    const total = nodes.length;
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

  // Optional PWA bits (install prompt + SW)
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

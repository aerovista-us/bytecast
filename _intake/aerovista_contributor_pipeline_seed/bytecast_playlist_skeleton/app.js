(async function(){
  const cardsEl = document.getElementById("cards");
  const overlayEl = document.getElementById("overlay");
  const frameEl = document.getElementById("frame");
  const overlayTitleEl = document.getElementById("overlayTitle");
  const btnClose = document.getElementById("btnClose");
  const btnOpenNew = document.getElementById("btnOpenNew");

  // Load Umami (optional)
  (function loadUmami(){
    try{
      const cfg = window.__UMAMI__;
      if(!cfg || !cfg.enabled) return;
      const s = document.createElement("script");
      s.defer = true;
      // default Umami tracker path is often /script.js, but deployments vary.
      // Replace if your setup differs.
      s.src = cfg.host.replace(/\/$/, "") + "/script.js";
      s.setAttribute("data-website-id", cfg.websiteId);
      document.head.appendChild(s);
    }catch(e){}
  })();

  function track(event, props){
    if (window.__UMAMI__ && window.__UMAMI__.enabled && typeof window.umami === "function"){
      try { window.umami(event, props || {}); } catch(e) {}
    }
  }

  async function loadRegistry(){
    const res = await fetch("./registry.json", { cache: "no-store" });
    return await res.json();
  }

  function openOverlay(mod){
    overlayTitleEl.textContent = `${mod.type.toUpperCase()}: ${mod.title}`;
    overlayEl.setAttribute("aria-hidden","false");
    frameEl.src = mod.entry;
    btnOpenNew.onclick = () => window.open(mod.entry, "_blank", "noopener,noreferrer");
    track("module_open_overlay", { id: mod.id, type: mod.type, title: mod.title });
  }

  function closeOverlay(){
    overlayEl.setAttribute("aria-hidden","true");
    frameEl.src = "about:blank";
    track("module_close_overlay", {});
  }

  btnClose.addEventListener("click", closeOverlay);

  // Receive child progress events (if children use shared/umami_bridge.js)
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || (d.type !== "PROGRESS" && d.type !== "RESULT" && d.type !== "COMPLETE" && d.type !== "ERROR")) return;
    if (d.type === "PROGRESS") track(d.event, d.props || {});
    if (d.type === "RESULT") track("seed_result", d.artifact || {});
    if (d.type === "COMPLETE") track("module_complete", d.props || {});
    if (d.type === "ERROR") track("module_error", { message: d.message || "unknown" });
  });

  const reg = await loadRegistry();
  const mods = reg.modules || [];

  cardsEl.innerHTML = "";
  for (const mod of mods){
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${mod.title}</h3>
      <p>${mod.description || ""}</p>
      <div class="row">
        <a class="btn" href="${mod.entry}" target="_blank" rel="noopener noreferrer">Open</a>
        <button type="button">Overlay</button>
      </div>
    `;
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => openOverlay(mod));
    cardsEl.appendChild(card);
  }

  track("command_center_loaded", { modules: mods.length });
})();

/**
 * AeroVista Umami + postMessage bridge (v1)
 * - If embedded (iframe), prefer postMessage to parent (parent logs analytics).
 * - If standalone, optionally log to Umami if enabled.
 */

(function(){
  const isEmbedded = window.self !== window.top;

  function umamiEnabled(){
    return !!(window.__UMAMI__ && window.__UMAMI__.enabled);
  }

  function postToParent(payload){
    try { window.parent.postMessage(payload, "*"); } catch(e) {}
  }

  function emit(event, props){
    const ts = new Date().toISOString();
    const payload = { type: "PROGRESS", requestId: window.__AV_REQ_ID || "local", event, props: props || {}, ts };

    if (isEmbedded){
      postToParent(payload);
      return;
    }

    // Standalone analytics (Umami)
    if (umamiEnabled() && typeof window.umami === "function"){
      try { window.umami(event, props || {}); } catch(e) {}
    }
  }

  // Listen for INIT from parent
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || d.type !== "INIT") return;
    window.__AV_REQ_ID = d.requestId || "embed";
    window.__AV_CFG = d.config || {};
    // Child can optionally adjust UI based on config (theme, gating, etc.)
    emit("module_init", { embedded: true });
  });

  window.AVBridge = { emit };
})();

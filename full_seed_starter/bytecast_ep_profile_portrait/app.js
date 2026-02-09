(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
  const fmt = (sec) => {
    if (!isFinite(sec)) return "0:00";
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec/60);
    const s = String(sec%60).padStart(2,"0");
    return `${m}:${s}`;
  };

  const state = { episode:null, tracks:[], slides:[], trackIndex:-1, audioEnabled:false, slideIndex:0 };

  const audio = qs("#audio");
  const playBtn = qs("#playBtn");
  const prevBtn = qs("#prevBtn");
  const nextBtn = qs("#nextBtn");
  const seek = qs("#seek");
  const timeText = qs("#timeText");
  const trackTitle = qs("#trackTitle");
  const trackHint = qs("#trackHint");
  const deck = qs("#deck");
  const enableAudioBtn = qs("#enableAudioBtn");
  const jumpDeckBtn = qs("#jumpDeckBtn");
  const themeBtn = qs("#themeBtn");
  const shareBtn = qs("#shareBtn");

  const drawer = qs("#drawer");
  const playlistBtn = qs("#playlistBtn");
  const closeDrawerBtn = qs("#closeDrawerBtn");
  const playlistEl = qs("#playlist");
  const drawerSub = qs("#drawerSub");
  const playSlideAudioBtn = qs("#playSlideAudioBtn");

  function setTheme(meta){
    const t = meta?.theme || {};
    const st = document.documentElement.style;
    if (t.bg0) st.setProperty("--bg0", t.bg0);
    if (t.bg1) st.setProperty("--bg1", t.bg1);
    if (t.ink) st.setProperty("--ink", t.ink);
    if (t.muted) st.setProperty("--muted", t.muted);
    if (t.accent) st.setProperty("--accent", t.accent);
    if (t.accent2) st.setProperty("--accent2", t.accent2);
    const themeColor = (t.bg1 || "#0b0f16");
    const metaTag = qs('meta[name="theme-color"]');
    if (metaTag) metaTag.setAttribute("content", themeColor);
  }

  function openDrawer(){ drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden","false"); }
  function closeDrawer(){ drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden","true"); }

  function updatePlayIcon(){
    const playing = !audio.paused && !audio.ended;
    playBtn.textContent = playing ? "❚❚" : "▶";
    playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function flashHint(msg){
    trackHint.textContent = msg;
    setTimeout(() => {
      const t = state.tracks[state.trackIndex];
      trackHint.textContent = state.audioEnabled ? (t?.duration_hint || "Ready") : "Tap enable audio";
    }, 1400);
  }

  function renderPlaylist(){
    playlistEl.innerHTML = "";
    state.tracks.forEach((t, i) => {
      const row = document.createElement("div");
      row.className = "item";
      row.innerHTML = `
        <div class="item__left">
          <div class="item__title"></div>
          <div class="item__meta"></div>
        </div>
        <div class="badge">${i === state.trackIndex ? "Now" : (t.duration_hint || "Track")}</div>
      `;
      row.querySelector(".item__title").textContent = t.title || `Track ${i+1}`;
      row.querySelector(".item__meta").textContent = t.src;
      row.addEventListener("click", () => { setTrack(i, {autoplay:true}); closeDrawer(); });
      playlistEl.appendChild(row);
    });
  }

  function setTrack(idx, {autoplay=false} = {}){
    if (!state.tracks.length) return;
    idx = Math.max(0, Math.min(state.tracks.length-1, idx));
    state.trackIndex = idx;
    const t = state.tracks[idx];
    audio.src = t.src;
    trackTitle.textContent = t.title || "Untitled";
    trackHint.textContent = state.audioEnabled ? (t.duration_hint || "Ready") : "Tap enable audio";
    renderPlaylist();
    if (autoplay && state.audioEnabled) audio.play().catch(()=>{});
    updatePlayIcon();
  }

  function playPause(){
    if (!state.audioEnabled) return flashHint("Tap “enable audio” first");
    if (audio.paused || audio.ended) audio.play().catch(()=>{});
    else audio.pause();
    updatePlayIcon();
  }

  function nextTrack(){
    if (!state.tracks.length) return;
    setTrack((state.trackIndex + 1) % state.tracks.length, {autoplay:true});
  }
  function prevTrack(){
    if (!state.tracks.length) return;
    setTrack((state.trackIndex - 1 + state.tracks.length) % state.tracks.length, {autoplay:true});
  }

  function playSlideAudio(slideIdx, autoplay=true){
    const slide = state.slides[slideIdx];
    if (!slide?.audio_id) return flashHint("No slide audio");
    const trackIdx = state.tracks.findIndex(t => t.id === slide.audio_id);
    if (trackIdx < 0) return flashHint("Audio not found");
    setTrack(trackIdx, {autoplay});
  }

  function renderSlides(){
    deck.innerHTML = "";
    state.slides.forEach((s, idx) => {
      const slide = document.createElement("article");
      slide.className = "slide";
      slide.setAttribute("data-slide", String(idx));

      const imgHtml = s.image ? `<img class="slide__img" src="${s.image}" alt="">` : "";
      const markers = Array.isArray(s.markers) ? s.markers : [];
      const markersHtml = markers.length ? `
        <div class="slide__markers" aria-label="Markers">
          ${markers.map(m => `<button class="marker" type="button" data-t="${m.t || 0}">${m.label || "Marker"}</button>`).join("")}
        </div>
      ` : "";

      const hasAudio = !!s.audio_id;
      const safeBody = String(s.body || "").replace(/</g,"&lt;");

      slide.innerHTML = `
        <div class="slide__media">${imgHtml}</div>
        <div class="slide__body">
          <div class="slide__kicker">${s.kicker || ""}</div>
          <div class="slide__title">${s.title || `Slide ${idx+1}`}</div>
          <div class="slide__text">${safeBody}</div>
          ${markersHtml}
          <div class="slide__actions">
            ${hasAudio ? `<button class="btn btn--primary" type="button" data-slide-play>Play slide audio</button>` : ""}
            <button class="btn btn--ghost" type="button" data-slide-copy>Copy slide text</button>
          </div>
        </div>
      `;

      qsa(".marker", slide).forEach(btn => {
        btn.addEventListener("click", () => {
          const t = Number(btn.getAttribute("data-t") || "0");
          if (!state.audioEnabled) return flashHint("Enable audio first");
          audio.currentTime = Math.max(0, t);
          audio.play().catch(()=>{});
        });
      });

      qs("[data-slide-play]", slide)?.addEventListener("click", () => playSlideAudio(idx, true));

      qs("[data-slide-copy]", slide)?.addEventListener("click", async () => {
        const text = `${s.title || ""}\n\n${s.body || ""}`.trim();
        try { await navigator.clipboard.writeText(text); flashHint("Slide copied"); }
        catch { flashHint("Copy blocked"); }
      });

      deck.appendChild(slide);
    });
  }

  function currentSlideIndex(){
    const slides = qsa(".slide", deck);
    if (!slides.length) return 0;
    const top = deck.scrollTop;
    let best = 0, bestDist = Infinity;
    slides.forEach((el, i) => {
      const dist = Math.abs(el.offsetTop - top);
      if (dist < bestDist){ bestDist = dist; best = i; }
    });
    return best;
  }

  function bind(){
    playBtn.addEventListener("click", playPause);
    prevBtn.addEventListener("click", prevTrack);
    nextBtn.addEventListener("click", nextTrack);

    audio.addEventListener("play", updatePlayIcon);
    audio.addEventListener("pause", updatePlayIcon);
    audio.addEventListener("ended", () => { updatePlayIcon(); nextTrack(); });

    audio.addEventListener("timeupdate", () => {
      const cur = audio.currentTime || 0;
      const dur = audio.duration || 0;
      qs("#timeText").textContent = `${fmt(cur)} / ${fmt(dur)}`;
      qs("#seek").value = dur > 0 ? String(Math.round((cur/dur)*100)) : "0";
    });

    seek.addEventListener("input", () => {
      if (!state.audioEnabled) return;
      const dur = audio.duration || 0;
      const pct = Number(seek.value || "0") / 100;
      audio.currentTime = dur * pct;
    });

    enableAudioBtn.addEventListener("click", () => {
      state.audioEnabled = true;
      flashHint("Audio enabled");
      const t = state.tracks[state.trackIndex];
      trackHint.textContent = t?.duration_hint || "Ready";
    });

    jumpDeckBtn.addEventListener("click", () => deck.scrollIntoView({behavior:"smooth", block:"start"}));

    themeBtn.addEventListener("click", () => {
      const on = document.body.classList.toggle("is-ambient");
      themeBtn.setAttribute("aria-pressed", String(on));
    });

    shareBtn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(location.href); flashHint("Link copied"); }
      catch { flashHint("Copy blocked"); }
    });

    playlistBtn.addEventListener("click", openDrawer);
    closeDrawerBtn.addEventListener("click", closeDrawer);
    playSlideAudioBtn.addEventListener("click", () => { playSlideAudio(state.slideIndex, true); closeDrawer(); });

    deck.addEventListener("scroll", () => { state.slideIndex = currentSlideIndex(); }, {passive:true});
  }

  async function load(){
    const res = await fetch("episode.json", {cache:"no-store"});
    if (!res.ok) throw new Error("Failed to load episode.json");
    const episode = await res.json();
    state.episode = episode;

    const meta = episode.meta || {};
    setTheme(meta);
    qs("#metaTitle").textContent = meta.brand || "ByteCast";
    qs("#metaSub").textContent = `${meta.subtitle || "Episode"}${meta.date ? " • " + meta.date : ""}`;
    qs("#metaH1").textContent = meta.title || "ByteCast Episode";
    qs("#metaDesc").textContent = meta.subtitle || "Episode Profile • Portrait Slides + Multi-Audio";

    const line = qs("#metaLine");
    line.innerHTML = "";
    const pills = [
      meta.date ? `Date: ${meta.date}` : null,
      `${(episode.slides||[]).length} slides`,
      `${(episode.audio||[]).length} tracks`,
      "Phone-first",
    ].filter(Boolean);
    pills.forEach(t => { const s=document.createElement("span"); s.className="pill"; s.textContent=t; line.appendChild(s); });

    state.tracks = Array.isArray(episode.audio) ? episode.audio : [];
    state.slides = Array.isArray(episode.slides) ? episode.slides : [];
    drawerSub.textContent = meta.title || "Episode";

    renderSlides();

    if (state.tracks.length) setTrack(0, {autoplay:false});
    else { trackTitle.textContent = "No tracks in episode.json"; trackHint.textContent = "Add files to assets/audio/"; renderPlaylist(); }
  }

  bind();
  load().catch(err => {
    console.error(err);
    qs("#metaH1").textContent = "Episode load error";
    qs("#metaDesc").textContent = String(err?.message || err);
  });
})();

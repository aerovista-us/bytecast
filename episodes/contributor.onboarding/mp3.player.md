here’s a clean ByteCast MP3 player you can drop into your onboarding HTML. It supports:

Play/Pause
Scrub bar
Time (current / duration)
Skip -10s / +30s
Speed (1.0x / 1.25x / 1.5x / 2.0x)
Load MP3 from URL or local file picker
Download link (when possible)

Below are 3 small patches: CSS, HTML, JS.

1) Add this CSS (paste near the bottom of your <style>)
/* ---------- ByteCast Player ---------- */
.playerCard{
  border:1px solid rgba(255,255,255,.12);
  border-radius:16px;
  background: rgba(11,14,24,.55);
  padding:14px;
  box-shadow: 0 12px 44px rgba(0,0,0,.40);
}
.playerTop{display:flex; align-items:flex-start; justify-content:space-between; gap:10px;}
.playerTitle{margin:0; font-size:14px; letter-spacing:.06em; text-transform:uppercase;}
.playerSub{margin:6px 0 0; color:var(--muted); font-size:12px; line-height:1.45;}
.playerRow{display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:12px;}
.playerBtn{
  border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.06);
  color:var(--text);
  padding:8px 10px;
  border-radius:14px;
  cursor:pointer;
  font-weight:700;
  font-size:12px;
}
.playerBtn:hover{background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.22)}
.playerBtn:active{transform:translateY(1px)}
.playerBtn.primary{
  background: linear-gradient(90deg, rgba(96,165,250,.26), rgba(167,139,250,.20), rgba(244,114,182,.14));
  box-shadow: var(--glow);
}

.playerMeta{
  display:flex; gap:10px; align-items:center;
  margin-top:10px; color:rgba(255,255,255,.78);
  font: 12px var(--mono);
}
.playerMeta span{opacity:.9}
.playerMeta .sep{opacity:.35}

.seekWrap{margin-top:10px;}
.seek{
  width:100%;
  appearance:none;
  height:10px;
  border-radius:999px;
  background:rgba(255,255,255,.08);
  border:1px solid rgba(255,255,255,.10);
  outline:none;
}
.seek::-webkit-slider-thumb{
  appearance:none;
  width:16px; height:16px;
  border-radius:999px;
  background:rgba(255,255,255,.90);
  border:2px solid rgba(96,165,250,.55);
  box-shadow: 0 0 0 3px rgba(96,165,250,.18);
  cursor:pointer;
}
.seek::-moz-range-thumb{
  width:16px; height:16px;
  border-radius:999px;
  background:rgba(255,255,255,.90);
  border:2px solid rgba(96,165,250,.55);
  cursor:pointer;
}

.smallInput{
  width:100%;
  padding:10px 10px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(0,0,0,.25);
  color: var(--text);
  outline:none;
}
.smallInput:focus{
  border-color: rgba(96,165,250,.55);
  box-shadow: 0 0 0 3px rgba(96,165,250,.22);
}
.playerCols{
  display:grid;
  grid-template-columns: 1fr;
  gap:10px;
  margin-top:10px;
}
.playerHint{color:var(--muted2); font-size:12px; line-height:1.45}
.playerAudio{display:none;}


2) Add this HTML (place it inside the hero section)
Best spot: inside the <aside class="sideCard"> under the poster block.
<div class="playerCard" aria-label="ByteCast audio player">
  <div class="playerTop">
    <div>
      <div class="miniTitle">ByteCast</div>
      <h3 class="playerTitle">Welcome to the Crew — Audio</h3>
      <p class="playerSub">Play the onboarding ByteCast right here. Use URL or load a local MP3.</p>
    </div>
    <span class="badge b" id="audioStatus">No audio loaded</span>
  </div>

  <!-- Hidden audio element (we control it with custom UI) -->
  <audio id="bytecastAudio" class="playerAudio" preload="metadata">
    <source id="bytecastSource" src="bytecast.mp3" type="audio/mpeg">
  </audio>

  <div class="playerRow">
    <button class="playerBtn primary" id="playPauseBtn" type="button">▶ Play</button>
    <button class="playerBtn" id="back10Btn" type="button">⟲ -10s</button>
    <button class="playerBtn" id="fwd30Btn" type="button">+30s ⟳</button>

    <select id="speedSel" class="smallInput" style="max-width:140px" aria-label="Playback speed">
      <option value="1">1.0x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="2">2.0x</option>
    </select>

    <a class="playerBtn" id="downloadBtn" href="bytecast.mp3" download>⬇ Download</a>
  </div>

  <div class="playerMeta">
    <span id="curTime">00:00</span>
    <span class="sep">/</span>
    <span id="durTime">00:00</span>
  </div>

  <div class="seekWrap">
    <input id="seek" class="seek" type="range" min="0" max="1000" value="0" aria-label="Seek bar">
  </div>

  <div class="playerCols">
    <div>
      <label for="audioUrl">MP3 URL (optional)</label>
      <input id="audioUrl" class="smallInput" placeholder="https://.../bytecast.mp3  (or leave blank)" />
      <div class="playerRow" style="margin-top:8px;">
        <button class="playerBtn" id="loadUrlBtn" type="button">🔗 Load URL</button>
        <button class="playerBtn" id="useDefaultBtn" type="button">↩ Use default (bytecast.mp3)</button>
      </div>
    </div>

    <div>
      <label for="audioFile">Load local MP3</label>
      <input id="audioFile" class="smallInput" type="file" accept="audio/mpeg,audio/mp3" />
      <p class="playerHint" style="margin:8px 0 0;">
        Tip: put <span class="kbd">bytecast.mp3</span> next to this HTML file for “just works” mode.
      </p>
    </div>
  </div>
</div>


3) Add this JS (paste near the bottom of your <script>, before // ---------- Init ----------)
// ---------- ByteCast Player ----------
(function(){
  const audio = document.getElementById("bytecastAudio");
  const source = document.getElementById("bytecastSource");
  const playBtn = document.getElementById("playPauseBtn");
  const back10 = document.getElementById("back10Btn");
  const fwd30 = document.getElementById("fwd30Btn");
  const speedSel = document.getElementById("speedSel");
  const seek = document.getElementById("seek");
  const curTime = document.getElementById("curTime");
  const durTime = document.getElementById("durTime");
  const status = document.getElementById("audioStatus");
  const audioUrl = document.getElementById("audioUrl");
  const loadUrlBtn = document.getElementById("loadUrlBtn");
  const useDefaultBtn = document.getElementById("useDefaultBtn");
  const audioFile = document.getElementById("audioFile");
  const downloadBtn = document.getElementById("downloadBtn");

  if(!audio || !source) return;

  function fmt(t){
    if(!isFinite(t) || t < 0) return "00:00";
    const m = Math.floor(t/60);
    const s = Math.floor(t%60);
    return String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
  }

  function setStatus(text, kind="b"){
    status.textContent = text;
    status.className = "badge " + (kind || "b");
  }

  function setSrc(url, downloadable=true){
    try { audio.pause(); } catch(e){}
    audio.currentTime = 0;
    source.src = url;
    audio.load();

    // download link
    downloadBtn.href = url;
    downloadBtn.style.display = downloadable ? "inline-flex" : "none";

    // update status
    setStatus("Loading…", "warn");
  }

  function updateSeek(){
    if(!isFinite(audio.duration) || audio.duration <= 0) return;
    const v = Math.round((audio.currentTime / audio.duration) * 1000);
    seek.value = String(Math.max(0, Math.min(1000, v)));
    curTime.textContent = fmt(audio.currentTime);
    durTime.textContent = fmt(audio.duration);
  }

  function setPlayLabel(){
    playBtn.textContent = audio.paused ? "▶ Play" : "⏸ Pause";
  }

  // Events
  playBtn.addEventListener("click", async ()=>{
    try{
      if(audio.paused){
        await audio.play();
        setStatus("Playing", "good");
      } else {
        audio.pause();
        setStatus("Paused", "b");
      }
      setPlayLabel();
    }catch(e){
      setStatus("Cannot play (check file/URL)", "bad");
      toast("Audio play failed. Verify the MP3 path or URL.", "warn");
    }
  });

  back10.addEventListener("click", ()=>{
    audio.currentTime = Math.max(0, (audio.currentTime || 0) - 10);
    updateSeek();
  });

  fwd30.addEventListener("click", ()=>{
    const d = audio.duration || 0;
    audio.currentTime = Math.min(d ? d : (audio.currentTime + 30), (audio.currentTime || 0) + 30);
    updateSeek();
  });

  speedSel.addEventListener("change", ()=>{
    audio.playbackRate = parseFloat(speedSel.value || "1") || 1;
    toast(`Speed set to ${audio.playbackRate}x`, "good");
  });

  seek.addEventListener("input", ()=>{
    if(!isFinite(audio.duration) || audio.duration <= 0) return;
    const pct = (parseInt(seek.value,10) || 0) / 1000;
    audio.currentTime = pct * audio.duration;
    updateSeek();
  });

  audio.addEventListener("timeupdate", updateSeek);
  audio.addEventListener("loadedmetadata", ()=>{
    durTime.textContent = fmt(audio.duration);
    curTime.textContent = fmt(0);
    seek.value = "0";
    setStatus("Ready", "good");
    setPlayLabel();
  });
  audio.addEventListener("pause", ()=>{
    setPlayLabel();
    if(audio.currentTime > 0) setStatus("Paused", "b");
  });
  audio.addEventListener("play", ()=>{
    setPlayLabel();
    setStatus("Playing", "good");
  });
  audio.addEventListener("ended", ()=>{
    setPlayLabel();
    setStatus("Finished", "good");
  });
  audio.addEventListener("error", ()=>{
    setPlayLabel();
    setStatus("Audio not found", "bad");
  });

  // Load from URL
  loadUrlBtn.addEventListener("click", ()=>{
    const url = (audioUrl.value || "").trim();
    if(!url){
      toast("Paste an MP3 URL first (or use default).", "warn");
      return;
    }
    setSrc(url, true);
    toast("Loading MP3 from URL…", "good");
  });

  // Use default bytecast.mp3 next to HTML
  useDefaultBtn.addEventListener("click", ()=>{
    setSrc("bytecast.mp3", true);
    toast("Using default bytecast.mp3 (same folder).", "good");
  });

  // Load local file
  audioFile.addEventListener("change", ()=>{
    const f = audioFile.files && audioFile.files[0];
    if(!f) return;
    const url = URL.createObjectURL(f);
    setSrc(url, false); // object URLs can't be downloaded reliably via href
    setStatus("Local file loaded", "good");
    toast("Local MP3 loaded.", "good");
  });

  // Default: try bytecast.mp3
  setSrc("bytecast.mp3", true);
  setPlayLabel();
})();




/**
 * NXCore / EchoVerse narration runtime — plays forged MP3 sequences from narration.manifest.json.
 * Falls back to caller-provided TTS when manifest or files are missing.
 *
 * Manifest shape (narration-manifest-v1):
 * { packId, sequenceId, tracks: [{ id, label, src, durationMs? }] }
 */
(function (global) {
  "use strict";

  function createApi() {
    let audio = null;
    let tracks = [];
    let index = 0;
    let playing = false;
    let onProgress = null;
    let onComplete = null;
    let onError = null;

    function stop() {
      playing = false;
      if (audio) {
        audio.pause();
        audio.src = "";
        audio = null;
      }
      index = 0;
    }

    function emitProgress() {
      if (!onProgress || !tracks.length) return;
      const pct = tracks.length ? ((index + (audio && audio.duration ? audio.currentTime / audio.duration : 0)) / tracks.length) * 100 : 0;
      onProgress(Math.min(100, pct), tracks[index]?.label || "");
    }

    function playIndex(i) {
      if (i >= tracks.length) {
        playing = false;
        if (onComplete) onComplete();
        return;
      }
      index = i;
      const track = tracks[i];
      audio = new Audio(track.src);
      audio.addEventListener("timeupdate", emitProgress);
      audio.addEventListener("ended", function () {
        playIndex(i + 1);
      });
      audio.addEventListener("error", function () {
        playing = false;
        if (onError) onError(new Error("Unable to load " + track.src));
      });
      playing = true;
      audio.play().catch(function (err) {
        playing = false;
        if (onError) onError(err);
      });
      emitProgress();
    }

    return {
      isPlaying: function () {
        return playing;
      },
      stop: stop,
      playTracks: function (list) {
        stop();
        tracks = (list || []).filter(function (t) {
          return t && t.src;
        });
        if (!tracks.length) {
          if (onError) onError(new Error("No narration tracks"));
          return;
        }
        playIndex(0);
      },
      loadManifest: function (url) {
        return fetch(url, { cache: "no-store" }).then(function (r) {
          if (!r.ok) throw new Error("manifest " + r.status);
          return r.json();
        });
      },
      onProgress: function (fn) {
        onProgress = fn;
      },
      onComplete: function (fn) {
        onComplete = fn;
      },
      onError: function (fn) {
        onError = fn;
      },
    };
  }

  global.NxcoreNarrationPlayer = {
    create: createApi,
  };
})(typeof window !== "undefined" ? window : globalThis);

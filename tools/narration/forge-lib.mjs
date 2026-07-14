/**
 * NXCore EchoVerse TTS client for ByteCast narration forge.
 * Compatible with POST /api/generate (port 5315 on NXCore).
 */
import { readFileSync, existsSync } from "node:fs";

function isAudioBuffer(buf) {
  if (!buf?.length) return false;
  if (buf.length >= 4 && buf.slice(0, 4).toString("ascii") === "RIFF") return true;
  if (buf.length >= 3 && buf.slice(0, 3).toString("ascii") === "ID3") return true;
  if (buf.length >= 2 && buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0) return true;
  return false;
}

function pickBase64Field(data) {
  for (const key of ["audioBase64", "audio_base64", "audio", "data", "wav"]) {
    const value = data?.[key];
    if (typeof value === "string" && value.length > 64) return value;
  }
  return null;
}

function resolveGenerateUrl(config) {
  const env = process.env.NXCORE_TTS_URL?.trim();
  if (env) {
    const u = env.replace(/\/$/, "");
    return u.endsWith("/api/generate") ? u : `${u}/api/generate`;
  }
  const base = (config?.tts?.defaultUrl || "http://127.0.0.1:5315").replace(/\/$/, "");
  const endpoint = config?.tts?.endpoint || "/api/generate";
  return `${base}${endpoint}`;
}

export function resolveGenerateUrlForConfig(config) {
  return resolveGenerateUrl(config);
}

async function fetchAudioUrl(url, headers) {
  const resp = await fetch(url, { headers });
  if (!resp.ok) return null;
  const buf = Buffer.from(await resp.arrayBuffer());
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("audio/") || isAudioBuffer(buf)) return buf;
  return null;
}

async function decodeTtsResponse(resp, generateUrl, headers, requestFormat) {
  const contentType = resp.headers.get("content-type") || "";
  if (contentType.includes("audio/")) {
    return Buffer.from(await resp.arrayBuffer());
  }

  const raw = Buffer.from(await resp.arrayBuffer());
  let data;
  try {
    data = JSON.parse(raw.toString("utf8"));
  } catch {
    if (isAudioBuffer(raw)) return raw;
    throw new Error(`TTS returned non-JSON (${raw.length} bytes): ${raw.toString("utf8").slice(0, 120)}`);
  }

  const base64 = pickBase64Field(data);
  if (base64) return Buffer.from(base64, "base64");

  const localPath = data.path || data.file_path || data.filePath;
  if (localPath && existsSync(localPath)) {
    const buf = readFileSync(localPath);
    if (isAudioBuffer(buf)) return buf;
  }

  const origin = new URL(generateUrl).origin;
  const audioBase = (process.env.NXCORE_AUDIO_BASE_URL || `${origin}/audio`).replace(/\/$/, "");
  const urls = [];
  if (data?.filename) urls.push(`${audioBase}/${data.filename}`);
  for (const key of ["audio_url", "audioUrl", "url", "download_url", "downloadUrl"]) {
    if (data?.[key]) urls.push(new URL(data[key], origin).toString());
  }

  for (const url of [...new Set(urls)]) {
    const buf = await fetchAudioUrl(url, headers);
    if (buf) return buf;
  }

  const keys = Object.keys(data || {}).join(", ") || "(empty)";
  throw new Error(`Unknown TTS response (keys: ${keys})`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {{ text: string, recipe: object, forgeConfig?: object }} opts
 */
export async function synthesizeNxcoreTts({ text, recipe = {}, forgeConfig = {} }) {
  const generateUrl = resolveGenerateUrl(forgeConfig);
  const apiKey = process.env.NXCORE_TTS_API_KEY || "";
  const headers = { "Content-Type": "application/json", Accept: "audio/*,application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const engine = process.env.NXCORE_TTS_ENGINE || recipe.engine || "piper";
  const voice = recipe.voice || "en_US-amy-medium";
  const speed = Number(recipe.speed ?? 1.0);
  const format = process.env.NXCORE_TTS_FORMAT || recipe.format || "wav";

  const body = { engine, text, voice, speed, format };
  if (recipe.splitPattern) body.split_pattern = recipe.splitPattern;

  const maxRetries = Math.max(1, Number(process.env.NXCORE_TTS_RETRIES || 4));
  const retryDelayMs = Math.max(250, Number(process.env.NXCORE_TTS_RETRY_DELAY_MS || 2000));

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const resp = await fetch(generateUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const detail = await resp.text().catch(() => "");
        throw new Error(`HTTP ${resp.status}: ${detail.slice(0, 240)}`);
      }
      return await decodeTtsResponse(resp, generateUrl, headers, format);
    } catch (err) {
      const retryable = attempt < maxRetries && /fetch failed|ECONN|ETIMED|EAI_AGAIN|5\d\d/i.test(String(err.message || err));
      if (!retryable) throw err;
      await sleep(retryDelayMs * attempt);
    }
  }
  throw new Error("TTS retries exhausted");
}

export async function probeNxcoreTts(forgeConfig = {}) {
  const generateUrl = resolveGenerateUrl(forgeConfig);
  const voicesUrl = generateUrl.replace(/\/api\/generate$/, "/api/voices");
  const results = { generateUrl, voicesUrl, voices: null, ok: false };

  try {
    const v = await fetch(voicesUrl);
    if (v.ok) {
      results.voices = await v.json();
      results.ok = true;
    }
  } catch {
    // voices endpoint optional
  }

  if (!results.ok) {
    const buf = await synthesizeNxcoreTts({
      text: "ByteCast narration forge probe.",
      recipe: { engine: "piper", voice: "en_US-amy-medium", speed: 1.06, format: "wav" },
      forgeConfig,
    });
    results.ok = Boolean(buf?.length);
    results.probeBytes = buf?.length || 0;
  }

  return results;
}

# ANALYTICS_UMAMI — Seed Standard Integration

Date: 2026-02-07

Umami is supported as an optional analytics layer.

## Why this pattern

- Keeps seeds **static-first**: no build step, no dependencies
- Avoids tracking when opened locally (`file://`)
- Prevents accidental tracking on unintended hosts via domain guard
- Allows a quick one-off disable using a query flag

## Required config object

Place this near the top of `app.js`:

```js
window.__UMAMI__ = {
  enabled: true,
  url: "https://stats.aerocoreos.com",
  websiteId: "5f012bc0-4545-474a-a689-19c01818fadc",
  domains: ["aerovista-us.github.io"],
  disableOnFileProtocol: true,
};
```

## Loader snippet

```js
(function initUmami() {
  const cfg = window.__UMAMI__;
  if (!cfg?.enabled) return;

  // URL override
  if (new URLSearchParams(location.search).has("no_analytics")) return;

  // Avoid tracking when opened locally
  if (cfg.disableOnFileProtocol && location.protocol === "file:") return;

  // Domain guard (recommended)
  if (Array.isArray(cfg.domains) && cfg.domains.length) {
    const host = location.hostname;
    const ok = cfg.domains.some(d => d === host || (d.startsWith(".") && host.endsWith(d)));
    if (!ok) return;
  }

  const s = document.createElement("script");
  s.defer = true;
  s.src = cfg.url.replace(/\/$/, "") + "/script.js";
  s.setAttribute("data-website-id", cfg.websiteId);
  document.head.appendChild(s);
})();
```

## CSP note (only if you add CSP later)

If you add a CSP meta tag, allow Umami host in:
- `script-src`
- `connect-src` (if needed)

Example host: `stats.aerocoreos.com`

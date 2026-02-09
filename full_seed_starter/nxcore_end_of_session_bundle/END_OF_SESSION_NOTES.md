# NXCore Traefik DNS-01 + Cloudflare + Umami Injection — End of Session
Date: 2026-02-06 07:57 UTC

## What we were trying to achieve
1. **Public-facing web**: make `aerovista.us` resolve cleanly with valid HTTPS and route to Firebase Hosting (`aerovista-us.web.app`).
2. **Analytics**: keep Umami integration deployable/off-by-default on GitHub Pages drops (e.g., `/vday/`), with a safe injection publisher workflow.
3. **Stats/Umami host plan**: prepare to host Umami in a way that can be public (script endpoint) while keeping the dashboard locked down.
4. **DNS/SSL reliability**: stop mixing tailnet-only DNS with public DNS for the same hostname (the main cause of “SSL chaos” earlier).
5. **Next milestone**: expose `stats.aerocoreos.com` publicly (but protected) using Cloudflare, with NXCore reachable via Tunnel.

---

## Verified completed work this session (only items that have evidence in the thread)

### A) GitHub Pages `/vday/` Umami integration (config+loader) is live, with analytics OFF by default
Evidence provided in-thread:
- Umami tags present on multiple pages (index/adventure/landing/about) in `v5/*`
- `analytics/umami-config.js` deployed with empty `url` + `websiteId` (safe default/off)
- Service worker forces **network-first** for `analytics/umami-config.js` + `analytics/umami-loader.js` so config changes won’t get stuck behind precache
- Loader has iframe skip, mixed-content guard, optional `data-domains`
- Remote verification script passes (`verify_remote.py --base https://aerovista-us.github.io/vday/`)

Status: **DONE**

### B) Traefik dashboard API sanity (local) is working
Evidence:
- `curl -s http://127.0.0.1:8083/api/overview` returns JSON showing routers/services counts.

Status: **DONE** (local API only)

### C) Traefik upgraded to v2.11.8
Evidence:
- `docker exec -it nxtraefik-traefik-1 traefik version` shows `2.11.8`.

Status: **DONE**

### D) DNS-01 integration plumbing staged in Traefik config
Evidence:
- `certificatesResolvers.le_dns.acme` present with:
  - `caServer` set to **Let’s Encrypt staging**
  - `storage: /acme/acme.json`
  - `dnsChallenge.provider: cloudflare`
  - `resolvers: 1.1.1.1:53, 8.8.8.8:53`
  - `disablePropagationCheck: true`
- Container env shows `CF_DNS_API_TOKEN=...`

Status: **DONE (configured)**  
Note: **Certificate issuance is NOT confirmed as successful**.

### E) cloudflared package installed on NXCore
Evidence:
- Script output shows installation of `cloudflared` from Cloudflare repo.

Status: **DONE**

---

## Work attempted but NOT confirmed complete (no evidence of successful end state)

### 1) Public DNS for `stats.aerovista.us` or `stats.aerocoreos.com`
Evidence indicates NOT complete:
- `curl -vk https://stats.aerovista.us/` fails: **Could not resolve host**
- `dig +short stats.aerovista.us A @1.1.1.1` / `@8.8.8.8` returned nothing
- ACME attempts failed earlier due to:
  - Porkbun 403 on record create (later manually tested Porkbun API worked)
  - Then propagation timeout referencing `ns1.aerovista.us:53` (old NS)

Status: **NOT DONE**

### 2) Let’s Encrypt cert successfully issued for `stats.*`
Evidence indicates NOT complete:
- No log line showing successful cert issuance
- `acme.json` exists and contains an account registration, but no proof of a valid cert stored for `stats.*`.

Status: **NOT DONE**

### 3) DNS fully transferred/propagated cleanly to Cloudflare for `aerovista.us`
Evidence indicates partially done:
- Public resolvers show Cloudflare NS (`dylan`/`elma`)
- But local resolver output still showed `ns1.aerovista.us` in one `dig` result earlier and NXCore is using a Tailscale DNS server for the `~aerovista.us` route.

Status: **IN PROGRESS**

### 4) cloudflared tunnel created and systemd service running
Evidence indicates NOT done:
- Script halted with: “**ACTION REQUIRED: cloudflared tunnel login**”
- No subsequent output showing tunnel created, DNS route created, or systemd service enabled.

Status: **NOT DONE**

---

## Decisions locked in during the session (as stated)
1. **Make `aerovista.us` public** and stop mapping it to a tailnet IP.
2. Use **`aerocoreos.com` later for NXCore** hostnames (pretty names; no `nxcore.tail*.ts.net` externally).
3. Prefer per-drop subdomains like:
   - `vday.aerovista.us` (preferred)
   - or `drops.aerovista.us/vday/` (alternate discussed)
4. Public site: `aerovista.us → Firebase Hosting (aerovista-us.web.app)`; GitHub Pages still used at `https://aerovista-us.github.io/<repo>/` as canonical “drop hosting” baseline.

---

## Key risks observed
- **Split-horizon DNS in systemd-resolved**: NXCore shows `DNS Domain: ~aerovista.us` pointing to Tailscale DNS (100.115.9.61). That can break public resolution from NXCore and can confuse ACME propagation checks if Traefik/lego consults local resolvers.
- **Stale NS glue / old NS still queried**: ACME propagation timeout referenced `ns1.aerovista.us:53`.
- **Restart churn**: Traefik hit “use of closed network connection” and even a panic on stop timeout during rapid restarts.

---

## Immediate next action (the one blocking forward progress)
Run interactive Cloudflare tunnel login once:
`cloudflared tunnel login`
Then rerun the tunnel setup script:
`/srv/core/ops/traefik/tools/cloudflared_setup_stats_aerocoreos.sh`

---

## Subdomain limits (practical)
DNS has no tiny fixed “subdomain count” ceiling. Your real limit is **DNS record count** + provider plan/API limits. With Cloudflare, the drop-style approach (`<repo>.aerovista.us`) is normally fine at typical scales.

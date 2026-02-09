# Handoff Report — NXCore Traefik DNS-01 + Cloudflare + Umami Injection — End of Session
Date: 2026-02-06 07:57 UTC

## Current state (evidence-based)

### GitHub Pages Drop: /vday/
- Umami config+loader integrated across main pages.
- Analytics **OFF** by default.
- Service worker uses **network-first** for umami config/loader.
- Remote verify script passed against deployed base.

### Traefik (NXCore)
- Container: `nxtraefik-traefik-1`
- Version: **2.11.8**
- Local API OK: `http://127.0.0.1:8083/api/overview`
- DNS-01 resolver configured with Cloudflare token, LE staging, storage `/acme/acme.json`.

### DNS
- Public resolvers show Cloudflare NS for `aerovista.us` (`dylan`/`elma`).
- NXCore resolver shows Tailscale DNS route for `~aerovista.us` (can interfere with “public reality” testing).

## Not completed (no proof)
- `stats.aerovista.us` does not resolve.
- No successful cert issuance for `stats.*` was shown.
- Cloudflare Tunnel not created (script stopped requiring `cloudflared tunnel login`).
- `aerovista.us` public HTTPS still showed a browser cert warning at one point.

## Next actions (do these first)
1) One-time Cloudflare auth:
```bash
cloudflared tunnel login
```

2) Rerun:
```bash
/srv/core/ops/traefik/tools/cloudflared_setup_stats_aerocoreos.sh
```

3) Verify:
```bash
cloudflared tunnel list
systemctl status cloudflared
dig +short stats.aerocoreos.com A @1.1.1.1
curl -Ik https://stats.aerocoreos.com
```

## Public web (aerovista.us → Firebase Hosting)
Target you confirmed:
- Apex: `aerovista.us` → CNAME flatten → `aerovista-us.web.app`
- WWW: `www` → CNAME → `aerovista-us.web.app`

To finish:
- ensure no conflicting records
- ensure Firebase domain is set to **Serve traffic from this domain** (not just redirect) when desired
- allow Cloudflare Universal SSL to finish provisioning and retest

## Drop domains
Locked concept:
- preferred: `vday.aerovista.us` and later `<repo>.aerovista.us`
- alternative: `drops.aerovista.us/<repo>/`

Document + automate once the public web baseline is stable.

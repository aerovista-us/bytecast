# ByteCast — Next Operator Handoff (Script)
Date: 2026-02-06 07:57 UTC
Episode: NXCore Edge + Public Web + Analytics

We’re separating public web from tailnet services.

What’s confirmed done:
- /vday/ on GitHub Pages has Umami wiring in place, but it is OFF by default via empty config.
- Service worker is network-first for Umami config/loader so changes propagate.
- Traefik is upgraded to 2.11.8 and its local API is reachable at 127.0.0.1:8083.
- cloudflared is installed.

What is NOT done yet:
- stats.* is not publicly resolvable and we have no proof of a successful Let’s Encrypt certificate issuance.
- Cloudflare Tunnel is not created yet; the setup script stopped because we must do `cloudflared tunnel login` interactively once.
- aerovista.us public HTTPS needs final validation after DNS/Cloudflare cert provisioning.

Your first move:
Run:
    cloudflared tunnel login
Then rerun:
    /srv/core/ops/traefik/tools/cloudflared_setup_stats_aerocoreos.sh

Verify with:
    dig stats.aerocoreos.com @1.1.1.1
    curl -Ik https://stats.aerocoreos.com

Important gotcha:
NXCore’s resolver has a Tailscale routing rule for ~aerovista.us pointing to 100.115.9.61, which can sabotage public DNS tests. Always verify with explicit public resolvers during this phase.

Goal state:
- aerovista.us is clean and public (Firebase Hosting).
- stats.aerocoreos.com is public-resolvable but locked down via Cloudflare Access/WAF, with only what we choose exposed.

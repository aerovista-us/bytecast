# Security & Operational Boundaries (Lane C)

These areas are high risk and require tight control.

## Restricted areas (founder-only execution)
- Auth & authorization (claims, allowlists, tokens)
- Secrets management (API keys, service accounts, env vars)
- Networking (firewalls, reverse proxies, routing)
- Deployment pipelines
- Production database migrations / canonical writes

## Allowed support from contributors
- Write a plan + checklist
- Prototype in a sandbox or mock mode
- Implement non-sensitive parts behind feature flags
- Create tests and validation steps
- Draft docs/runbooks for the founder to execute

## Minimum safety rules
- Never commit secrets.
- Use least-privilege access.
- Ensure actions are auditable (logs/traceability).
- Validate and sanitize inputs; avoid leaking details in errors.

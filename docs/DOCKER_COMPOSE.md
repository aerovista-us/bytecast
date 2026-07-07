# ByteCast — Docker Compose

Serve the static `bytecast/` workspace with **nginx** on port **8080** (same default as Playwright’s `baseURL`).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2 (`docker compose`).

## Run

From `mini.shops/bytecast/`:

```bash
docker compose up
```

Open [http://localhost:8080](http://localhost:8080) (Workspace Entry). Detached:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

### Custom port

When **8080 is already allocated** (common on shared servers):

```bash
BYTECAST_PORT=8081 docker compose up
```

Then open `http://<host>:8081/`. To make that permanent, copy `.env.example` to `.env` and set `BYTECAST_PORT=8081` (Compose reads `.env` next to `docker-compose.yml`).

### Port already in use (`Bind for 0.0.0.0:8080 failed`)

On **nxcore** (and similar hosts), **8080 is often already mapped** to **`av-catalog-console`** (`aerovista_catalog_console-catalog-console`). ByteCast Compose must use another host port.

1. Pick a free port (e.g. `18080`, `8092`, `8888`) and run:

   ```bash
   BYTECAST_PORT=18080 docker compose up -d
   ```

   Then browse `http://nxcore:<port>/` (or `localhost` if you are on the same machine).

2. Or copy `.env.example` → `.env`, uncomment `BYTECAST_PORT=18080` (or another free port).

3. Optional — confirm what holds 8080 on Linux:

   ```bash
   sudo ss -tlnp | grep ':8080'
   # or
   docker ps --format '{{.Names}}\t{{.Ports}}' | grep 8080
   ```

`docker compose up --build` is unnecessary for this stack (there is no `build:` section); use `docker compose up` unless you add a custom image.

## Playwright tests (host) + Compose (server)

1. Start the stack: `docker compose up -d`
2. Point Playwright at the running server and **do not** start the embedded Python server:

**PowerShell**

```powershell
$env:BYTECAST_USE_EXTERNAL_SERVER = "1"
npm test
```

**bash**

```bash
BYTECAST_USE_EXTERNAL_SERVER=1 npm test
```

`BYTECAST_URL` defaults to `http://localhost:8080`. If you used `BYTECAST_PORT=18080`, run tests with e.g. `BYTECAST_URL=http://localhost:18080 BYTECAST_USE_EXTERNAL_SERVER=1 npm test`.

## CI note

With `CI=true`, Playwright normally starts its own `python -m http.server`. For CI that only runs Docker, start Compose first and set `BYTECAST_USE_EXTERNAL_SERVER=1` plus the correct `BYTECAST_URL` for your runner’s network.

## Files

| File | Role |
|------|------|
| `docker-compose.yml` | `nginx:alpine`, mount repo root as docroot, map host `8080` → container `80` |
| `.dockerignore` | Ignores `node_modules` and test artifacts for a cleaner context |

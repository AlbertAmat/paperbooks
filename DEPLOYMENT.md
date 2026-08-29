# Deploying PaperBooks with Docker

PaperBooks ships as one Docker image (`ghcr.io/albertamat/paperbooks`) containing the
compiled server and the built client, plus a `docker-compose.yml` that adds a
PostgreSQL container next to it. This guide covers three ways to run that stack,
depending on who should be able to reach it:

| # | Scenario | Reachable from | TLS handled by | Extra container |
|---|----------|-----------------|-----------------|------------------|
| [A](#a-self-hosted-local-only--no-public-access) | Self-hosted, local only | this machine / your LAN | — (none needed) | none |
| [B](#b-production-with-your-own-reverse-proxy--dns) | Production, your own proxy/DNS | the public internet | your proxy (Caddy/Nginx/Traefik) | none (proxy runs on the host, outside Compose) |
| [C](#c-production-with-cloudflare-tunnel) | Production, Cloudflare Tunnel | the public internet | Cloudflare | `cloudflared` |

If you're not sure which one you want: **A** if this never leaves your home network,
**C** if your domain's DNS already lives on Cloudflare and you'd rather not manage
certificates, **B** for everything else (your own domain/DNS/server, full control).

---

## Prerequisites (all scenarios)

- Docker Engine with the Compose plugin (`docker compose version` should work).
- The two files this repo publishes for deployment:

  ```bash
  curl -O https://raw.githubusercontent.com/AlbertAmat/paperbooks/main/docker-compose.yml
  curl -O https://raw.githubusercontent.com/AlbertAmat/paperbooks/main/.env.example
  cp .env.example .env
  ```
- A generated JWT secret: `openssl rand -hex 32` → `JWT_SECRET` in `.env`.
- A real `DB_PASSWORD` in `.env` (not the example's blank value).
- `ALLOW_DEV_AUTH=false` — always, in every scenario below. It bypasses login
  entirely and exists only for local development without Docker.

Everything past this point is scenario-specific `.env` values and, for B, a small
amount of host configuration outside of Docker.

---

## A. Self-hosted, local only — no public access

Use this when PaperBooks should only ever be reached from the machine it runs on, or
at most your home LAN — never the public internet.

1. In `.env`:
   ```
   FRONT_END_URL=http://localhost:3000
   TRUST_PROXY=false
   CLOUDFLARE_TUNNEL_TOKEN=
   ```
   (If you want other devices on your LAN to reach it too, e.g. from a tablet, use
   your machine's LAN IP instead: `FRONT_END_URL=http://192.168.1.50:3000`.)

2. **If you want it reachable only from this machine** (not even your LAN), restrict
   the published port to loopback by editing the `app` service's `ports:` entry in
   `docker-compose.yml`:
   ```yaml
   ports:
     - "127.0.0.1:${API_PORT:-3000}:${API_PORT:-3000}"
   ```
   Leave it as the default (`"${API_PORT:-3000}:${API_PORT:-3000}"`) if LAN access is
   fine — just be aware that binds to all interfaces, so anyone who can reach your LAN
   can reach it too.

3. Start it — no profile flag:
   ```bash
   docker compose up -d
   ```

4. Open `FRONT_END_URL` in a browser.

Don't forward this port on your router. There's nothing else to configure — no
reverse proxy, no certificate, no `cloudflared`.

---

## B. Production with your own reverse proxy / DNS

Use this when you manage your own domain, DNS, and server, and would rather run your
own TLS termination than depend on Cloudflare.

**Prerequisites:** a domain with an A (and AAAA, if you have IPv6) record pointing at
your server's public IP, and a reverse proxy installed on the host (outside Docker
Compose) — Caddy is shown below because it handles TLS automatically; Nginx + certbot
works the same way with more manual steps.

1. In `.env`:
   ```
   FRONT_END_URL=https://your-domain.com
   TRUST_PROXY=true
   CLOUDFLARE_TUNNEL_TOKEN=
   ```
   `TRUST_PROXY=true` matters here: without it, the login rate limiter sees every
   visitor as coming from your reverse proxy's IP instead of their real one.

2. Recommended: bind the app's port to loopback only, so the only way in is through
   your reverse proxy, not by hitting the app's port directly. Edit `docker-compose.yml`:
   ```yaml
   ports:
     - "127.0.0.1:${API_PORT:-3000}:${API_PORT:-3000}"
   ```

3. Start the stack — no profile flag:
   ```bash
   docker compose up -d
   ```

4. Configure your reverse proxy. With Caddy, this is the entire config
   (`/etc/caddy/Caddyfile`):
   ```
   your-domain.com {
       reverse_proxy localhost:3000
   }
   ```
   ```bash
   sudo systemctl reload caddy
   ```
   Caddy requests and renews the certificate automatically — nothing else to do.

   With Nginx + certbot instead: proxy_pass to `http://127.0.0.1:3000` in your server
   block, then run `certbot --nginx -d your-domain.com` to provision the certificate.

5. Firewall: open 80 (HTTP→HTTPS redirect / ACME challenge) and 443. Nothing else
   needs to be reachable from outside — `3000` is already loopback-only from step 2.

---

## C. Production with Cloudflare Tunnel

Use this when your domain's DNS is already on Cloudflare and you'd rather not manage
inbound ports or certificates at all.

**Prerequisites:** the domain added to a Cloudflare account (free plan is fine), DNS
managed there.

1. In the Cloudflare dashboard: **Zero Trust → Networks → Tunnels → Create a tunnel**.
   Add a public hostname (e.g. `books.your-domain.com`) routing to service
   `http://app:3000` — that's the Compose service name, not `localhost`. Copy the
   tunnel token it gives you.

2. In `.env`:
   ```
   FRONT_END_URL=https://books.your-domain.com
   TRUST_PROXY=true
   CLOUDFLARE_TUNNEL_TOKEN=<the token from step 1>
   ```

3. Start the stack with the `cloudflare` profile so the tunnel container runs too:
   ```bash
   docker compose --profile cloudflare up -d
   ```

4. Optional hardening: `cloudflared` reaches `app` over the internal Compose network
   (`app:3000`), not through the published host port — so once this is working, you
   can remove the `app` service's `ports:` entry from `docker-compose.yml` entirely
   for a setup with **zero inbound ports** on the host. (Do this only after step 3
   works, since removing it also blocks direct `http://server-ip:3000` access, which
   you're using to test.)

5. Firewall: nothing to open. `cloudflared` only makes outbound connections to
   Cloudflare.

---

## Common operations, all scenarios

- **Upgrading**: set `APP_TAG` in `.env` to a newer released version (see the
  repo's [Releases](https://github.com/AlbertAmat/paperbooks/releases)), then:
  ```bash
  docker compose pull
  docker compose up -d
  ```
  Pin `APP_TAG` to a specific version rather than `latest` so upgrades are a
  deliberate step, not a surprise on container restart.
- **Confirming what's actually running**:
  `curl http://<host>:<port>/api/rest/app/version` (adjust for your setup — through
  your proxy/tunnel URL if the port isn't published).
- **Logs**: `docker compose logs -f app`, or the `app-logs` volume, which holds
  `bookStorage.log` as written by the app itself.
- **Backups**: everything that matters lives in the `db-data` volume. Either back up
  the volume directly or run `docker compose exec db pg_dump -U <DB_USER> <DB_NAME>`
  on a schedule.

## Security checklist

- [ ] `ALLOW_DEV_AUTH=false`
- [ ] `JWT_SECRET` generated with `openssl rand -hex 32`, not left blank or default
- [ ] `DB_PASSWORD` is a real generated password
- [ ] `TRUST_PROXY=true` for scenarios B/C, `false` for scenario A
- [ ] `APP_TAG` pinned to a version, not tracking `latest` unattended
- [ ] Scenario A: port not forwarded on your router
- [ ] Scenario B: app port bound to `127.0.0.1`, only 80/443 open on the firewall
- [ ] Scenario C: `TRUST_PROXY=true` is set (easy to forget since Cloudflare "just
      works" even without it — but rate limiting silently degrades without it)

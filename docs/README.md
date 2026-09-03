# Developer docs

Deep-dive documentation for people working *on* Vaultisse's code -
contributors, maintainers, whoever's deploying or auditing it. Not to be
confused with the **in-app** `/docs` help pages (`client/src/views/docs/content/`),
which are end-user-facing, translated into four languages, and explain how to
*use* the app rather than how it's built.

Start with the [root README](../README.md) for the project overview and
architecture map; come here for the parts worth a longer explanation than fit
there.

- **[AUTHENTICATION.md](AUTHENTICATION.md)** - the session model: JWTs,
  `token_version`, per-session revocation (`user_sessions`), the audit trail
  (`activity_log`), and how a dying session surfaces on the client.
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - self-hosting: local-only, behind your
  own reverse proxy, behind Cloudflare Tunnel, or the one-click Unraid template.
- **[ROADMAP.md](ROADMAP.md)** - feature ideas that don't have anyone working
  on them yet, for contributors looking for something to pick up.

`README.md`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and
`SECURITY.md` stay at the repo root - GitHub looks for those specific files
there (or gives them dedicated UI - the Security tab, the "healthy
contributing guidelines" banner, and so on), so moving them would make the
project look less maintained to anyone just browsing on GitHub. Everything
else that's prose documentation rather than one of those belongs here.

# Database upgrade files

`assets/db/databaseSchema.sql` is always current and is the only thing a
**brand-new install** needs (see the main [README](../../../README.md)) — it
already contains every change described in this directory.

This directory (`assets/db/upgrade/`) exists for **existing installs**: it
holds the incremental SQL needed to bring an already-running database in
line with the current `databaseSchema.sql`, without having to drop and
recreate it.

## Naming

One file per calendar day something changed, named `YYMMDD.sql`
(e.g. `083026.sql` for 2026-08-30). If a day has several unrelated changes,
they all go in that same day's file, grouped under short `--` comments —
don't split one day across multiple files.

Each file starts with a header comment summarizing what it does and
confirming new installs should skip it (copy the header from an existing
file).

## Applying

Files are meant to be run **in filename (date) order**, and each one **only
once**. Skip any file whose changes your database already has — check its
header comment, or just look at whether the column/table/label it adds
already exists.

```bash
docker compose exec -T db psql -U <DB_USER> -d <DB_NAME> < assets/db/upgrade/083026.sql
```

## Adding a new one

When your change needs a schema change (see
[CONTRIBUTING.md](../../../CONTRIBUTING.md)):

1. If a file for today's date already exists (because you or someone else
   already added one today), append to it instead of creating a new one.
2. Otherwise create `assets/db/upgrade/YYMMDD.sql` for today's date.
3. Add the same change to `assets/db/databaseSchema.sql` too — the two must
   stay in sync, since a fresh install only ever runs `databaseSchema.sql`.
4. Mention the new/updated file in your PR description.

These files are only safe to squash or rewrite **before** they've been
released (i.e. before anyone could plausibly have already run them against
a real database). Once a file has shipped in a tagged release, treat it as
immutable — add a new dated file for further changes instead of editing an
old one.

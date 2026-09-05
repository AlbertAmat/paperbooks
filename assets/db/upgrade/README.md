# Database upgrade files

`assets/db/databaseSchema.sql` is always current and is the only thing a
**brand-new install** needs (see the main [README](../../../README.md)) — it
already contains every change described in this directory.

This directory (`assets/db/upgrade/`) exists for **existing installs**: it
holds the incremental SQL needed to bring an already-running database in
line with the current `databaseSchema.sql`, without having to drop and
recreate it.

## Naming

Named after the released version that needs a schema change, `X.Y.Z`:

- If that version needs a **single** file, it's `assets/db/upgrade/X.Y.Z.sql`.
- If it needs **more than one**, create an `assets/db/upgrade/X.Y.Z/` folder
  and number the files inside it starting at 1: `X.Y.Z/1.sql`, `X.Y.Z/2.sql`,
  etc. (e.g. `assets/db/upgrade/1.0.0/1.sql`, `assets/db/upgrade/1.0.0/2.sql`).

This tells you exactly how far to run: to install version `X.Y.Z`, run every
version's file(s) — in order, and in numeric order within a folder — up
through and including `X.Y.Z`, skipping any version you've already applied.
If a version has several unrelated changes, they all go in that version's
file(s), grouped under short `--` comments — don't split unrelated changes
apart just because they landed on different days.

Each file starts with a header comment summarizing what it does and
confirming new installs should skip it (copy the header from an existing
file).

## Applying

Files are meant to be run **in version order** (and, within a version's
folder, in numeric order), each one **only once**. Skip any file whose
changes your database already has — check its header comment, or just look
at whether the column/table/label it adds already exists.

```bash
docker compose exec -T db psql -U <DB_USER> -d <DB_NAME> < assets/db/upgrade/1.0.0/1.sql
```

## Adding a new one

When your change needs a schema change (see
[CONTRIBUTING.md](../../../CONTRIBUTING.md)):

1. Figure out which not-yet-released version this change will ship in
   (usually the next version after the one in `package.json`).
2. If a single file for that version already exists
   (`assets/db/upgrade/X.Y.Z.sql`), move it into a new `X.Y.Z/` folder as
   `1.sql`, then add your change as `2.sql`. If the folder already exists,
   just add the next numbered file to it.
3. Otherwise create `assets/db/upgrade/X.Y.Z.sql` for that version.
4. Add the same change to `assets/db/databaseSchema.sql` too — the two must
   stay in sync, since a fresh install only ever runs `databaseSchema.sql`.
5. Mention the new/updated file in your PR description.

These files are only safe to squash or rewrite **before** they've been
released (i.e. before anyone could plausibly have already run them against
a real database). Once a file has shipped in a tagged release, treat it as
immutable — add a new file for further changes instead of editing an old
one.

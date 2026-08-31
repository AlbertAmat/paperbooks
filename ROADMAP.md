# Roadmap

Ideas for where PaperBooks could go next. Nothing here is scheduled or assigned —
these are open invitations for contributors to pick up, discuss, and design. If
you'd like to work on one, open an issue first to align on approach before
sending a pull request (see [CONTRIBUTING.md](CONTRIBUTING.md)).

Have an idea that isn't listed? Open an issue — see
[Suggesting features](CONTRIBUTING.md#suggesting-features).

## Integrations

- [ ] **Kindle and Kobo integration** — sync with the most common e-reader
  platforms. Automatically mark a book as read once it's finished on the device,
  and surface e-books that exist on the device but haven't been added to
  PaperBooks yet, so they can be imported with one click.

## Security & accounts

- [ ] **Security review** — an independent pass by a security-minded contributor
  to audit authentication, session handling, and the REST API for
  vulnerabilities, and harden anything that's found. See [SECURITY.md](SECURITY.md)
  for how to report anything found privately rather than as a public issue.
- [ ] **Single sign-on (SSO)** — log in with Google or GitHub as an alternative
  to email/password.
- [ ] **Email verification** — confirm a user's email address on registration.
- [ ] **Email notifications** — notify users by email for account events, such
  as confirming an account action completed successfully or confirming account
  deletion.

## Collaboration

- [ ] **Account invitations** — let an existing user invite someone else to the
  app by email.
- [ ] **Library sharing** — let multiple accounts manage the same collection of
  books together. Example: a family shares one book repository for the home,
  and every family member can add, borrow, and manage books in it.

## Admin

- [ ] **Admin panel** — a UI for managing users and app-wide settings without
  going through the database directly.

## Internationalization

- [ ] **German translation**
- [ ] **French translation**

  See [Adding a new language](CONTRIBUTING.md#adding-a-new-language) for how
  translations work.

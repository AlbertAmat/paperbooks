# Roadmap

Ideas for where PaperBooks could go next. Nothing here is scheduled or assigned —
these are open invitations for contributors to pick up, discuss, and design. If
you'd like to work on one, open an issue first to align on approach before
sending a pull request (see [CONTRIBUTING.md](CONTRIBUTING.md)).

Have an idea that isn't listed? Open an issue — see
[Suggesting features](CONTRIBUTING.md#suggesting-features).

## Integrations

- [ ] **Kindle and Kobo integration** ([#1](https://github.com/AlbertAmat/paperbooks/issues/1))
  — sync with the most common e-reader platforms. Automatically mark a book as
  read once it's finished on the device, and surface e-books that exist on the
  device but haven't been added to PaperBooks yet, so they can be imported with
  one click.

## Security & accounts

- [ ] **Security review** ([#2](https://github.com/AlbertAmat/paperbooks/issues/2))
  — an independent pass by a security-minded contributor to audit
  authentication, session handling, and the REST API for vulnerabilities, and
  harden anything that's found. See [SECURITY.md](SECURITY.md) for how to
  report anything found privately rather than as a public issue.
- [ ] **Single sign-on (SSO)** ([#3](https://github.com/AlbertAmat/paperbooks/issues/3))
  — log in with Google or GitHub as an alternative to email/password.
- [ ] **Email verification** ([#4](https://github.com/AlbertAmat/paperbooks/issues/4))
  — confirm a user's email address on registration.
- [ ] **Email notifications** ([#5](https://github.com/AlbertAmat/paperbooks/issues/5))
  — notify users by email for account events, such as confirming an account
  action completed successfully or confirming account deletion.

## Collaboration

- [ ] **Account invitations** ([#6](https://github.com/AlbertAmat/paperbooks/issues/6))
  — let an existing user invite someone else to the app by email.
- [ ] **Library sharing** ([#7](https://github.com/AlbertAmat/paperbooks/issues/7))
  — let multiple accounts manage the same collection of books together.
  Example: a family shares one book repository for the home, and every family
  member can add, borrow, and manage books in it.

## Admin

- [ ] **Admin panel** ([#8](https://github.com/AlbertAmat/paperbooks/issues/8))
  — a UI for managing users and app-wide settings without going through the
  database directly.

## Internationalization

- [ ] **German translation** ([#9](https://github.com/AlbertAmat/paperbooks/issues/9))
- [ ] **French translation** ([#10](https://github.com/AlbertAmat/paperbooks/issues/10))

  See [Adding a new language](CONTRIBUTING.md#adding-a-new-language) for how
  translations work.

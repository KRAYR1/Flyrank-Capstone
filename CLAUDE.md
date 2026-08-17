# CLAUDE.md

Guidance for Claude working in this repository.

## Project Overview
<!-- 1-2 sentences on what this project is. -->

## Stack
- **Language:** TypeScript/JavaScript (Node LTS)
- **Package manager:** npm
- **Framework:** React (Vite)
- **Testing:** Vitest + @testing-library/react
- **Linting/Formatting:** ESLint + Prettier

## Conventions

### Commits
This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
- `feat: ...` — new feature
- `fix: ...` — bug fix
- `docs: ...` — documentation only
- `chore: ...` — tooling, config, deps
- `refactor: ...` — code change that neither fixes a bug nor adds a feature
- `test: ...` — adding or correcting tests

Keep commits small and scoped to one logical change.

### Code Style
- Prefer small, single-purpose functions.
- Favor readability over cleverness.
- Add comments only where intent isn't obvious from the code.

### Branching
- `main` is always deployable.
- Feature work happens on `feat/<short-name>` branches.

## What the AI Assistant Should Do
- Ask before making structural changes (renaming files, changing architecture).
- Run tests/lint before proposing a commit.
- Explain non-obvious changes in the commit body, not just the subject line.

## What the AI Assistant Should Avoid
- Don't invent dependencies that aren't already in `package.json` without asking.
- Don't rewrite large sections of working code for style reasons alone.

## Rules Learned (FE-01 drill)

1. **Validation error precedence must be explicit, not left to chaining
   order.** Chained validators (e.g. `.min(2)` before a `.refine()`) can
   fire in an order that produces a misleading error message for edge
   cases like empty input. Use `superRefine` (or equivalent) to control
   exactly which message shows for which condition — never assume
   chained checks fail in the order you want.

2. **Form field labels and test queries must be unambiguous — no
   substring collisions.** A label like "Email notifications" will match
   a `getByLabelText(/email/i)` query meant for the "Email" field. Name
   labels so no two are substrings of each other, and anchor test regexes
   (`/^email$/i`) rather than leaving them open-ended.

3. **No feature ships without a runnable verification step.** A prompt
   that doesn't ask for tests (or another explicit check) produces code
   with unknown correctness — round 1's 511-line form was reviewed by
   reading, not running, and any bugs in it are still unknown. Every
   feature request must include "write it, then verify it" — reading code
   is not verification.

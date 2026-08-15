# CLAUDE.md

Guidance for Claude working in this repository.

## Project Overview
<!-- 1-2 sentences on what this project is. -->

## Stack
- **Language:** TypeScript/JavaScript (Node LTS)
- **Package manager:** npm
- **Framework:**
- **Testing:**
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

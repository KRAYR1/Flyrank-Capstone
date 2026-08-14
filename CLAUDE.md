# CLAUDE.md

Guidance for Claude Code (or any AI assistant) working in this repo.

## Stack

- Node.js (LTS)
- TypeScript
- npm for package management

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- **Formatting**: 2-space indent, semicolons, single quotes
- **File structure**: source in `src/`, tests alongside source as `*.test.ts`
- **Branching**: feature branches off `main`, PRs before merge

## Notes for AI assistants

- Prefer small, focused commits over large ones
- Explain non-obvious changes in commit bodies, not just subject lines
- Ask before adding new dependencies

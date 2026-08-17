# WORKFLOW.md

## Setup
Feature: account settings form (display name, email, notification toggle).
Round 1: one vague prompt, no follow-up, no fixes. Round 2: precise prompt
with constraints, example behavior, and a verification step (write tests,
run them, fix failures).

## Correctness
Round 1 produced a 511-line form covering fields nobody asked for —
username, password + confirm password, bio with a 280-character counter,
and a timezone dropdown — alongside the three actually specced. It has no
tests, so I have no evidence any of the validation logic is correct beyond
reading it manually. Round 2 is 192 lines, matches the spec exactly, and
ships with 4 passing tests that assert the actual required behavior
(required-name error, invalid-email error, successful save + toast,
toggle default state).

## Accessibility
Both rounds use proper `htmlFor`/`id` label pairing, which was a pleasant
surprise for round 1 given it wasn't asked for. Round 2 goes further:
`aria-invalid` and `aria-describedby` link each input to its error message
for screen readers, and error/status regions use `role="alert"` and
`role="status"` with `aria-live="polite"`. Round 1 has none of that —
errors are visually present but not programmatically associated with
anything a screen reader would announce as they appear.

## Edge cases
Round 1 handles more edge cases in raw volume (password strength, confirm-
match, bio length) simply because it built a bigger form — but none of it
was requested, so it's dead weight I'd have had to review, trim, and
re-test manually before shipping. Round 2 handles exactly the edge cases
in the spec: empty name, malformed email, and confirms notification
defaults to checked.

## Review effort
Round 1: reviewing meant reading 511 lines to figure out what was even in
scope, no way to verify correctness except manual testing. Round 2 took
noticeably longer up front — several fix-and-rerun cycles fighting local
tooling — but ended with 4 green automated tests. Round 1 felt faster to
generate; round 2 was slower to produce but faster to trust.

## AI mistake caught
Two, in round 2:
1. My original zod schema chained `.min(2)` before a custom `.refine()`
   check, so submitting an empty name showed "Name must be at least 2
   characters." instead of "Name is required" — the wrong error, silently
   wrong until the tests caught it. Fixed by rewriting validation with
   `superRefine` to control message precedence explicitly.
2. My test suite queried inputs with `getByLabelText(/email/i)`, which
   ambiguously matched both the Email field and the "Email notifications"
   checkbox label, causing false test failures. Fixed by anchoring the
   regex (`/^email$/i`) and renaming the checkbox label for clarity.

Neither mistake would have been caught without actually running the
verification step — round 1 had no equivalent step, so equivalent bugs in
it are simply unknown.

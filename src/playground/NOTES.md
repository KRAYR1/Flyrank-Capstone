# NOTES.md — Playground vs shadcn/ui

## What I built
Three components from scratch in `playground/`: `Modal.tsx`, `Tabs.tsx`,
`Disclosure.tsx`, each implemented against its W3C ARIA Authoring
Practices pattern (roles, keyboard interaction, focus management), with
no component library.

## Setup for comparison
Installed shadcn/ui into the project:
```
npx shadcn@latest init
npx shadcn@latest add dialog tabs
```
This project's shadcn setup uses **Base UI** as the underlying primitives
library (a newer option shadcn supports alongside Radix). The generated
`src/components/ui/dialog.tsx` imports its actual dialog behavior from
`@base-ui/react/dialog` rather than reimplementing it locally.

## Gaps between my version and shadcn's

**1. "Open code" is a thin wrapper, not a full implementation.**
Reading `dialog.tsx` alone doesn't show how focus trapping, id generation,
or keyboard handling actually work — the file itself is mostly
composition (`DialogPrimitive.Root`, `.Trigger`, `.Content`, etc.) plus
Tailwind classes and a close-icon button. The same held for `tabs.tsx`:
searching it for `role="tablist"`, `role="tab"`, or `role="tabpanel"`
turned up nothing — those roles never appear as literal strings, because
`TabsPrimitive.List`/`.Trigger`/`.Panel` apply them internally inside
the `@base-ui/react` package. The wrapper composes primitive components
by name; it never needs to spell out the ARIA roles itself. My hand-built
`Modal.tsx` and `Tabs.tsx` have no such split — every `role`, the focus
trap, the Escape handler, and the focus-restore logic are all visible
directly in the file, because I couldn't rely on an external package to
implement any of it for me.

**2. Composition-based API instead of a single component.**
My `Modal` is one component that takes `isOpen`/`onClose`/`children`
props. shadcn/Base UI's dialog is composed from several small
pieces — `Dialog.Root`, `Dialog.Trigger`, `Dialog.Portal`,
`Dialog.Content`, `Dialog.Title`, etc. — each responsible for one part of
the pattern, assembled by the consumer. This is more flexible (you can
rearrange or omit pieces) but also means understanding the whole pattern
requires reading how several small primitives interact, not just one
component's internals.

**3. Trigger/state wiring is implicit.**
My component manages open/closed state explicitly via a boolean prop I
control from the parent. The primitive-based approach ties the trigger
button and the dialog's open state together internally through
`Dialog.Root` and `Dialog.Trigger`, so the parent doesn't need its own
`useState` for open/closed at all unless it wants controlled behavior.
This hides state management from the consumer at the cost of making it
less obvious, from reading the wrapper alone, exactly when and how the
state changes.

**4. Styling approach.**
My components use inline `style` objects. shadcn's generated code uses
Tailwind utility classes via a `cn()` helper (`src/lib/utils.ts`) that
merges class names conditionally. This is a styling architecture
difference more than an accessibility one, but it's part of why the
generated file reads differently — a lot of the file's content is
Tailwind class strings, not behavioral logic.

**5. Icon and extra affordances included by default.**
shadcn's dialog wrapper includes a close button with an `XIcon` from
`lucide-react` built in by default, positioned in a specific spot.
My `Modal` only has the text "Close" button I wrote myself — matching
UI polish would require deliberately adding an icon library and
positioning it, which shadcn's version gives you out of the box.

**6. `data-slot` attributes for structural targeting.**
`tabs.tsx` doesn't use `data-state="active"` the way I expected (that's
a Radix convention). Instead, shadcn's own wrapper adds `data-slot="tabs"`,
`data-slot="tabs-trigger"`, etc. to elements — a shadcn-specific
convention (used consistently across all their components) for letting
consumers write CSS selectors targeting specific parts of a composed
component without adding custom class names. It serves a similar
purpose to Radix's `data-state` (a DOM hook for styling), but marks
*structure* rather than *state*. My components have neither — any
targeted styling would require adding my own class names or wrapper
elements by hand.

## What I couldn't directly verify
I did not open `node_modules/@base-ui/react` to read the actual primitive
source for this comparison — the wrapper file's imports confirm *where*
the logic lives, but the specific mechanics (portal usage, `useId`,
`data-state` attributes) would need to be checked directly inside that
package if a fully verified line-by-line comparison were required.

## Takeaway
Building these by hand first made the APG patterns concrete — I now
understand exactly why each `aria-*` attribute and keyboard handler
exists, because I had to reason through the interaction model myself
rather than trusting a library. Reading shadcn's generated code showed
something I didn't expect going in: "open code" doesn't mean the
accessibility logic itself is fully visible in the project — it means
the *composition* is visible, while the actual pattern implementation is
still delegated to an external primitives package. That's a more
accurate and more useful finding than assuming the copied file contains
everything.

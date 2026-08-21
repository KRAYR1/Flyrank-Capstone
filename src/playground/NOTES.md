# NOTES.md — Playground vs shadcn/ui

## What I built
Three components from scratch in `playground/`: `Modal.tsx`, `Tabs.tsx`,
`Disclosure.tsx`, each implemented against its W3C ARIA Authoring
Practices pattern (roles, keyboard interaction, focus management), with
no component library.

## Setup for comparison
Installed shadcn/ui into the project and added its `dialog` and `tabs`
components:
```
npx shadcn@latest init
npx shadcn@latest add dialog tabs
```
shadcn's components are "open code" — they get copied directly into
`src/components/ui/`, built on top of Radix UI primitives
(`@radix-ui/react-dialog`, `@radix-ui/react-tabs`), so I could read the
actual generated source rather than a black box.

## Gaps between my version and shadcn's

**1. Portal rendering.**
Radix's Dialog renders into a React Portal targeting `document.body` by
default, so the dialog escapes any parent's `overflow: hidden` or
`z-index` stacking context. My `Modal` renders inline in the component
tree — it works in this playground, but would break if mounted inside a
container with `overflow: hidden` or a lower stacking context, since the
overlay/dialog would be clipped or hidden behind other content.

**2. Focus restoration robustness.**
My focus-return logic checks `document.contains(toRestore)` before
refocusing, which handles the common case. Radix's `FocusScope` goes
further: it also handles focus loss to elements removed from the DOM
mid-interaction, keeps a live reference rather than a snapshot, and
coordinates with its focus-trap loop so focus never briefly lands on
`<body>` (which can happen in my version for a single Tab press before
the trap engages, since I trap on `keydown` rather than intercepting
focus movement itself).

**3. ID generation.**
I require the caller to pass `titleId` manually and wire it to
`aria-labelledby`. Radix uses React's `useId()` internally to generate
unique, SSR-safe ids automatically for every `aria-labelledby` /
`aria-describedby` / `aria-controls` relationship, so consumers never
have to think about id collisions or pass ids by hand at all.

**4. Dismissal behavior.**
My `Modal` closes on Escape and on overlay click. Radix's Dialog also
handles: locking body scroll while open, dismissing on outside pointer
interaction with proper distinction between "inside" and "outside"
targets (so a click that starts inside and drags outside doesn't
falsely dismiss), and exposes `onEscapeKeyDown` / `onPointerDownOutside`
as overridable callbacks rather than hardcoded behavior.

**5. State/styling architecture.**
Radix exposes `data-state="open" | "closed"` (and `data-orientation`,
`data-selected`, etc. on Tabs) as DOM attributes, so animations and
styling can be driven entirely by CSS instead of duplicating state in
JS. My components only expose state via React props/hooks — any
open/close transition animation would need to be built with additional
JS state (e.g. a `transitioning` flag) rather than a CSS attribute
selector.

**6. Composition flexibility.**
Radix's primitives support an `asChild` prop (via their `Slot`
component), letting consumers render a `Tabs.Trigger` as, say, a custom
`<Link>` instead of the default `<button>`, while Radix still attaches
the correct ARIA attributes and behavior. My components hardcode the
underlying DOM element (`<button>` for tabs and disclosure triggers),
so swapping the rendered element isn't possible without editing the
component itself.

## Takeaway
Building these by hand first made the APG patterns concrete — I now
understand exactly why each `aria-*` attribute and keyboard handler
exists, because I had to reason through the interaction model myself
rather than trusting a library. But reading shadcn/Radix's source showed
how much production-grade robustness (portals, id generation, dismissal
edge cases, style/state decoupling) sits underneath what looks like a
simple component API. Given a real project, I'd use shadcn/Radix — but
the hand-built version is what makes me able to actually review shadcn's
generated code intelligently instead of accepting it on faith.

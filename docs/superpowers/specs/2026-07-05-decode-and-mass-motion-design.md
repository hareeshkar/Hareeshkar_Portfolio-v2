# Decode & Mass — Full Motion Re-choreograph

## Scope

In scope: `src/lib/motionTokens.js` (new), `src/index.css`, `src/components/Hero.jsx`,
`Hero.css`, `useScramble.js`, `ProjectGallery.jsx`, `ProjectListItem.jsx`, `Skills.jsx`,
`Contact.jsx`, `contact/WaxSealButton.jsx`, `MobileMenu.jsx`.

Protected (unchanged): hero video zoom entrance (`bgReveal` scale 1.08→1 playing against the
video's own zoom-out — intentional), hero parallax/stagger/INTRO_READY relay, navbar
Menu/Contact scramble relay choreography, footer.

## 1. Motion foundation

- `src/lib/motionTokens.js` exports:
  - `EASE = { silk: [0.16,1,0.3,1], mass: [0.22,0.61,0.36,1], snap: [0.34,1.56,0.64,1], whip: [0.83,0,0.17,1] }`
  - `ENTRANCE_SPRING = { stiffness: 120, damping: 30, mass: 0.4 }` (moved from the two project files)
- `index.css` `:root` gains `--ease-silk`, `--ease-mass`, `--ease-snap`, `--ease-whip`.
- `index.css` gains a global `@media (prefers-reduced-motion: reduce)` block collapsing all CSS
  animations/transitions to ~0ms. Framer Motion components keep their existing
  `useReducedMotion` gates.

## 2. Text compiler on rAF

`useScramble.js`: replace `setInterval` with a `requestAnimationFrame` loop using a time
accumulator — `iteration` advances by `elapsed / speed * 0.5`, matching current semantics
(`speed` ms per tick, +0.5 iteration per tick). Same public API (`display`, `play`, `stop`,
`finished`, `hasPlayed`). Cancel rAF on stop/unmount.

## 3. Hero title decode

The two `motion.h1` lines ("Full Stack", "Developer") keep their `titleLine` blur-rise variants
but their text renders through `TextScramble` (trigger `"manual"`-style: play when `introReady`
fires), tuned fast (~speed 18) so glyphs resolve while the line rises. Reduced motion: plain text,
no scramble.

## 4. Projects mask reveal

- `ProjectListItem.jsx`: remove `titleClipPath` and `titleBlur` transforms. Wrap the `h3` in an
  `overflow-hidden` div; the `h3` scrubs `y` from `110%` → `0%` (string percents via
  `useTransform`) over the same `[0.05, 0.6]` entrance window, opacity unchanged. All other
  choreography (parallax, numerals, chips, spring) unchanged.
- `ProjectGallery.jsx` + `ProjectListItem.jsx` import `EASE`/`ENTRANCE_SPRING` from motionTokens.
- Section eyebrow/label in `ProjectGallery` header decodes via `TextScramble` trigger `"inView"`.

## 5. Skills & Contact motif + hygiene

- Skills and Contact section eyebrow labels decode via `TextScramble` trigger `"inView"`.
- `Contact.jsx`: resize listener wrapped in rAF throttle.
- `WaxSealButton.jsx`: `useReducedMotion` gate — shimmer and success glow render statically when
  reduced.
- `MobileMenu.jsx`: reduced-motion gate — open/close resolve via `gsap.set` (no tween) when
  `matchMedia('(prefers-reduced-motion: reduce)')` matches.

## 6. Hero.css cleanup

- Delete unused `.animated-gradient-text` rule + `gradient-shift` keyframes (dead code, infinite
  `background-position` repaint).
- `.btn::before`: fixed 400px circle, `transform: translate(-50%,-50%) scale(0)` →
  hover `scale(1)`; drop width/height transitions.
- Replace generic `cubic-bezier(0.4,0,0.2,1)` / `ease-out` literals on interactive elements with
  the token variables where touched.

## Verification

`npm run build` passes; dev-server manual scroll-through down and back up (titles mask-reveal in
both directions, no blur repaint); hero intro plays with title decode after nav relay;
reduced-motion emulation shows static final states everywhere; nav crumble lines unchanged.

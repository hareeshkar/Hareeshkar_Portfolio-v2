# Hero→Projects Transition & Project Animation Re-choreograph

## Scope

In scope: `ProjectGallery.jsx`, `ProjectListItem.jsx` (full re-choreograph to a continuous,
scroll-scrubbed animation model), plus two narrow touches in `Hero.jsx`.

Frozen: Hero's title/CTA/footer entrance choreography, stagger structure, easing curves, and
`INTRO_READY_EVENT` orchestration — unchanged.

Non-goal: no new signature interaction pattern. The existing visual language (blur / clip-path /
fade, editorial-staircase layout) stays; the goal is making it continuous instead of one-shot, and
unifying the seam between Hero and Projects.

## Shared motion foundation

- New `src/lib/motionTokens.js`: exports the signature ease `[0.16, 1, 0.3, 1]` and shared duration
  presets. Imported by `ProjectGallery.jsx` and `ProjectListItem.jsx`. Hero keeps its own literals
  (already the same curve) — not touched, to avoid any risk to frozen behavior.
- `useReducedMotion` guard added to both project components, mirroring Hero's existing pattern:
  when active, all reveal transforms resolve to their final visible state immediately, no
  scroll-scrub.

## Hero-side touches (narrow)

- Multiply existing entrance durations by ~0.9 (duration values only — no easing/property changes):
  `bgReveal` 0.63→0.57, `titleLine` 0.69→0.62, `riseIn` 0.48→0.43, `lineGrow` 0.36→0.32,
  `footerReveal` 0.6→0.55 (delay 0.87→0.78).
- Bottom dissolve strip (currently a static gradient `div`) becomes a `motion.div`: opacity/height
  ramp up as the existing `scrollYProgress` (from Hero's own `useScroll`) approaches 1, thickening
  the fade right before Projects appears instead of sitting static.

## Seam bridge (ProjectGallery)

- Add a mirrored top gradient overlay: fades from `--color-background` to transparent, opacity
  driven by the section's own `scrollYProgress` (1→0 as the section settles into view). Paired with
  Hero's thickening bottom fade, this creates a genuine cross-dissolve rather than a cut.
- Convert header inner reveals (`lineGrow`, `labelSlide`, `titleWipe`, `countFade`) from
  IntersectionObserver-triggered variants to `useTransform`-driven continuous values off the same
  `scrollYProgress` already driving `headerY`/`headerOpacity` — removing the mixed
  continuous/discrete behavior within the same component.

## ProjectListItem re-choreograph

- Convert `numeralReveal`, `titleReveal`, `subtitleReveal`, `descReveal`,
  `tagReveal`/`tagStagger`, `lineReveal` from IntersectionObserver + one-shot variants to continuous
  `useTransform` mappings off each card's own `scrollYProgress` (extending the pattern already used
  for `imageY`/`imageScale`). Reveals now play forward and reverse with scroll direction.
- Numeral gets a distinct parallax rate from the image for subtle depth separation.
- Hover polish: image scale 1→1.04 alongside existing grayscale/brightness transition; title color
  shifts toward accent on hover.

## Verification

Dev server + manual scroll-through (down and back up): seam reads as one continuous motion, cards
animate in/out smoothly both directions, reduced-motion mode shows static final states, no layout
jank introduced by the added transforms.

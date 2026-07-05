// motionTokens.js — single source of truth for the site's motion language.
// Mirrored as CSS variables (--ease-silk etc.) in index.css for stylesheet use.

export const EASE = {
  // Liquid Silk — the house curve. Fast start, long luxurious glide.
  silk: [0.16, 1, 0.3, 1],
  // Heavy Mass — large containers. Slow start, heavy settle.
  mass: [0.22, 0.61, 0.36, 1],
  // Elastic Snap — micro-interactions. Slight overshoot, tactile pop.
  snap: [0.34, 1.56, 0.64, 1],
  // Whiplash — scroll-driven exits. Aggressive in and out.
  whip: [0.83, 0, 0.17, 1],
};

// Scroll-scrubbed reveals get a touch of lag/life instead of feeling pinned
// 1:1 to the scrollbar.
export const ENTRANCE_SPRING = { stiffness: 120, damping: 30, mass: 0.4 };

// Heavy Silk — for large editorial reveals (project cards). Low stiffness +
// full mass makes the motion trail the scrollbar like weighted fabric; the
// slowness itself is what reads as premium.
export const MASS_SPRING = { stiffness: 55, damping: 22, mass: 1 };

import React from "react";
import { motion } from "framer-motion";

/**
 * RHLogo — Clean geometric SVG monogram of "R H".
 * Uses currentColor so it inherits text color from the parent.
 *
 * When `build` is true, each stroke draws itself in sequence (pathLength
 * 0 → 1) instead of appearing all at once — the logo "assembling" as the
 * last beat of the navbar's load-in sequence.
 *
 * `awaitBuild` controls what happens before `build` flips true: with it on,
 * the mark stays hidden until its turn in the sequence comes (so it doesn't
 * flash fully-drawn on mount and then never visibly animate); with it off
 * (the default, used anywhere the logo isn't part of a sequence — e.g. the
 * mobile menu), it just renders fully drawn immediately.
 */
export default function RHLogo({ className = "", strokeWidth = 2, build = false, awaitBuild = false, onBuildComplete }) {
  const hidden = awaitBuild && !build;
  const stroke = (delay) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: hidden ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 },
    transition: build
      ? { duration: 0.22, ease: "easeInOut", delay }
      : { duration: 0 },
  });

  return (
    <svg
      className={className}
      viewBox="0 0 62 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RH logo"
    >
      {/* ── R ── */}
      {/* Vertical stem */}
      <motion.line
        x1="2" y1="2" x2="2" y2="30"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        {...stroke(0)}
      />
      {/* Bowl */}
      <motion.path
        d="M2 2 H12 C17.5 2 19 5.5 19 8.5 C19 11.5 17.5 14 12 14 H2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...stroke(0.045)}
      />
      {/* Diagonal leg */}
      <motion.line
        x1="11" y1="14" x2="20" y2="30"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        {...stroke(0.09)}
      />

      {/* ── H ── */}
      {/* Left vertical */}
      <motion.line
        x1="30" y1="2" x2="30" y2="30"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        {...stroke(0.12)}
      />
      {/* Right vertical */}
      <motion.line
        x1="48" y1="2" x2="48" y2="30"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        {...stroke(0.155)}
      />
      {/* Crossbar */}
      <motion.line
        x1="30" y1="16" x2="48" y2="16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        {...stroke(0.19)}
      />

      {/* ── Dot accent — lands last, signals the mark is fully assembled ── */}
      <motion.circle
        cx="56" cy="26" r="2.5"
        fill="currentColor"
        initial={{ scale: 0, opacity: 0 }}
        animate={hidden ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={build ? { duration: 0.18, ease: "backOut", delay: 0.26 } : { duration: 0 }}
        onAnimationComplete={build ? onBuildComplete : undefined}
      />
    </svg>
  );
}

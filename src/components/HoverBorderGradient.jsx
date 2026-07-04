"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Simple cn utility for className concatenation
const cn = (...classes) => classes.filter(Boolean).join(" ");

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1.5,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);

  // Optimized gradients with smoother transitions
  const movingMap = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    TOP_RIGHT:
      "radial-gradient(18% 46% at 75% 25%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM_RIGHT:
      "radial-gradient(18% 46% at 75% 75%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM_LEFT:
      "radial-gradient(18% 46% at 25% 75%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    TOP_LEFT:
      "radial-gradient(18% 46% at 25% 25%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  // Silver shiny line gradients - more focused and intense
  const silverMap = {
    TOP: "radial-gradient(28% 60% at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    TOP_RIGHT:
      "radial-gradient(22% 55% at 75% 25%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(22% 55% at 100% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM_RIGHT:
      "radial-gradient(22% 55% at 75% 75%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(28% 60% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM_LEFT:
      "radial-gradient(22% 55% at 25% 75%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(22% 55% at 0% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
    TOP_LEFT:
      "radial-gradient(22% 55% at 25% 25%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 15%, rgba(230, 230, 250, 1) 45%, rgba(255, 255, 255, 0) 100%)",
  };

  // Create sequence based on direction
  const sequence = clockwise
    ? [
        movingMap.TOP,
        movingMap.TOP_RIGHT,
        movingMap.RIGHT,
        movingMap.BOTTOM_RIGHT,
        movingMap.BOTTOM,
        movingMap.BOTTOM_LEFT,
        movingMap.LEFT,
        movingMap.TOP_LEFT,
        movingMap.TOP,
      ]
    : [
        movingMap.TOP,
        movingMap.TOP_LEFT,
        movingMap.LEFT,
        movingMap.BOTTOM_LEFT,
        movingMap.BOTTOM,
        movingMap.BOTTOM_RIGHT,
        movingMap.RIGHT,
        movingMap.TOP_RIGHT,
        movingMap.TOP,
      ];

  // Silver line sequence
  const silverSequence = clockwise
    ? [
        silverMap.TOP,
        silverMap.TOP_RIGHT,
        silverMap.RIGHT,
        silverMap.BOTTOM_RIGHT,
        silverMap.BOTTOM,
        silverMap.BOTTOM_LEFT,
        silverMap.LEFT,
        silverMap.TOP_LEFT,
        silverMap.TOP,
      ]
    : [
        silverMap.TOP,
        silverMap.TOP_LEFT,
        silverMap.LEFT,
        silverMap.BOTTOM_LEFT,
        silverMap.BOTTOM,
        silverMap.BOTTOM_RIGHT,
        silverMap.RIGHT,
        silverMap.TOP_RIGHT,
        silverMap.TOP,
      ];

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border content-center bg-[var(--color-surface)]/20 hover:bg-[var(--color-surface)]/10 transition duration-500 dark:bg-[var(--color-surface)]/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-hidden p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      {/* Base Animated Glow Layer */}
      <motion.div
        initial={{ background: sequence[0] }}
        animate={{
          background: sequence,
        }}
        transition={{
          duration: duration * 4,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
        className="absolute inset-0 z-0"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          filter: "blur(12px)",
          opacity: hovered ? 1 : 0.8,
          pointerEvents: "none",
          willChange: "background, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
        }}
      />

      {/* Outer glow enhancement */}
      <motion.div
        initial={{ background: sequence[0] }}
        animate={{
          background: sequence,
        }}
        transition={{
          duration: duration * 4,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
        className="absolute z-[-1]"
        style={{
          width: "calc(100% + 4px)",
          height: "calc(100% + 4px)",
          top: "-2px",
          left: "-2px",
          borderRadius: "inherit",
          filter: "blur(16px)",
          opacity: hovered ? 0.6 : 0.4,
          pointerEvents: "none",
          willChange: "background, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
        }}
      />

      {/* Silver Shiny Line - Sharp focused light */}
      <motion.div
        initial={{ background: silverSequence[0] }}
        animate={{
          background: silverSequence,
        }}
        transition={{
          duration: duration * 2.5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
        className="absolute inset-0 z-[2]"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "inherit",
          filter: "blur(0.5px)", // Subtle blur for soft emission
          opacity: 1,
          pointerEvents: "none",
          willChange: "background, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
          mixBlendMode: "screen",
        }}
      />

      {/* Duplicate Silver Shiny Line for layered shine */}
      <motion.div
        initial={{ background: silverSequence[0] }}
        animate={{
          background: silverSequence,
        }}
        transition={{
          duration: duration * 2.5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
        className="absolute z-[3]"
        style={{
          width: "calc(100% + 2px)",
          height: "calc(100% + 2px)",
          top: "-1px",
          left: "-1px",
          borderRadius: "inherit",
          filter: "blur(0.5px)",
          opacity: 1,
          pointerEvents: "none",
          willChange: "background, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
          mixBlendMode: "screen",
        }}
      />

      {/* Silver Emission Glow - Spreading light outside border */}
      <motion.div
        initial={{ background: silverSequence[0] }}
        animate={{
          background: silverSequence,
        }}
        transition={{
          duration: duration * 2.5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
        className="absolute z-[1]"
        style={{
          width: "calc(100% + 12px)",
          height: "calc(100% + 12px)",
          top: "-6px",
          left: "-6px",
          borderRadius: "inherit",
          filter: "blur(8px)", // Spreading glow
          opacity: hovered ? 0.6 : 0.4, // Emission effect
          pointerEvents: "none",
          willChange: "background, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
          mixBlendMode: "screen",
        }}
      />

      {/* Silver Glow Halo - Soft outer glow */}
      <motion.div
        initial={{ background: silverSequence[0] }}
        animate={{
          background: silverSequence,
        }}
        transition={{
          duration: duration * 2.5,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
        className="absolute z-[0]"
        style={{
          width: "calc(100% + 8px)",
          height: "calc(100% + 8px)",
          top: "-4px",
          left: "-4px",
          borderRadius: "inherit",
          filter: "blur(20px)",
          opacity: hovered ? 1 : 0.7,
          pointerEvents: "none",
          willChange: "background, opacity",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
        }}
      />

      {/* Inner Surface Overlay */}
      <div
        className="bg-[var(--color-surface)] absolute z-10 pointer-events-none"
        style={{
          inset: "1px",
          borderRadius: "inherit",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02)",
        }}
      />

      {/* Content */}
      <div
        className={cn(
          "relative w-auto text-[var(--color-text-primary)] z-20 px-4 py-2 rounded-[inherit]",
          className
        )}
      >
        {children}
      </div>
    </Tag>
  );
}

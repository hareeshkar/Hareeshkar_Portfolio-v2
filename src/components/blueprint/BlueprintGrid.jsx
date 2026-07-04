import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * BlueprintGrid - Animated blueprint background with self-drawing lines
 * Creates the aesthetic of an architect's drafting table
 */
const BlueprintGrid = ({
  opacity = 0.08,
  animate = true,
  gridSize = 40,
  className = "",
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    if (animate) {
      // Slight delay to ensure smooth initial render
      animationTimeoutRef.current = setTimeout(() => {
        setShouldAnimate(true);
      }, 100);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        opacity,
        mixBlendMode: "normal",
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full text-accent"
        style={{
          willChange: shouldAnimate ? "opacity" : "auto",
        }}
      >
        <defs>
          {/* Main grid pattern */}
          <pattern
            id="blueprint-grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="2 2"
              initial={
                shouldAnimate
                  ? { pathLength: 0, opacity: 0 }
                  : { pathLength: 1, opacity: 1 }
              }
              animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration: 2,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.5 },
              }}
            />
          </pattern>

          {/* Major grid lines (every 5th line) */}
          <pattern
            id="blueprint-major-grid"
            width={gridSize * 5}
            height={gridSize * 5}
            patternUnits="userSpaceOnUse"
          >
            <motion.path
              d={`M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}`}
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              initial={
                shouldAnimate
                  ? { pathLength: 0, opacity: 0 }
                  : { pathLength: 1, opacity: 1 }
              }
              animate={
                shouldAnimate
                  ? { pathLength: 1, opacity: 0.6 }
                  : { opacity: 0.6 }
              }
              transition={{
                duration: 2.5,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </pattern>

          {/* Radial gradient for vignette effect */}
          <radialGradient id="blueprint-vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="80%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* Base grid */}
        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

        {/* Major grid overlay */}
        <rect width="100%" height="100%" fill="url(#blueprint-major-grid)" />

        {/* Vignette overlay */}
        <rect width="100%" height="100%" fill="url(#blueprint-vignette)" />

        {/* Occasional "drawing" lines that appear randomly */}
        {animate && (
          <>
            <DrawingLine delay={1.5} x1="10%" y1="20%" x2="90%" y2="20%" />
            <DrawingLine delay={2.2} x1="15%" y1="50%" x2="85%" y2="50%" />
            <DrawingLine delay={1.8} x1="30%" y1="10%" x2="30%" y2="90%" />
            <DrawingLine delay={2.5} x1="70%" y1="15%" x2="70%" y2="85%" />
          </>
        )}
      </svg>
    </div>
  );
};

/**
 * DrawingLine - Individual line that "draws" itself across the blueprint
 */
const DrawingLine = ({ x1, y1, x2, y2, delay = 0 }) => {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="5 5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 1, 1, 0],
        opacity: [0, 0.3, 0.3, 0],
      }}
      transition={{
        duration: 4,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 8,
      }}
    />
  );
};

export default BlueprintGrid;

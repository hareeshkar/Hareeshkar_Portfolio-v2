import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, memo } from "react";

// --- Enhanced Timeline Item with Hover Animation ---
const TimelineItem = ({
  year,
  title,
  description,
  isLast,
  index,
  isPathActive,
  setHoveredIndex,
  totalItems,
}) => {
  // Calculate sequential reverse exit delay
  const EXIT_DURATION = 0.4; // Reduced for faster response
  const EXIT_DELAY =
    totalItems && totalItems > 1 ? (totalItems - index - 1) * EXIT_DURATION : 0;

  const prevActiveRef = useRef(isPathActive);
  const contentRef = useRef(null);

  // Track previous state to prevent unnecessary re-renders
  useEffect(() => {
    prevActiveRef.current = isPathActive;
  }, [isPathActive]);

  // Optimized staggered children animation with reduced delays
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06, // Reduced for faster reveal
        delayChildren: 0.15, // Reduced initial delay
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05, // Faster exit stagger
        staggerDirection: -1, // Reverse stagger for smooth exit
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      x: -12, // Reduced movement for subtler effect
      filter: "blur(2px)", // Reduced blur for performance
    },
    visible: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4, // Faster for responsive feel
        ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic for smooth deceleration
      },
    },
    exit: {
      opacity: 0,
      x: -12,
      filter: "blur(2px)",
      transition: {
        duration: 0.3, // Faster exit
        ease: [0.55, 0.085, 0.68, 0.53], // easeInCubic for natural fade
      },
    },
  };

  return (
    <motion.div
      className="relative pl-12 pb-12"
      initial={{ opacity: 1 }}
      style={{
        minHeight: "140px", // Increased for better spacing
        contain: "layout style paint", // Performance optimization
        overflow: "visible", // Prevent ring clipping
      }}
    >
      {/* Animated border ring - polished without glow */}
      <AnimatePresence>
        {isPathActive && (
          <motion.div
            className="absolute w-8 h-8 rounded-full border-2 border-accent/40"
            style={{
              left: "-4px", // Adjusted to prevent left clipping
              top: "2px",
              zIndex: 5,
              willChange: "transform, opacity",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1], // Spring-like ease for polish
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          />
        )}
      </AnimatePresence>

      {/* The timeline dot - ALWAYS VISIBLE */}
      <div className="absolute left-0 top-1.5 w-6 h-6 bg-surface-secondary border-2 border-accent rounded-full flex items-center justify-center z-10">
        <motion.div
          className="w-3 h-3 bg-accent rounded-full"
          animate={{ scale: isPathActive ? 1.2 : 1 }}
          transition={{
            duration: 0.25, // Faster response
            ease: "easeOut",
          }}
          style={{
            willChange: "transform", // GPU acceleration hint
          }}
        />
      </div>

      {/* The static background connecting line - ALWAYS VISIBLE */}
      {!isLast && (
        <div
          className="absolute left-[11px] top-8 h-[calc(100%-1.5rem)] w-0.5 bg-border/30"
          style={{ willChange: "auto" }} // No animation needed
        />
      )}

      {/* The GLOWING animated connecting line */}
      {!isLast && (
        <AnimatePresence mode="wait">
          {isPathActive && (
            <motion.div
              className="absolute left-[11px] top-8 h-full w-0.5 z-[5]"
              style={{
                background:
                  "linear-gradient(to bottom, var(--color-accent), transparent)",
                boxShadow: "0 0 12px 0 var(--color-accent)",
                transformOrigin: "top",
                willChange: "transform", // GPU acceleration
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{
                scaleY: 0,
                opacity: 0,
                transition: {
                  duration: EXIT_DURATION,
                  ease: [0.32, 0, 0.67, 0], // easeInQuad for smooth retraction
                  delay: EXIT_DELAY,
                },
              }}
              transition={{
                duration: 0.5, // Slightly faster
                ease: [0.33, 1, 0.68, 1], // easeOutCubic for smooth expansion
              }}
            />
          )}
        </AnimatePresence>
      )}

      {/* Content with reveal animation - animates in and out smoothly */}
      <div
        ref={contentRef}
        style={{
          minHeight: "100px", // Prevent layout shift
          contain: "layout style paint",
        }}
      >
        <AnimatePresence mode="wait">
          {isPathActive && (
            <motion.div
              key={`timeline-content-${index}`} // Unique key for proper unmounting
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                willChange: "transform, opacity, filter", // GPU acceleration
              }}
            >
              <motion.p
                variants={childVariants}
                className="text-accent text-sm font-medium mb-1"
                style={{ willChange: "transform, opacity, filter" }}
              >
                {year}
              </motion.p>
              <motion.h4
                variants={childVariants}
                className="font-display text-xl text-text-primary mb-2"
                style={{ willChange: "transform, opacity, filter" }}
              >
                {title}
              </motion.h4>
              <motion.p
                variants={childVariants}
                className="text-text-secondary leading-relaxed"
                style={{ willChange: "transform, opacity, filter" }}
              >
                {description}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default memo(TimelineItem);

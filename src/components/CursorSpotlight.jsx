import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CursorSpotlight - Turns the mouse cursor into a diegetic light source
 * Content is hidden in darkness, revealed only by user exploration
 *
 * This creates an interactive "archaeological dig" feeling where users
 * actively discover your story rather than passively consuming it.
 */
const CursorSpotlight = ({
  children,
  spotlightSize = 400,
  intensity = 0.95,
  ambientLight = 0.15,
  smoothing = 20,
  className = "",
}) => {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  // Smooth mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth following
  const springConfig = { damping: smoothing, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        isolation: "isolate", // Create stacking context
      }}
    >
      {/* Content layer - darkened by default */}
      <div
        className="relative z-10"
        style={{
          opacity: isActive ? 0.3 : 1, // Darken when spotlight active
          transition: "opacity 0.6s ease",
        }}
      >
        {children}
      </div>

      {/* Spotlight reveal layer */}
      {isActive && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            mixBlendMode: "lighten",
          }}
        >
          {/* Radial gradient spotlight that follows cursor */}
          <motion.div
            className="absolute w-full h-full"
            style={{
              background: `radial-gradient(
                circle ${spotlightSize}px at var(--spotlight-x) var(--spotlight-y),
                rgba(255, 255, 255, ${intensity}) 0%,
                rgba(255, 255, 255, ${ambientLight}) 50%,
                transparent 100%
              )`,
              "--spotlight-x": smoothX,
              "--spotlight-y": smoothY,
            }}
          />

          {/* Content revealed by spotlight */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              style={{
                clipPath: `circle(${spotlightSize}px at var(--clip-x) var(--clip-y))`,
                "--clip-x": smoothX,
                "--clip-y": smoothY,
              }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}

      {/* Ambient floor lighting (subtle) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(192, 192, 192, 0.05) 0%, transparent 60%)",
          opacity: 0.5,
        }}
      />
    </div>
  );
};

export default CursorSpotlight;

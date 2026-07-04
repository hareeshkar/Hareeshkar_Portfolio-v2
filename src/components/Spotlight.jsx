import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Spotlight = ({
  className = "",
  fill = "rgba(180, 117, 9, 0.5)",
  from = "top-left",
  size = "xlarge",
  blur = 200,
  duration = 2,
  delay = 0.75,
  initialX, // Optional custom initial X
  initialY, // Optional custom initial Y
  finalX, // Optional custom final X
  finalY, // Optional custom final Y
  inView = true, // New prop: controls animation
  onUpdate, // Callback to report position
  onAnimationComplete, // Callback for animation completion
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef(null); // NEW: ref to measure spotlight

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Disable spotlight on mobile for performance
  if (isMobile) return null;

  // Position mappings using viewport units for out-of-viewport start
  const defaultPositions = {
    "top-left": {
      initial: { x: "-100vw", y: "-100vh" },
      final: { x: "-50%", y: "-40%" },
    },
    "top-right": {
      initial: { x: "100vw", y: "-100vh" },
      final: { x: "50%", y: "-40%" },
    },
    "bottom-left": {
      initial: { x: "-100vw", y: "100vh" },
      final: { x: "-50%", y: "40%" },
    },
    "bottom-right": {
      initial: { x: "100vw", y: "100vh" },
      final: { x: "50%", y: "40%" },
    },
  };

  // Use custom positions if provided, otherwise default
  const position = {
    initial: {
      x: initialX !== undefined ? initialX : defaultPositions[from].initial.x,
      y: initialY !== undefined ? initialY : defaultPositions[from].initial.y,
    },
    final: {
      x: finalX !== undefined ? finalX : defaultPositions[from].final.x,
      y: finalY !== undefined ? finalY : defaultPositions[from].final.y,
    },
  };

  // Size mappings - reduced sizes for shorter length
  const sizes = {
    small: "h-[100%] w-[80%]", // Reduced
    medium: "h-[120%] w-[100%]", // Reduced
    large: "h-[150%] w-[120%] lg:w-[100%]", // Reduced from previous
    xlarge: "h-[180%] w-[140%] lg:w-[110%]", // Reduced for shorter length
  };

  return (
    <motion.svg
      ref={svgRef}
      className={`pointer-events-none absolute z-[1] ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
      initial={{
        opacity: 0,
        x: position.initial.x,
        y: position.initial.y,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: position.final.x,
              y: position.final.y,
            }
          : {
              opacity: 0,
              x: position.initial.x,
              y: position.initial.y,
            }
      }
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onUpdate={(latest) => {
        if (onUpdate && svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          onUpdate({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            radius: rect.width * 0.12, // approximate effective reveal radius
          });
        }
      }}
      onAnimationComplete={() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }}
      style={{
        willChange: "transform, opacity",
        mixBlendMode: "screen",
      }}
    >
      <defs>
        <filter
          id={`spotlight-filter-${from}`}
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation={blur} result="effect1_foregroundBlur" />
        </filter>
      </defs>
      <g filter={`url(#spotlight-filter-${from})`}>
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="1"
        />
      </g>
    </motion.svg>
  );
};

export default Spotlight;

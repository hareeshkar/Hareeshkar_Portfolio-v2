import React from "react";
import { motion } from "framer-motion";

/**
 * AnnotationLines - Technical specification lines that connect elements
 * Creates the feeling of architectural annotations on a blueprint
 */
const AnnotationLines = ({
  isActive = false,
  fromRef,
  toRefs = [],
  color = "var(--color-accent)",
  className = "",
}) => {
  const [lines, setLines] = React.useState([]);

  React.useEffect(() => {
    if (!fromRef?.current || toRefs.length === 0 || !isActive) {
      setLines([]);
      return;
    }

    const updateLines = () => {
      const fromRect = fromRef.current.getBoundingClientRect();
      const fromX = fromRect.left + fromRect.width / 2;
      const fromY = fromRect.top + fromRect.height / 2;

      const newLines = toRefs
        .map((toRef, index) => {
          if (!toRef?.current) return null;

          const toRect = toRef.current.getBoundingClientRect();
          const toX = toRect.left + toRect.width / 2;
          const toY = toRect.top + toRect.height / 2;

          return {
            id: index,
            x1: fromX,
            y1: fromY,
            x2: toX,
            y2: toY,
            length: Math.hypot(toX - fromX, toY - fromY),
          };
        })
        .filter(Boolean);

      setLines(newLines);
    };

    updateLines();

    // Update on resize/scroll
    const handleUpdate = () => requestAnimationFrame(updateLines);
    window.addEventListener("resize", handleUpdate, { passive: true });
    window.addEventListener("scroll", handleUpdate, { passive: true });

    return () => {
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("scroll", handleUpdate);
    };
  }, [isActive, fromRef, toRefs]);

  if (!isActive || lines.length === 0) return null;

  return (
    <svg
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
      style={{
        width: "100vw",
        height: "100vh",
        mixBlendMode: "lighten",
      }}
    >
      <defs>
        {/* Arrow marker for line ends */}
        <marker
          id="annotation-arrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill={color} opacity="0.6" />
        </marker>

        {/* Dashed pattern for technical look */}
        <pattern
          id="dash-pattern"
          patternUnits="userSpaceOnUse"
          width="8"
          height="1"
        >
          <rect width="4" height="1" fill={color} opacity="0.4" />
        </pattern>
      </defs>

      {lines.map((line) => (
        <g key={line.id}>
          {/* Main line */}
          <motion.line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#annotation-arrow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: line.id * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Subtle glow effect */}
          <motion.line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="3"
            opacity="0.15"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            exit={{ pathLength: 0 }}
            transition={{
              duration: 0.6,
              delay: line.id * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ filter: "blur(2px)" }}
          />

          {/* Animated "scan line" that travels along the line */}
          <motion.circle
            r="3"
            fill={color}
            opacity="0.8"
            animate={{
              cx: [line.x1, line.x2],
              cy: [line.y1, line.y2],
            }}
            transition={{
              duration: 1.5,
              delay: line.id * 0.08 + 0.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        </g>
      ))}
    </svg>
  );
};

export default AnnotationLines;

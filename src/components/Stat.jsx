// File: /src/components/Stat.jsx

import React, { useEffect, useRef, memo } from "react";
import { motion, useInView, animate } from "framer-motion";

const Stat = ({ number, label }) => {
  const countRef = useRef(null);
  const viewRef = useRef(null);
  const isInView = useInView(viewRef, { once: true, margin: "-100px" });

  // Intelligent parsing of the 'number' prop
  const numericValue = parseInt(String(number).replace(/[^0-9]/g, ""));
  const suffix = String(number).replace(String(numericValue), "") || "";
  const isNumeric = !isNaN(numericValue);

  // The custom counter animation, triggered by visibility
  useEffect(() => {
    if (isInView && isNumeric && countRef.current) {
      const controls = animate(0, numericValue, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1], // A cinematic ease-out curve
        onUpdate(value) {
          if (countRef.current) {
            countRef.current.textContent = Math.round(value).toString();
          }
        },
      });
      // Cleanup function to stop the animation if the component unmounts
      return () => controls.stop();
    }
  }, [isInView, isNumeric, numericValue]);

  // Framer Motion variants for the staggered text reveal of the label
  const labelContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // The delay between each character
        delayChildren: 0.3, // Start this animation slightly after the component appears
      },
    },
  };

  const labelCharVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={viewRef}
      className="text-center"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      style={{
        willChange: "transform, opacity", // GPU hint
      }}
    >
      <div className="font-display text-4xl md:text-5xl text-accent mb-2 flex items-center justify-center">
        {isNumeric ? (
          <>
            <span ref={countRef}>0</span>
            <span>{suffix}</span>
          </>
        ) : (
          <span>{number}</span> // Render non-numeric values directly
        )}
      </div>

      <motion.div
        className="text-sm text-text-secondary uppercase tracking-wider font-medium"
        variants={labelContainerVariants}
      >
        {label.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={labelCharVariants}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default memo(Stat);

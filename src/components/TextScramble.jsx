// TextScramble.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useScramble } from "./useScramble";

const TextScramble = ({
  text,
  title,
  as: Component = "span",
  className = "",
  // Triggers: "hover" | "inView" | "inViewAndHover" | "always" | "alwaysAndHover" | "manualAndHover"
  trigger = "hover",
  replayOnView = false, // If true, animation runs every time element enters viewport
  speed = 50,
  accentColor = "var(--color-accent)",
  baseColor = "var(--color-text-secondary)",
  onComplete,
  // For "manualAndHover": flips false -> true to kick off the scramble on
  // command (e.g. once a previous step in a load-in sequence has finished).
  active = false,
  // Before the scramble has ever started, useScramble's `display` equals the
  // final text — so without this, a "manualAndHover" element sits fully
  // visible from the first frame, even though it hasn't had its turn yet
  // in a load-in sequence. Set true to keep it invisible until it starts.
  startHidden = false,
  ...rest
}) => {
  const content = text || title || "";
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(
    trigger === "always" || trigger === "alwaysAndHover"
  );

  // 1. Viewport Detection
  const isInView = useInView(ref, {
    once: !replayOnView, // If replay is on, we keep listening
    amount: 0.5,
    margin: "0px 0px -10% 0px",
  });

  // 2. The Brain (Hook)
  const { display, play, stop, finished } = useScramble({
    text: content,
    speed,
    startOnMount: trigger === "always" || trigger === "alwaysAndHover",
  });

  // 3. Handle Auto-Triggering (Scroll)
  useEffect(() => {
    const isAutoTrigger = trigger === "inView" || trigger === "inViewAndHover";

    if (isInView && isAutoTrigger) {
      play();
    }
  }, [isInView, trigger, play]);

  // Report back to orchestrating parents (e.g. the navbar intro sequence)
  // exactly when the scramble locks in, rather than making them guess a delay.
  useEffect(() => {
    if (finished && onComplete) onComplete();
  }, [finished, onComplete]);

  // Fire on command when a parent flips `active` from false -> true — this
  // is how a step later in a sequence (e.g. "Contact") waits its turn
  // instead of scrambling in immediately on mount like "always" does.
  const prevActiveRef = useRef(active);
  useEffect(() => {
    if (active && !prevActiveRef.current) {
      play();
      setHasStarted(true);
    }
    prevActiveRef.current = active;
  }, [active, play]);

  // 4. Handle Manual Interaction (Hover)
  const handleMouseEnter = () => {
    // Allow hover to replay for any trigger that opts into hover behavior
    if (
      trigger === "hover" ||
      trigger === "inViewAndHover" ||
      trigger === "alwaysAndHover" ||
      trigger === "manualAndHover"
    ) {
      play();
      setHasStarted(true);
    }
  };

  const handleMouseLeave = () => {
    // Only stop mid-way if it's strictly a hover effect.
    // For hybrid modes, it feels more premium to let it finish.
    if (trigger === "hover") {
      stop();
    }
  };

  const isWaitingToStart = startHidden && !hasStarted;

  return (
    <Component
      ref={ref}
      className={`relative inline-block overflow-hidden whitespace-pre transition-opacity duration-150 ${
        isWaitingToStart ? "opacity-0 pointer-events-none" : "opacity-100"
      } ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={content}
      {...rest}
    >
      <span aria-hidden="true" className="relative z-10">
        {display.split("").map((char, i) => {
          const finalChar = content[i];
          const isRevealed = char === finalChar; // Character is locked in

          return (
            <motion.span
              key={i}
              style={{ display: "inline-block" }}
              animate={{
                color: isRevealed || finished ? accentColor : baseColor,
                opacity: isRevealed || finished ? 1 : 0.6, // Dim the scrambling chars
                y: isRevealed ? 0 : [0, -1, 1, 0], // Subtle micro-shake while scrambling
              }}
              transition={{
                duration: isRevealed ? 0.5 : 0.11, // Slower reveal, slightly slower shake
                ease: isRevealed ? "backOut" : "linear",
              }}
            >
              {char}
            </motion.span>
          );
        })}
      </span>

      {/* Progress / Underline Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: finished ? 1 : 0 }}
        style={{ backgroundColor: accentColor }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </Component>
  );
};

export default TextScramble;

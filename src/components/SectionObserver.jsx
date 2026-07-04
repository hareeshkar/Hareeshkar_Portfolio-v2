// File: /src/components/SectionObserver.jsx

import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useParticles } from "./ParticleContext";

export default function SectionObserver({
  children,
  configKey,
  threshold = 0.2, // REFINED: Lower threshold for earlier detection
}) {
  const { setParticleConfig } = useParticles();
  const timeoutRef = useRef(null);
  const lastAppliedConfigRef = useRef(null);
  const hasTriggeredRef = useRef(false); // Track if we've already triggered for this config

  const { ref, inView } = useInView({
    threshold: threshold,
    triggerOnce: false,
    // Trigger when section is visible in viewport
    rootMargin: "-20% 0px -30% 0px", // More aggressive detection window
  });

  useEffect(() => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (inView) {
      // Only apply config if it's different from the last applied one
      // and we haven't already triggered this config during this visibility
      if (
        lastAppliedConfigRef.current !== configKey &&
        !hasTriggeredRef.current
      ) {
        // Use minimal delay to avoid jank
        timeoutRef.current = setTimeout(() => {
          if (lastAppliedConfigRef.current !== configKey) {
            console.log(`[SectionObserver] Switching to config: ${configKey}`);
            setParticleConfig(configKey);
            lastAppliedConfigRef.current = configKey;
            hasTriggeredRef.current = true;
          }
        }, 50); // REFINED: Minimal delay for snappier response
      }
    } else {
      // Section left view - reset trigger flag
      hasTriggeredRef.current = false;
      lastAppliedConfigRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [inView, configKey, setParticleConfig]);

  return <div ref={ref}>{children}</div>;
}

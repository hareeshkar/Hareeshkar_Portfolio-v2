import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext(null);

/**
 * Custom hook to access the Lenis instance
 * @returns {React.RefObject<Lenis>} Lenis instance ref
 */
export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    console.warn("useLenis must be used within a LenisProvider");
  }
  return context;
};

/**
 * Provider component for Lenis smooth scrolling
 * Manages Lenis lifecycle and exposes it via context
 */
export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Enhanced Lenis config with better physics
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 5), // easeOutQuint for smooth deceleration
      direction: "vertical",
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 2.0, // Slightly reduced for more control
      wheelMultiplier: 1.1, // More refined wheel scrolling
      infinite: false,
      syncTouch: false, // Prevents conflict between touch and Lenis
    });

    lenisRef.current = lenis;

    // RAF loop for Lenis - properly manages scroll physics
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
};

/**
 * Helper hook for smooth scrolling to targets
 * Intelligently handles scrolling with proper offset calculation and physics
 * @returns {Function} scrollTo function with dynamic duration and smooth easing
 */
export const useLenisScroll = () => {
  const lenisRef = useLenis();

  const scrollTo = (target, opts = {}) => {
    const { offset = 0, duration: customDuration, easing: customEasing } = opts;

    try {
      if (!lenisRef?.current) {
        // Fallback to native scroll
        if (typeof target === "string") {
          const el = document.querySelector(target);
          if (el) {
            const offsetTop =
              el.getBoundingClientRect().top + window.scrollY + offset;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
          }
        } else if (typeof target === "number") {
          window.scrollTo({ top: target + offset, behavior: "smooth" });
        }
        return;
      }

      const currentY = window.scrollY;
      let targetY = 0;

      // Calculate target position based on input type
      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (!el) {
          console.warn(`Element not found: ${target}`);
          return;
        }
        // Get accurate position: getBoundingClientRect for better accuracy
        targetY = el.getBoundingClientRect().top + window.scrollY + offset;
      } else if (typeof target === "number") {
        targetY = target + offset;
      }

      // Clamp target to valid scroll range
      targetY = Math.max(
        0,
        Math.min(
          targetY,
          document.documentElement.scrollHeight - window.innerHeight
        )
      );

      const distance = Math.abs(targetY - currentY);

      // Smart duration calculation: longer distances = longer duration (but capped)
      // This maintains physics consistency while preventing too-fast or too-slow scrolls
      const calculatedDuration = Math.min(4, Math.max(0.8, distance / 500));
      const finalDuration = customDuration ?? calculatedDuration;

      // Use custom easing if provided, otherwise use smooth cubic easing
      const finalEasing =
        customEasing ??
        ((t) => {
          // Smooth cubic ease-in-out for consistent physics
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        });

      // Scroll without lock to prevent jarring interruption
      lenisRef.current.scrollTo(targetY, {
        duration: finalDuration,
        easing: finalEasing,
        // Don't use lock: true as it can cause jarring when interrupted
        immediate: false,
      });
    } catch (err) {
      console.error("Scroll error:", err);
      // Graceful fallback to native behavior
      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          const offsetTop =
            el.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      } else if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "smooth" });
      }
    }
  };

  return scrollTo;
};

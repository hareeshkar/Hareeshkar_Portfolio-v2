import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Spring config for smooth tilt effect
const defaultSpringValues = {
  stiffness: 150,
  damping: 20,
  mass: 1.2,
};

// Reduced motion for low-end devices
const lowEndSpringValues = {
  stiffness: 100,
  damping: 25,
  mass: 1.5,
};

const TiltedImage = ({
  src,
  alt,
  enableTilt = true,
  springValues = defaultSpringValues,
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const rafIdRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // Device detection with memoization
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Optimized spring values based on device capability
  const isLowEnd = navigator.hardwareConcurrency <= 4 || isTouchDevice;
  const optimizedSpring = isLowEnd ? lowEndSpringValues : springValues;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Reduced rotation range for better performance
  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);

  const springRotateX = useSpring(rotateX, optimizedSpring);
  const springRotateY = useSpring(rotateY, optimizedSpring);
  const springScale = useSpring(1, optimizedSpring);

  // Throttled mouse tracking
  const handleMouseMove = useCallback(
    (e) => {
      if (!enableTilt || isReducedMotion || isTouchDevice || !ref.current)
        return;

      const now = performance.now();
      const throttle = isLowEnd ? 32 : 16; // 30fps or 60fps

      if (now - lastUpdateRef.current < throttle) return;

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
        lastUpdateRef.current = now;
        rafIdRef.current = null;
      });
    },
    [enableTilt, isReducedMotion, isTouchDevice, x, y, isLowEnd]
  );

  const handleMouseEnter = useCallback(() => {
    if (!enableTilt || isReducedMotion || isTouchDevice) return;
    springScale.set(1.05);
  }, [enableTilt, isReducedMotion, isTouchDevice, springScale]);

  const handleMouseLeave = useCallback(() => {
    if (!enableTilt || isReducedMotion || isTouchDevice) return;
    x.set(0);
    y.set(0);
    springScale.set(1);
  }, [enableTilt, isReducedMotion, isTouchDevice, x, y, springScale]);

  const handleImageLoad = useCallback(() => setImageLoaded(true), []);
  const handleImageError = useCallback(() => setImageError(true), []);

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const shouldTilt = enableTilt && !isReducedMotion && !isTouchDevice;

  return (
    <motion.div
      ref={ref}
      className={`relative w-full h-full rounded-2xl overflow-hidden ${className}`}
      style={{
        perspective: shouldTilt ? "1000px" : "none",
        willChange: shouldTilt ? "transform" : "auto",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      )}
      {imageError && (
        <div className="absolute inset-0 bg-gray-200 rounded-2xl flex items-center justify-center">
          <span className="text-gray-500 text-sm">Image failed to load</span>
        </div>
      )}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg"
        style={{
          rotateX: shouldTilt ? springRotateX : 0,
          rotateY: shouldTilt ? springRotateY : 0,
          scale: shouldTilt ? springScale : 1,
          transformStyle: shouldTilt ? "preserve-3d" : "flat",
          willChange: shouldTilt ? "transform" : "auto",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </motion.div>
  );
};

export default React.memo(TiltedImage);

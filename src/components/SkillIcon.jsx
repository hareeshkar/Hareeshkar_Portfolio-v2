import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import MetallicPaint from "./MetallicShader";
import { processIcon } from "../utils/imageProcessor";
import { useTheme } from "./ThemeContext";

// Precomputed tables for ultra-smooth animations
const SIN_TABLE_SIZE = 1024;
const SIN_TABLE = new Float32Array(SIN_TABLE_SIZE);
for (let i = 0; i < SIN_TABLE_SIZE; i++) {
  SIN_TABLE[i] = Math.sin((i / SIN_TABLE_SIZE) * Math.PI * 2);
}

const fastSin = (t) => SIN_TABLE[Math.floor((t % 1) * SIN_TABLE_SIZE)];

// iOS-style shimmer skeleton with precomputed animations
const IOSShimmerLoader = React.memo(() => {
  const shimmerRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const shimmer = shimmerRef.current;
    if (!shimmer) return;

    shimmer.style.willChange = "transform";
    shimmer.style.contain = "layout style paint";

    const FRAME_TIME = 50; // 20fps for shimmer - sufficient for perception
    let lastUpdate = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - lastUpdate;

      if (elapsed >= FRAME_TIME) {
        lastUpdate = currentTime;
        const animTime = (currentTime - startTimeRef.current) * 0.0008;
        const phase = animTime % 1;
        const x = (phase - 0.35) * 140;
        shimmer.style.transform = `translate3d(${x.toFixed(1)}%, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (shimmer) {
        shimmer.style.willChange = "auto";
        shimmer.style.contain = "auto";
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-full bg-border/6 rounded-xl overflow-hidden"
      style={{
        backfaceVisibility: "hidden",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
      }}
    >
      <div
        ref={shimmerRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(
            100deg,
            transparent 0%,
            transparent 35%,
            rgba(255,255,255,0.5) 50%,
            rgba(255,255,255,0.7) 52%,
            rgba(255,255,255,0.5) 54%,
            transparent 65%,
            transparent 100%
          )`,
          transform: "translate3d(-100%, 0, 0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
});

const SkillIcon = ({ iconSrc, skillName }) => {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme } = useTheme();
  const mountedRef = useRef(true);
  const processingRef = useRef(false);

  // Detect mobile for animation adjustments
  const isMobile = useMemo(
    () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
    []
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!iconSrc || !mountedRef.current || processingRef.current) return;

    processingRef.current = true;
    setIsLoading(true);
    setHasError(false);
    setIsTransitioning(false);

    processIcon(iconSrc)
      .then((result) => {
        if (mountedRef.current && result?.imageData) {
          setIsTransitioning(true);
          requestAnimationFrame(() => {
            setImageData(result.imageData);
            requestAnimationFrame(() => {
              if (mountedRef.current) setIsLoading(false);
            });
          });
        }
      })
      .catch((err) => {
        console.error("Error processing skill icon:", err);
        if (mountedRef.current) {
          setHasError(true);
          setIsLoading(false);
          processingRef.current = false;
        }
      });
  }, [iconSrc]);

  // Memoized shader params with reduced quality for performance
  const shaderParams = useMemo(
    () => ({
      patternScale: 3.2, // Increased for less detail
      refraction: 0.015, // Reduced for performance
      edge: 1.2, // Reduced for smoother edges
      patternBlur: 0.01, // Increased blur for performance
      liquid: 0.05, // Reduced liquid effect
      speed: theme === "light" ? 0.12 : 0.25, // Slower for smoothness
    }),
    [theme]
  );

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.35,
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        willChange: "transform, opacity",
        transform: "translateZ(0)", // compositor promotion per-tile
      }}
    >
      <div
        className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 p-2 bg-surface border border-border rounded-2xl shadow-sm will-change-transform"
        style={{ transform: "translateZ(0)" }} // ensure the card itself is isolated
      >
        {/* Skeleton loader */}
        <motion.div
          initial={false}
          animate={{
            opacity: isLoading ? 1 : 0,
            scale: isLoading ? 1 : 0.97,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className="absolute inset-2"
          style={{ pointerEvents: isLoading ? "auto" : "none" }}
        >
          <IOSShimmerLoader />
        </motion.div>

        {/* Error state */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full bg-border/15 rounded-xl flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-border/30 rounded opacity-50" />
          </motion.div>
        )}

        {/* Actual content with optimized fade */}
        {imageData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: isLoading ? 0 : 1,
              scale: isLoading ? 0.92 : 1,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="w-full h-full"
          >
            <MetallicPaint imageData={imageData} params={shaderParams} />
          </motion.div>
        )}
      </div>
      <p className="text-sm font-medium text-text-secondary">{skillName}</p>
    </motion.div>
  );
};

export default React.memo(
  SkillIcon,
  (prev, next) =>
    prev.iconSrc === next.iconSrc && prev.skillName === next.skillName
);

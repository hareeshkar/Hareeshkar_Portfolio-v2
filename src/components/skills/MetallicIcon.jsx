import React, { useState, useEffect, useMemo, useRef } from "react";
import MetallicPaint from "../MetallicShader";
import { processMetallicIcon } from "../../utils/imageProcessor";

// Device detection for optimal sizing
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isLowEndDevice = navigator.hardwareConcurrency <= 4 || isMobile;

const MetallicIcon = ({ src, alt, className = "" }) => {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer for priority-based loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px", // Start loading slightly before visible
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load icon with worker-based processing
  useEffect(() => {
    if (!isVisible) return;

    let isMounted = true;

    const loadIcon = async () => {
      try {
        setIsLoading(true);
        // Optimized size for small icons: 64px low-end, 96px normal
        const data = await processMetallicIcon(src);
        if (isMounted) {
          setImageData(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn("MetallicIcon processing failed:", error);
        if (isMounted) {
          setImageData(null);
          setIsLoading(false);
        }
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [src, isVisible]);

  // Optimized shader params for small icons with better visual quality
  const shaderParams = useMemo(
    () => ({
      patternScale: 2.5, // Reduced from 3.0 for finer detail
      refraction: 0.018, // Slightly increased for visible effect
      edge: 0.5, // Sharper edge definition
      patternBlur: 0.003, // Reduced blur for sharper patterns
      liquid: 0.04, // Subtle liquid effect
      speed: 0.15, // Slower for smoother animation
    }),
    []
  );

  if (isLoading || !imageData) {
    // Skeleton loader while loading
    return (
      <div
        ref={containerRef}
        className={`${className} relative overflow-hidden bg-[var(--color-surface)]/20 rounded-lg animate-pulse`}
      >
        {!isVisible && <div className="w-full h-full" />}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className} relative overflow-hidden`}>
      <MetallicPaint
        imageData={imageData}
        params={shaderParams}
        renderSize={isLowEndDevice ? 64 : 96}
      />
    </div>
  );
};

export default MetallicIcon;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * RenderEffect - Transforms wireframe/blueprint images into full-color renders
 * Creates the feeling of finalizing an architectural rendering
 */
const RenderEffect = ({
  colorImage,
  wireframeImage = null,
  alt = "",
  className = "",
  renderOnHover = true,
  autoRender = false,
  autoRenderDelay = 2000,
  transitionDuration = 1.2,
  easingFunction = [0.22, 1, 0.36, 1],
}) => {
  const [isRendered, setIsRendered] = useState(autoRender);
  const [imageLoaded, setImageLoaded] = useState(false);
  const autoRenderTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Generate wireframe version if not provided
  const useGeneratedWireframe = !wireframeImage;

  useEffect(() => {
    if (autoRender && !renderOnHover) {
      autoRenderTimeoutRef.current = setTimeout(() => {
        setIsRendered(true);
      }, autoRenderDelay);
    }

    return () => {
      if (autoRenderTimeoutRef.current) {
        clearTimeout(autoRenderTimeoutRef.current);
      }
    };
  }, [autoRender, autoRenderDelay, renderOnHover]);

  const handleMouseEnter = () => {
    if (renderOnHover) {
      setIsRendered(true);
    }
  };

  const handleMouseLeave = () => {
    if (renderOnHover) {
      setIsRendered(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        willChange: renderOnHover ? "transform" : "auto",
      }}
    >
      {/* Base color image */}
      <img
        src={colorImage}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Wireframe/blueprint overlay */}
      {imageLoaded && (
        <>
          {useGeneratedWireframe ? (
            // CSS-generated wireframe effect
            <WireframeOverlay
              isRendered={isRendered}
              transitionDuration={transitionDuration}
              easingFunction={easingFunction}
            />
          ) : (
            // Custom wireframe image
            <motion.img
              src={wireframeImage}
              alt={`${alt} wireframe`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 1 }}
              animate={{ opacity: isRendered ? 0 : 1 }}
              transition={{
                duration: transitionDuration,
                ease: easingFunction,
              }}
              style={{
                mixBlendMode: "multiply",
              }}
            />
          )}

          {/* Rendering progress indicator */}
          {renderOnHover && (
            <RenderingProgress
              isRendered={isRendered}
              duration={transitionDuration}
            />
          )}
        </>
      )}

      {/* Blueprint corner markers (always visible for aesthetic) */}
      <BlueprintCorners opacity={isRendered ? 0.2 : 0.5} />
    </div>
  );
};

/**
 * CSS-generated wireframe effect overlay
 */
const WireframeOverlay = ({
  isRendered,
  transitionDuration,
  easingFunction,
}) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isRendered ? 0 : 0.85 }}
      transition={{
        duration: transitionDuration,
        ease: easingFunction,
      }}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(192, 192, 192, 0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(192, 192, 192, 0.15) 1px, transparent 1px),
          linear-gradient(135deg, transparent 48%, rgba(192, 192, 192, 0.3) 49%, rgba(192, 192, 192, 0.3) 51%, transparent 52%)
        `,
        backgroundSize: "20px 20px, 20px 20px, 40px 40px",
        mixBlendMode: "overlay",
        filter: "contrast(1.2) brightness(0.9)",
      }}
    >
      {/* Scan lines for extra technical feel */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(192, 192, 192, 0.03) 2px, rgba(192, 192, 192, 0.03) 4px)",
        }}
        animate={{
          backgroundPosition: isRendered ? ["0% 0%", "0% 100%"] : "0% 0%",
        }}
        transition={{
          duration: transitionDuration,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};

/**
 * Rendering progress indicator
 */
const RenderingProgress = ({ isRendered, duration }) => {
  return (
    <motion.div
      className="absolute bottom-3 right-3 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isRendered ? [0, 1, 1, 0] : 0 }}
      transition={{
        duration: duration,
        times: [0, 0.1, 0.9, 1],
        ease: "easeInOut",
      }}
    >
      <div className="bg-surface/90 backdrop-blur-sm border border-accent/30 rounded-md px-3 py-1.5 flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-accent"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span className="text-xs text-accent font-medium uppercase tracking-wide">
          {isRendered ? "Rendering..." : "Blueprint"}
        </span>
      </div>
    </motion.div>
  );
};

/**
 * Blueprint corner markers for authentic architectural feel
 */
const BlueprintCorners = ({ opacity = 0.5 }) => {
  const cornerSize = 12;
  const cornerClass = "absolute border-accent";

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {/* Top-left */}
      <div
        className={`${cornerClass} border-t-2 border-l-2 top-2 left-2`}
        style={{ width: cornerSize, height: cornerSize }}
      />
      {/* Top-right */}
      <div
        className={`${cornerClass} border-t-2 border-r-2 top-2 right-2`}
        style={{ width: cornerSize, height: cornerSize }}
      />
      {/* Bottom-left */}
      <div
        className={`${cornerClass} border-b-2 border-l-2 bottom-2 left-2`}
        style={{ width: cornerSize, height: cornerSize }}
      />
      {/* Bottom-right */}
      <div
        className={`${cornerClass} border-b-2 border-r-2 bottom-2 right-2`}
        style={{ width: cornerSize, height: cornerSize }}
      />
    </div>
  );
};

export default RenderEffect;

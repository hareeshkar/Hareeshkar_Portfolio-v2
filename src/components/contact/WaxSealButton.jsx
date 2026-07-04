import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WaxSealButton - Submit button with wax seal stamp animation
 * States: "Send Message" → "Sealing..." → "Message Delivered"
 */
const WaxSealButton = ({
  onClick,
  isLoading = false,
  isSuccess = false,
  disabled = false,
  className = "",
  children = "Send Message",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile("ontouchstart" in window);
    };
    checkMobile();
  }, []);

  // Determine button state
  const getButtonState = () => {
    if (isSuccess) return "success";
    if (isLoading) return "loading";
    return "idle";
  };

  const buttonState = getButtonState();

  // Button text based on state
  const getButtonText = () => {
    switch (buttonState) {
      case "loading":
        return "Sealing...";
      case "success":
        return "Message Delivered";
      default:
        return children;
    }
  };

  return (
    <motion.button
      type="submit"
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`btn btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden isolate ${className}`}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      style={{ willChange: "transform" }}
    >
      {/* Success state background glow - optimized */}
      {buttonState === "success" && (
        <motion.div
          className="absolute inset-0 bg-green-500/20 rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{ zIndex: 0 }}
        />
      )}

      {/* Background shimmer effect - disabled on mobile for performance */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-[inherit]"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered && !isLoading ? "100%" : "-100%" }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          style={{ zIndex: 1, willChange: "transform" }}
        />
      )}

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {/* Animated icon based on state */}
        <AnimatePresence mode="wait">
          {buttonState === "loading" && (
            <motion.div
              key="loading"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <LoadingSpinner />
            </motion.div>
          )}

          {buttonState === "success" && (
            <motion.div
              key="success"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <WaxSealStamp />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button text */}
        <motion.span
          key={buttonState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {getButtonText()}
        </motion.span>
      </div>
    </motion.button>
  );
};

/**
 * LoadingSpinner - Animated spinner for loading state
 */
const LoadingSpinner = () => (
  <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none">
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0, rotate: 0 }}
      animate={{
        pathLength: [0, 0.8, 0],
        rotate: 360,
      }}
      transition={{
        pathLength: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
      }}
      style={{
        strokeDasharray: "1, 150",
        strokeDashoffset: "0",
      }}
    />
  </svg>
);

/**
 * WaxSealStamp - Animated wax seal with checkmark
 */
const WaxSealStamp = () => (
  <svg className="w-6 h-6 text-current" viewBox="0 0 24 24" fill="none">
    {/* Seal circle */}
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    />

    {/* Inner decorative circle */}
    <motion.circle
      cx="12"
      cy="12"
      r="7"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.5"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    />

    {/* Checkmark */}
    <motion.path
      d="M8 12l2.5 2.5L16 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.3,
        ease: "easeOut",
      }}
    />
  </svg>
);

export default WaxSealButton;

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureField from "./SignatureField";
import WaxSealButton from "./WaxSealButton";

// --- REUSABLE INPUT WRAPPER WITH FOCUS ANIMATION ---
const InputGroup = ({ label, id, children }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      // These variants hook into the parent's stagger
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      <label
        htmlFor={id}
        className={`block font-mono-tech text-xs uppercase tracking-widest mb-2 transition-colors duration-300 ${
          isFocused
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-secondary)]"
        }`}
      >
        {label}
      </label>

      <div
        className="relative"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {children}

        {/* The animated bottom border line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-border)]" />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--color-accent)] origin-center"
        />
      </div>
    </motion.div>
  );
};

// --- CORNER MARKERS THAT DRAW THEMSELVES ---
const CornerMarkers = () => {
  const lineVariant = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
      {/* Top Left */}
      <svg className="absolute top-0 left-0 w-4 h-4" viewBox="0 0 16 16">
        <motion.path
          d="M1 12 V1 H12"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          variants={lineVariant}
        />
      </svg>
      {/* Top Right */}
      <svg className="absolute top-0 right-0 w-4 h-4" viewBox="0 0 16 16">
        <motion.path
          d="M4 1 H15 V12"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          variants={lineVariant}
        />
      </svg>
      {/* Bottom Left */}
      <svg className="absolute bottom-0 left-0 w-4 h-4" viewBox="0 0 16 16">
        <motion.path
          d="M1 4 V15 H12"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          variants={lineVariant}
        />
      </svg>
      {/* Bottom Right */}
      <svg className="absolute bottom-0 right-0 w-4 h-4" viewBox="0 0 16 16">
        <motion.path
          d="M4 15 H15 V4"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          variants={lineVariant}
        />
      </svg>
    </div>
  );
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isMobile = useMemo(() => {
    if (typeof window !== "undefined") return window.innerWidth <= 768;
    return false;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 2000);
  };

  // --- MASTER ANIMATION ORCHESTRATOR ---
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // Snappier ease
      },
    },
  };

  const contentReveal = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <div className="relative">
      {/* Background Glow - REMOVED */}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={containerVariants}
        className="relative bg-transparent backdrop-blur-xl border border-[var(--color-border)]/50 p-6 md:p-10 rounded-lg overflow-hidden shadow-2xl"
        style={{ willChange: "transform, opacity" }}
      >
        {/* Animated SVG Corners */}
        <CornerMarkers />

        {/* Header Section */}
        <div className="mb-10 flex items-center justify-between relative z-10">
          <motion.h3
            variants={contentReveal}
            className="font-cinzel text-lg md:text-xl text-[var(--color-text-primary)]"
          >
            START HERE
          </motion.h3>
          <motion.div
            variants={contentReveal}
            className="flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-text-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-text-primary)] shadow-lg shadow-[var(--color-text-primary)]/50"></span>
            </span>
            <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-widest">
              AVAILABLE
            </span>
          </motion.div>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <InputGroup id="name" label="Your Name / Blueprint Owner">
            <SignatureField
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Who leads this project?"
              className="bg-transparent border-none rounded-none px-0 w-full outline-none text-[var(--color-text-primary)]"
            />
          </InputGroup>

          <InputGroup id="email" label="Primary Channel">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@company.com"
              className="w-full bg-transparent border-none py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:outline-none transition-colors font-mono-tech text-sm"
            />
          </InputGroup>

          <InputGroup id="message" label="Project Outline">
            <textarea
              id="message"
              name="message"
              rows="4"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="What are we building? Vision, scope, timeline..."
              className="w-full bg-transparent border-none py-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:outline-none transition-colors resize-none font-sans text-base leading-relaxed"
            />
          </InputGroup>

          <motion.div variants={contentReveal} className="pt-4">
            <WaxSealButton
              isLoading={status === "sending"}
              isSuccess={status === "success"}
              disabled={status === "sending"}
              className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-hover)] border-none rounded-sm shadow-lg shadow-[var(--color-accent)]/10"
            >
              INITIATE BUILD
            </WaxSealButton>
          </motion.div>

          {/* Status Messages - Layout animation ensures smooth resizing */}
          <motion.div layout>
            <AnimatePresence mode="wait">
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-500 text-xs font-mono-tech pt-4"
                >
                  ERROR: {errorMessage}
                </motion.div>
              )}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-green-500 text-xs font-mono-tech pt-4"
                >
                  BLUEPRINT RECEIVED. FOUNDATION LAID. EXPECT RESPONSE WITHIN 24
                  HOURS.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;

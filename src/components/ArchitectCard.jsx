import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import "./ArchitectCard.css";
import { useLenisScroll } from "../contexts/LenisContext";
import TextScramble from "./TextScramble";

// --- CORNER ACCENT COMPONENT ---
// Renders the high-end L-brackets with a "drawn" animation effect
const TechBracket = ({ position = "top-left", delay = 0 }) => {
  const isTop = position.includes("top");
  const isLeft = position.includes("left");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute w-12 h-12 pointer-events-none z-20 mix-blend-screen
        ${isTop ? "-top-3" : "-bottom-3"}
        ${isLeft ? "-left-3" : "-right-3"}
      `}
    >
      {/* The Horizontal Line */}
      <div
        className={`absolute h-[2px] bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]
          ${isTop ? "top-0" : "bottom-0"}
          ${isLeft ? "left-0" : "right-0"}
        `}
        style={{ width: "100%" }}
      />
      {/* The Vertical Line */}
      <div
        className={`absolute w-[2px] bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]
          ${isTop ? "top-0" : "bottom-0"}
          ${isLeft ? "left-0" : "right-0"}
        `}
        style={{ height: "100%" }}
      />

      {/* Decorative Vertex Block (The "Join") */}
      <div
        className={`absolute w-1.5 h-1.5 bg-[var(--color-text-primary)] border border-[var(--color-accent)]
          ${isTop ? "-top-0.5" : "-bottom-0.5"}
          ${isLeft ? "-left-0.5" : "-right-0.5"}
        `}
      />
    </motion.div>
  );
};

const ArchitectCard = ({
  name = "JOHN DOE",
  title = "SYSTEM ARCHITECT",
  handle = "johndoe_dev",
  avatarUrl = "https://via.placeholder.com/600x800",
}) => {
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const rafId = useRef(null);
  const scrollTo = useLenisScroll();

  // Enhanced Linear interpolation for ultra-smooth mouse follow
  const damping = 0.12; // Increased from 0.06 for more responsive tracking
  const currentMouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  // Mobile Logic
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const animate = useCallback(() => {
    // Lerp current position towards target
    const lx =
      currentMouse.current.x +
      (targetMouse.current.x - currentMouse.current.x) * damping;
    const ly =
      currentMouse.current.y +
      (targetMouse.current.y - currentMouse.current.y) * damping;

    currentMouse.current = { x: lx, y: ly };

    if (cardRef.current) {
      // Enhanced 3D rotation ranges for dramatic depth
      const rotateX = (ly * -15).toFixed(3); // Increased from -8 to -15deg
      const rotateY = (lx * 15).toFixed(3); // Increased from 8 to 15deg
      const rotateZ = (lx * ly * 5).toFixed(3); // NEW: Z-axis twist based on both axes

      cardRef.current.style.setProperty("--rotate-x", `${rotateX}deg`);
      cardRef.current.style.setProperty("--rotate-y", `${rotateY}deg`);
      cardRef.current.style.setProperty("--rotate-z", `${rotateZ}deg`);

      // Enhanced Dynamic Lighting Calculations with more precision
      const pointerXPercent = (lx + 0.5) * 100;
      const pointerYPercent = (ly + 0.5) * 100;

      cardRef.current.style.setProperty("--pointer-x", `${pointerXPercent}%`);
      cardRef.current.style.setProperty("--pointer-y", `${pointerYPercent}%`);

      // Multi-layered Parallax Depth Calculations for enhanced 3D effect
      const parallaxUltraFast = (lx * 60).toFixed(2); // NEW: Ultra-fast layer
      const parallaxFast = (lx * 35).toFixed(2); // Increased from 40
      const parallaxMedium = (lx * 15).toFixed(2); // NEW: Medium layer
      const parallaxSlow = (lx * 8).toFixed(2); // Reduced from 20 for subtle depth

      // Vertical parallax for more 3D immersion
      const parallaxYUltraFast = (ly * 40).toFixed(2);
      const parallaxYFast = (ly * 25).toFixed(2);
      const parallaxYMedium = (ly * 12).toFixed(2);
      const parallaxYSlow = (ly * 5).toFixed(2);

      cardRef.current.style.setProperty(
        "--parallax-ultra-fast",
        `${parallaxUltraFast}px`
      );
      cardRef.current.style.setProperty("--parallax-fast", `${parallaxFast}px`);
      cardRef.current.style.setProperty(
        "--parallax-medium",
        `${parallaxMedium}px`
      );
      cardRef.current.style.setProperty("--parallax-slow", `${parallaxSlow}px`);

      cardRef.current.style.setProperty(
        "--parallax-y-ultra-fast",
        `${parallaxYUltraFast}px`
      );
      cardRef.current.style.setProperty(
        "--parallax-y-fast",
        `${parallaxYFast}px`
      );
      cardRef.current.style.setProperty(
        "--parallax-y-medium",
        `${parallaxYMedium}px`
      );
      cardRef.current.style.setProperty(
        "--parallax-y-slow",
        `${parallaxYSlow}px`
      );

      // Dynamic scale based on mouse position for breathing effect
      const dynamicScale = (1 + Math.abs(lx * ly) * 0.05).toFixed(3);
      cardRef.current.style.setProperty("--dynamic-scale", dynamicScale);
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, [animate]);

  // Device Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- TOUCH HANDLERS (Mobile Diorama Mode) ---
  const handleTouchStart = useCallback(
    (e) => {
      if (!isMobile) return;
      touchStartY.current = e.touches[0].clientY;
      setIsMobileActive(true);
    },
    [isMobile]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isMobile) return;
      touchEndY.current = e.touches[0].clientY;
    },
    [isMobile]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    const swipeDistance = touchStartY.current - touchEndY.current;

    // Dismiss if swiping, toggle if tapping
    if (Math.abs(swipeDistance) > 30) {
      setIsMobileActive(false);
      if (cardRef.current) {
        cardRef.current.classList.add("mobile-returning");
        setTimeout(() => {
          cardRef.current?.classList.remove("mobile-returning");
        }, 800);
      }
    } else {
      setIsMobileActive((prev) => !prev);
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
  }, [isMobile]);

  useEffect(() => {
    if (!cardRef.current || !isMobile) return;
    if (isMobileActive) {
      cardRef.current.classList.add("mobile-active");
    } else {
      cardRef.current.classList.remove("mobile-active");
    }
  }, [isMobileActive, isMobile]);

  // --- MOUSE HANDLERS (Desktop Parallax) ---
  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      // Normalize coordinate space (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouse.current = { x, y };
    },
    [isMobile]
  );

  const handleMouseLeave = () => {
    targetMouse.current = { x: 0, y: 0 };
  };

  const [firstName, ...lastNameArr] = name.split(" ");
  const lastName = lastNameArr.join(" ");

  return (
    <div
      className="architect-scene"
      ref={sceneRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
    >
      <div className="architect-composition" ref={cardRef}>
        {/* LAYER 0: Ambient Atmosphere */}
        <div className="architect-glow" />

        {/* LAYER 1: Grid Structure (Background Technicals) */}
        <div className="architect-grid-layer">
          <div className="grid-line v1"></div>
          <div className="grid-line v2"></div>
          <div className="grid-line h1"></div>
          <div className="decorative-ref">001</div>
        </div>

        {/* LAYER 2: The Identity Plane (Image + HUD Borders) */}
        <div className="architect-image-plane">
          {/* --- NEW: LUXURY L-BRACKETS --- */}
          {/* Top-Left Gold Bracket */}
          <TechBracket position="top-left" delay={0.2} />

          {/* Bottom-Right Gold Bracket */}
          <TechBracket position="bottom-right" delay={0.4} />

          {/* Additional 'REC' indicator for feed aesthetic */}
          <div className="absolute top-3 right-3 z-30 flex items-center gap-2 pointer-events-none">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
            <span className="font-mono-tech text-[8px] tracking-widest text-[var(--color-text-primary)] opacity-80">
              LIVE_FEED
            </span>
          </div>

          <div className="image-wrapper">
            <div className="image-noise"></div>
            <img src={avatarUrl} alt={name} decoding="async" loading="lazy" />
          </div>

          {/* Original accent border kept as a subtle inner frame */}
          <div className="image-border-accent opacity-40"></div>
        </div>

        {/* LAYER 3: Glass Interface (Information HUD) */}
        <div className="architect-glass-panel">
          {/* Dynamic Shimmer */}
          <div className="glass-shimmer"></div>

          <div className="architect-identity">
            <div className="name-display">
              <span className="name-first font-bold">{firstName}</span>
              <span
                className="name-last relative font-normal"
                style={{ marginBottom: "4px", marginTop: "2px" }}
              >
                {lastName}
                {/* Dynamic underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ marginBottom: "2px" }}
                />
              </span>
            </div>
            <span className="title-role">{title}</span>
          </div>

          <div className="separator-line"></div>

          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-label">ID_REF</span>
              <span className="meta-value text-mono">@{handle}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">SYS_STATUS</span>
              <span className="meta-value text-[#10b981] flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-primary)] animate-pulse"
                  style={{
                    boxShadow:
                      "0 0 8px var(--color-text-primary), 0 0 16px var(--color-text-primary)",
                  }}
                />
                ONLINE
              </span>
            </div>
          </div>

          {/* Interactive Connect Button */}
          <button
            className="group relative px-6 py-3 bg-transparent border border-[var(--color-accent)]/40 text-[var(--color-accent)] font-mono-tech text-xs tracking-[0.2em] overflow-hidden transition-all hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_var(--color-accent-glow)]"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#contact", { offset: -80 });
            }}
          >
            {/* Button Sweep Effect */}
            <span className="absolute inset-0 w-0 bg-[var(--color-accent)] transition-all duration-[0.4s] ease-out group-hover:w-full opacity-10"></span>

            <span className="relative flex items-center gap-2 justify-center">
              <TextScramble
                text="CONNECT_NOW"
                className="text-xs"
                trigger="inViewAndHover"
                speed={30}
                replayOnView={true}
              />
              <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                →
              </span>
            </span>
          </button>
        </div>

        {/* LAYER 4: Floating Decor Elements */}
        <div className="floating-el sq"></div>
      </div>
    </div>
  );
};

export default React.memo(ArchitectCard);

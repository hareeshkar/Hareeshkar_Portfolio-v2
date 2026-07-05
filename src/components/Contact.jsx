import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";
import Spotlight from "./Spotlight";
import TextScramble from "./TextScramble";

// Reusing components from About for consistency
// Note: Ideally these should be in a shared 'ui' folder, but importing from About context for now
// or redefining if they are simple enough to avoid circular deps or complex imports.
// Redefining simple versions here to ensure standalone functionality.

const TechSeparator = () => (
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none -translate-y-[99%]">
    <svg
      className="relative block w-[calc(100%+1.3px)] h-[60px] text-[var(--color-background)] fill-current transform rotate-180"
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
    >
      <path
        d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
        className="opacity-100"
      />
    </svg>
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent" />
  </div>
);

// --- ANIMATION VARIANTS (Hero-pattern) ---
const group = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.155, delayChildren: 0.055 } },
};

const titleLine = {
  hidden: { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)", filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    filter: "blur(0px)",
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.43, ease: [0.16, 1, 0.3, 1] } },
};

const AlchemyTextReveal = ({ children, className, as: Tag = "div" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const rm = shouldReduceMotion;
  const initialState = rm ? "visible" : "hidden";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Disable parallax on mobile for performance
  const y = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -50]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
    };
    checkMobile();
    // rAF-throttled: resize can fire dozens of times per frame during a drag;
    // one measurement per frame is all the parallax gate needs.
    let rafId = null;
    const handleResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        checkMobile();
      });
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen bg-transparent py-10 px-6 overflow-hidden cv-auto"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-accent)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-accent)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05]" />
        {/* Film Grain Texture */}
        <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
      </div>

      {/* Spotlight Effect */}
      <Spotlight
        className="pointer-events-none"
        fill="rgba(163, 136, 72, 0.12)"
        from="top-right"
        size="xlarge"
        blur={200}
        duration={2.5}
        delay={0.5}
      />

      <TechSeparator />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* LEFT COLUMN: Typography & Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="mb-12 lg:mb-0">
              {/* Eyebrow — decode motif, matching Projects/Skills headers */}
              <motion.div
                initial={initialState}
                whileInView="visible"
                viewport={{ once: true }}
                variants={riseIn}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="h-[1px] w-10 bg-[var(--color-accent)]" />
                {rm ? (
                  <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-[0.3em] uppercase">
                    Contact
                  </span>
                ) : (
                  <TextScramble
                    text="Contact"
                    trigger="inViewAndHover"
                    speed={20}
                    className="font-mono-tech text-[10px] tracking-[0.3em] uppercase"
                    accentColor="var(--color-accent)"
                    baseColor="var(--color-accent)"
                  />
                )}
              </motion.div>

              {/* Cinematic Headline with clipPath reveal */}
              <motion.div
                initial={initialState}
                whileInView="visible"
                viewport={{ once: true }}
                variants={group}
                className="font-cinzel text-5xl md:text-6xl lg:text-8xl text-[var(--color-text-primary)] leading-[0.9] mb-6 md:mb-8"
              >
                <motion.span variants={titleLine} className="block">
                  Let's
                </motion.span>
                <motion.span variants={titleLine} className="block">
                  <span className="text-[var(--color-accent)] italic font-cormorant font-light">
                    Build It
                  </span>
                </motion.span>
              </motion.div>

              <AlchemyTextReveal className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-8 md:mb-12">
                <span className="font-semibold text-[var(--color-accent)]">
                  Full-stack systems
                </span>{" "}
                that scale.{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  Web & app products
                </span>{" "}
                built end to end.{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  AI-powered intelligence
                </span>{" "}
                embedded at every layer.{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  Production-grade architecture
                </span>{" "}
                that doesn't just work—
                <span className="text-[var(--color-accent)] font-semibold">
                  performs
                </span>
                . From{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  concept
                </span>{" "}
                to{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  launch
                </span>
                , I build the foundation your product needs.{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  Ready to construct something meaningful?
                </span>
              </AlchemyTextReveal>

              <ContactInfo />
            </div>
          </div>

          {/* RIGHT COLUMN: Form (7 cols) */}
          <motion.div
            style={{ y: isMobile ? 0 : y }}
            className="lg:col-span-7 lg:mt-12"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

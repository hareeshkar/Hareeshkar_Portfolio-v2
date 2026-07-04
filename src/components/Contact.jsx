import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";

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

const AlchemyTextReveal = ({ children, className }) => {
  // Removed state-based animation to prevent hydration mismatch and jumps on mobile
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen bg-transparent py-16 px-6 overflow-hidden"
    >
      {/* Background Atmosphere - REMOVED ALL YELLOW TINTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-accent)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-accent)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.05]" />
        {/* REMOVED: Yellow accent blur backgrounds completely */}
      </div>

      <TechSeparator />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* LEFT COLUMN: Typography & Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="mb-12 lg:mb-0">
              <AlchemyTextReveal className="font-cinzel text-5xl md:text-6xl lg:text-8xl text-[var(--color-text-primary)] leading-[0.9] mb-6 md:mb-8">
                Let's <br />
                <span className="text-[var(--color-accent)] italic font-cormorant font-light">
                  Build It
                </span>
              </AlchemyTextReveal>

              <AlchemyTextReveal className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed mb-8 md:mb-12">
                <span className="font-semibold text-[var(--color-accent)]">
                  Full-stack systems
                </span>{" "}
                that scale.{" "}
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

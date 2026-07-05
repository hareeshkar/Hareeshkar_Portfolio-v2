import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import ProjectListItem from "./ProjectListItem";
import TextScramble from "./TextScramble";
import { ENTRANCE_SPRING } from "../lib/motionTokens";

const ProjectGallery = ({ projects }) => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const rm = shouldReduceMotion;

  // Header choreography is scoped to the header element itself (not the whole, very tall
  // section) so the reveal completes over a natural ~1 viewport of scrolling, regardless
  // of how many project cards follow it. Springed for lag/life, kept linear (no easing
  // curve) — an ease-out curve mapped against scroll position front-loads the reveal into
  // the first sliver of scroll and then just sits there looking finished ("static").
  // Only `transform` (x/y/scaleX) and `opacity` are driven here — both compositor-only;
  // filter/clip-path were dropped since scrubbing those forces a repaint every scroll tick.
  const { scrollYProgress: rawEntrance } = useScroll({
    target: headerRef,
    offset: ["start end", "start 15%"],
  });
  const springedEntrance = useSpring(rawEntrance, ENTRANCE_SPRING);
  const entrance = rm ? rawEntrance : springedEntrance;

  // Seam bridge — mirrors Hero's thickening bottom dissolve with a fade-in-from-background
  // top overlay, so the handoff reads as one continuous cross-dissolve.
  const seamOpacity = useTransform(entrance, [0, 0.3], rm ? [0, 0] : [1, 0]);

  const headerY = useTransform(entrance, [0, 0.55], rm ? [0, 0] : [40, 0]);
  const headerOpacity = useTransform(entrance, [0, 0.35], rm ? [1, 1] : [0, 1]);

  const lineScaleX = useTransform(entrance, [0.05, 0.4], rm ? [1, 1] : [0, 1]);
  const lineOpacity = useTransform(entrance, [0.02, 0.25], rm ? [1, 1] : [0, 1]);

  const labelOpacity = useTransform(entrance, [0.12, 0.4], rm ? [1, 1] : [0, 1]);
  const labelX = useTransform(entrance, [0.12, 0.4], rm ? [0, 0] : [-24, 0]);
  const labelDashScaleX = useTransform(entrance, [0.15, 0.37], rm ? [1, 1] : [0, 1]);

  const titleOpacity = useTransform(entrance, [0.2, 0.55], rm ? [1, 1] : [0, 1]);
  const titleY = useTransform(entrance, [0.2, 0.55], rm ? [0, 0] : [56, 0]);

  const countOpacity = useTransform(entrance, [0.42, 0.7], rm ? [1, 1] : [0, 1]);
  const countY = useTransform(entrance, [0.42, 0.7], rm ? [0, 0] : [10, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-transparent py-16 md:py-20 px-6 md:px-10 overflow-hidden cv-auto"
    >
      {/* Seam bridge — cross-dissolves with Hero's bottom fade */}
      <motion.div
        style={{ opacity: seamOpacity }}
        className="absolute inset-x-0 top-0 h-40 md:h-56 z-[5] bg-gradient-to-b from-[var(--color-background)] to-transparent pointer-events-none"
      />

      {/* Ambient glow — subtle depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-12 md:mb-16"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          {/* Separator line — scroll-linked draw */}
          <motion.div
            style={{ scaleX: lineScaleX, opacity: lineOpacity }}
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent mb-8 origin-left"
          />

          {/* Label */}
          <motion.div
            style={{ opacity: labelOpacity, x: labelX }}
            className="inline-flex items-center gap-3 mb-6 md:mb-8"
          >
            <motion.div
              className="h-[1px] w-10 bg-[var(--color-accent)]"
              style={{ scaleX: labelDashScaleX, originX: 0 }}
            />
            {rm ? (
              <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-[0.3em] uppercase">
                Projects
              </span>
            ) : (
              <TextScramble
                text="Projects"
                trigger="inViewAndHover"
                speed={20}
                className="font-mono-tech text-[10px] tracking-[0.3em] uppercase"
                accentColor="var(--color-accent)"
                baseColor="var(--color-accent)"
              />
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            style={{ opacity: titleOpacity, y: titleY }}
            className="font-cinzel text-[13vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[6vw] leading-[0.88] text-[var(--color-text-primary)] uppercase tracking-tight"
          >
            Selected{" "}
            <span className="font-cormorant italic text-[var(--color-accent)] font-light lowercase">
              Work
            </span>
          </motion.h2>

          {/* Count */}
          <motion.span
            style={{ opacity: countOpacity, y: countY }}
            className="block mt-6 font-mono-tech text-[10px] text-[var(--color-text-secondary)] tracking-[0.25em] uppercase"
          >
            Catalogue &middot; {String(projects.length).padStart(2, "0")} Works
          </motion.span>
        </motion.div>

        {/* Project List — each item drives its own scroll-scrubbed reveal */}
        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectListItem key={index} index={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { EASE } from "../lib/motionTokens";

// --- Image fit mode ---------------------------------------------------------
// "letterbox" (default): fixed staircase frame heights from RECIPES, image shown
//   in full via object-contain (no cropping), dark background fills any gap.
// "aspect": frame height is derived from each image's own natural aspect ratio
//   (measured on load) so the image fills the frame edge-to-edge with zero
//   cropping and zero letterbox padding — the staircase's height rhythm becomes
//   whatever the source images' aspect ratios are.
// Flip this one constant to switch site-wide.
const IMAGE_FIT_MODE = "letterbox"; // "letterbox" | "aspect"

const CORNERS = {
  topLeft: "-top-6 -left-3 md:-top-12 md:-left-8",
  bottomLeft: "-bottom-6 -left-3 md:-bottom-12 md:-left-8",
  topRight: "-top-6 -right-3 md:-top-12 md:-right-8",
  bottomRight: "-bottom-6 -right-3 md:-bottom-12 md:-right-8",
};

const RECIPES = [
  { imgW: "md:w-[52%]", imgH: "h-64 md:h-96", reverse: false, indent: "md:ml-0", corner: "topLeft", numeral: "md:text-[9rem]", title: "md:text-6xl lg:text-7xl", align: "md:items-start" },
  { imgW: "md:w-[24%]", imgH: "h-40 md:h-52", reverse: true, indent: "md:ml-[26%]", corner: "bottomRight", numeral: "md:text-[6rem]", title: "md:text-3xl lg:text-4xl", align: "md:items-center" },
  { imgW: "md:w-[38%]", imgH: "h-52 md:h-72", reverse: false, indent: "md:ml-[8%]", corner: "topLeft", numeral: "md:text-[7.5rem]", title: "md:text-4xl lg:text-5xl", align: "md:items-center" },
  { imgW: "md:w-[20%]", imgH: "h-36 md:h-44", reverse: true, indent: "md:ml-[4%]", corner: "bottomRight", numeral: "md:text-[5.5rem]", title: "md:text-3xl lg:text-4xl", align: "md:items-center" },
  { imgW: "md:w-[47%]", imgH: "h-60 md:h-80", reverse: false, indent: "md:ml-[15%]", corner: "topLeft", numeral: "md:text-[8.5rem]", title: "md:text-5xl lg:text-6xl", align: "md:items-start" },
  { imgW: "md:w-[28%]", imgH: "h-44 md:h-56", reverse: true, indent: "md:ml-0", corner: "bottomRight", numeral: "md:text-[6.5rem]", title: "md:text-3xl lg:text-4xl", align: "md:items-center" },
  { imgW: "md:w-[42%]", imgH: "h-56 md:h-80", reverse: false, indent: "md:ml-[20%]", corner: "topLeft", numeral: "md:text-[7.5rem]", title: "md:text-4xl lg:text-5xl", align: "md:items-center" },
  { imgW: "md:w-[22%]", imgH: "h-40 md:h-48", reverse: true, indent: "md:ml-[9%]", corner: "bottomRight", numeral: "md:text-[6rem]", title: "md:text-3xl lg:text-4xl", align: "md:items-center" },
  { imgW: "md:w-[36%]", imgH: "h-52 md:h-64", reverse: false, indent: "md:ml-[12%]", corner: "topLeft", numeral: "md:text-[7rem]", title: "md:text-4xl lg:text-5xl", align: "md:items-center" },
];

// --- Entrance choreography ---------------------------------------------------
// Triggered, not scrubbed: a scroll-scrubbed entrance plays at whatever tempo
// the user happens to scroll — fast scrollers see it lag, slow scrollers see it
// crawl. Instead each card fires once on viewport entry and plays a designed,
// self-contained cascade at its own tempo (fast start, long silk settle).
// Scrubbing is kept only where it belongs: the continuous parallax depth below.
// All properties are transform/opacity — compositor-only.

const cardReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const imageIn = {
  hidden: { opacity: 0, scale: 1.06, clipPath: "inset(0 0 100% 0)", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0 0 0% 0)",
    filter: "blur(0px)",
    transition: { duration: 1.15, ease: EASE.mass },
  },
};

const numeralIn = {
  hidden: { opacity: 0, scale: 0.88, rotate: -8 },
  visible: {
    opacity: 0.85,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: EASE.silk },
  },
};

// Rises through the overflow-hidden wrapper — the mask reveal, at full opacity
// for a crisp editorial cut rather than a soft fade.
const titleIn = {
  hidden: { y: "108%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: EASE.silk } },
};

const lineIn = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 0.4,
    transition: { duration: 0.7, ease: EASE.silk },
  },
};

const subtitleIn = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE.silk } },
};

const descIn = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 0.85,
    y: 0,
    transition: { duration: 0.65, ease: EASE.silk },
  },
};

const chipRow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const chipIn = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42, ease: EASE.snap } },
};

const TagChip = ({ tech }) => (
  <motion.span
    variants={chipIn}
    className="font-mono-tech text-[10px] tracking-[0.12em] uppercase text-[var(--color-accent)] border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.06] px-2.5 py-1 transition-colors duration-300 group-hover:border-[var(--color-accent)]/70"
  >
    {tech}
  </motion.span>
);

const ProjectListItem = ({ project, index }) => {
  const imageContainerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const rm = shouldReduceMotion;

  // "aspect" mode: measured once the image loads; falls back to the fixed recipe
  // height until then so there's no layout jump.
  const [naturalAspect, setNaturalAspect] = useState(null);
  const handleImageLoad = (e) => {
    if (IMAGE_FIT_MODE !== "aspect") return;
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) setNaturalAspect(naturalWidth / naturalHeight);
  };

  // Continuous parallax across the item's full time in view — the one place
  // scroll-scrubbing stays, because depth should track the scroll 1:1.
  const { scrollYProgress: viewProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(viewProgress, [0, 1], rm ? [0, 0] : [22, -22]);
  const parallaxScale = useTransform(viewProgress, [0, 0.5, 1], rm ? [1, 1, 1] : [1.05, 1, 1.015]);
  // Numeral drifts at its own, faster rate — subtle depth separation from the image.
  const numeralY = useTransform(viewProgress, [0, 1], rm ? [0, 0] : [12, -36]);

  const repo =
    project.githubLink && project.githubLink !== "#"
      ? project.githubLink
      : "https://github.com/hareeshkar";

  const href =
    project.liveLink && project.liveLink !== "#" ? project.liveLink : repo;

  const [heading, subtitle] = project.title.includes("—")
    ? project.title.split("—").map((s) => s.trim())
    : [project.title, null];

  const recipe = RECIPES[index % RECIPES.length];

  const useAspect = IMAGE_FIT_MODE === "aspect";
  const frameClassName = useAspect
    ? "relative w-full overflow-hidden bg-[#0a0a0a] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
    : `relative w-full ${recipe.imgH} overflow-hidden bg-[#0a0a0a] group-hover:scale-[1.04] transition-transform duration-700 ease-out`;
  const frameStyle = useAspect
    ? { aspectRatio: naturalAspect || undefined, minHeight: naturalAspect ? undefined : "10rem" }
    : undefined;
  const imgFitClassName = useAspect ? "object-cover" : "object-contain";

  return (
    <article className="group relative border-t border-[var(--color-border)] first:border-t-0">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        variants={cardReveal}
        initial={rm ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -20% 0px" }}
        className={`flex flex-col ${recipe.reverse ? "md:flex-row-reverse" : "md:flex-row"} ${recipe.align} gap-8 md:gap-16 py-14 md:py-20 px-2 -mx-2 ${recipe.indent} rounded-sm focus-visible:outline-none`}
      >
        {/* Thumbnail */}
        <div
          ref={imageContainerRef}
          className={`relative w-full ${recipe.imgW} shrink-0`}
        >
          {/* Numeral — entrance via variants (opacity/scale), depth via the
              scrubbed parallax MotionValue (y). Disjoint properties, no conflict. */}
          <motion.span
            aria-hidden="true"
            variants={numeralIn}
            style={{
              y: numeralY,
              WebkitTextStroke: "1.5px var(--color-accent)",
            }}
            className={`pointer-events-none select-none absolute ${CORNERS[recipe.corner]} z-10 font-cinzel text-transparent leading-none text-[4.5rem] ${recipe.numeral} drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Entrance wrapper (variants) around the frame — keeps the frame's
              CSS hover scale free of inline transforms from Framer. */}
          <motion.div variants={imageIn}>
            <div className={frameClassName} style={frameStyle}>
              {/* Shimmer sweep on entrance */}
              <motion.div
                initial={{ x: "-100%" }}
                whileInView={{ x: "200%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE.silk, delay: 0.3 }}
                className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              />
              {/* Film grain texture */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-grain opacity-[0.04] mix-blend-overlay" />
              <motion.img
                style={{ y: imageY, scale: parallaxScale }}
                src={project.image}
                alt={project.title}
                loading="lazy"
                onLoad={handleImageLoad}
                className={`w-full h-full ${imgFitClassName} grayscale-[30%] group-hover:grayscale-0 group-hover:brightness-110 transition-[filter] duration-700 ease-out`}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 min-w-0">
          {/* Title with line draw — masked by the overflow-hidden wrapper */}
          <div>
            <div className="overflow-hidden">
              <motion.h3
                variants={titleIn}
                className={`font-cinzel text-3xl ${recipe.title} uppercase text-[var(--color-text-primary)] leading-[0.95] tracking-tight group-hover:text-[var(--color-accent)] transition-colors duration-300 flex items-start justify-between pr-12`}
              >
                <span>{heading}</span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-[var(--color-accent)] opacity-60 group-hover:opacity-100 transition-all duration-300 mt-2 flex-shrink-0 origin-bottom-left group-hover:scale-110">
                  <path d="M7 21L21 7M21 7H11M21 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.h3>
            </div>
            <motion.div
              variants={lineIn}
              className="h-[1px] w-full bg-[var(--color-accent)]/60 mt-3 origin-left"
            />
          </div>

          {subtitle && (
            <motion.p
              variants={subtitleIn}
              className="font-cormorant italic text-[var(--color-text-secondary)] text-base md:text-lg mt-3"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.p
            variants={descIn}
            className="text-[var(--color-text-primary)] text-base leading-relaxed mt-4 max-w-lg"
          >
            {project.description}
          </motion.p>

          {/* Tech Stack — ripples in as the final beat of the cascade */}
          <motion.div variants={chipRow} className="flex flex-wrap gap-2 mt-5">
            {project.techStack.map((tech, i) => (
              <TagChip key={i} tech={tech} />
            ))}
          </motion.div>
        </div>
      </motion.a>
    </article>
  );
};

export default ProjectListItem;

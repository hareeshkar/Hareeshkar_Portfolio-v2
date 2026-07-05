import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import TextScramble from "./TextScramble";
import BentoItem from "./skills/BentoItem";
import MetallicIcon from "./skills/MetallicIcon";
import { preloadIcons } from "../utils/imageProcessor";

// Utility: Tech Separator
const TechSeparator = () => (
  <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none -translate-y-[99%]">
    <svg
      className="relative block w-[calc(100%+1.3px)] h-[60px] text-[var(--color-background)] fill-current"
      preserveAspectRatio="none"
      viewBox="0 0 1200 120"
    >
      <path
        d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
        className="opacity-100"
      />
    </svg>
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)]/20 to-transparent" />
  </div>
);

// Skills Data
const skillsData = {
  frontend: [
    { name: "React", iconSrc: "icons/react.svg" },
    { name: "JavaScript", iconSrc: "icons/javascript.svg" },
    { name: "TypeScript", iconSrc: "icons/typescript.svg" },
    { name: "Swift", iconSrc: "icons/swift.svg" },
    { name: "Tailwind", iconSrc: "icons/tailwind.svg" },
    { name: "Framer Motion", iconSrc: "icons/framer.svg" },
    { name: "Three.js", iconSrc: "icons/threejs.svg" },
  ],
  backend: [
    { name: "Node.js", iconSrc: "icons/nodejs.svg" },
    { name: "Python", iconSrc: "icons/python.svg" },
    { name: "Java", iconSrc: "icons/java.svg" },
    { name: "C# / .NET", iconSrc: "icons/csharp.svg" },
    { name: "PHP", iconSrc: "icons/php.svg" },
    { name: "PostgreSQL", iconSrc: "icons/postgresql.svg" },
    { name: "MySQL", iconSrc: "icons/mysql.svg" },
  ],
  ai: [
    { name: "OpenCV", iconSrc: "icons/opencv.svg" },
    { name: "TensorFlow", iconSrc: "icons/tensorflow.svg" },
    { name: "LLMs", iconSrc: "icons/ai.svg" },
  ],
  tools: [
    { name: "Git", iconSrc: "icons/git.svg" },
    { name: "Docker", iconSrc: "icons/docker.svg" },
    { name: "Figma", iconSrc: "icons/figma.svg" },
  ],
};

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

const labelSlide = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Skills() {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const rm = shouldReduceMotion;
  const initialState = rm ? "visible" : "hidden";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Preload icons
  useEffect(() => {
    const iconPaths = Object.values(skillsData).flatMap((categoryArray) =>
      categoryArray.map((item) => item.iconSrc)
    );
    preloadIcons(iconPaths, "normal");
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-10 px-6 bg-transparent overflow-hidden min-h-screen cv-auto"
    >
      <TechSeparator />

      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[80px] md:blur-[100px] opacity-30" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 rounded-full blur-[80px] md:blur-[100px] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8 md:mb-12 border-b border-white/40 pb-6 md:pb-8">
          <motion.div
            initial={initialState}
            whileInView="visible"
            viewport={{ once: true }}
            variants={labelSlide}
            className="inline-flex items-center gap-3 mb-4 md:mb-6"
          >
            <div className="h-[1px] w-8 md:w-12 bg-[var(--color-accent)]"></div>
            {rm ? (
              <span className="font-mono-tech text-[10px] md:text-xs text-[var(--color-accent)] tracking-[0.3em]">
                CAPABILITIES
              </span>
            ) : (
              <TextScramble
                text="CAPABILITIES"
                trigger="inViewAndHover"
                speed={20}
                className="font-mono-tech text-[10px] md:text-xs tracking-[0.3em]"
                accentColor="var(--color-accent)"
                baseColor="var(--color-accent)"
              />
            )}
          </motion.div>

          <motion.h2
            initial={initialState}
            whileInView="visible"
            viewport={{ once: true }}
            variants={group}
            className="font-cinzel text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-[var(--color-text-primary)] tracking-tight"
          >
            <motion.span variants={titleLine} className="block">
              Technical
            </motion.span>
            <motion.span variants={titleLine} className="block">
              <span className="font-cormorant italic text-[var(--color-accent)] font-light">
                Skills
              </span>
            </motion.span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(160px,auto)]">
          {/* 1. Frontend (Large Block) */}
          <BentoItem
            className="md:col-span-2 md:row-span-2"
            title="Frontend Engineering"
            subtitle="VISUAL INTERFACE"
            delay={0.1}
          >
            {/* Responsive Grid for Icons */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
              {skillsData.frontend.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center gap-2 group/icon"
                >
                  <div className="p-2 md:p-3 rounded-lg bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-colors w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <MetallicIcon
                      src={skill.iconSrc}
                      alt={skill.name}
                      className="w-8 h-8 md:w-10 md:h-10"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono-tech text-[var(--color-text-secondary)] text-center">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </BentoItem>

          {/* 2. Backend (Tall Block) */}
          <BentoItem
            className="md:col-span-1 md:row-span-2"
            title="Backend Systems"
            subtitle="CORE LOGIC"
            delay={0.2}
          >
            <div className="flex flex-col justify-center h-full gap-4 md:gap-5 mt-2">
              {skillsData.backend.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-3 md:gap-4 group/icon"
                >
                  <div className="p-2 rounded bg-[var(--color-background)]/50 border border-[var(--color-border)] group-hover/icon:border-[var(--color-accent)] transition-colors w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
                    <MetallicIcon
                      src={skill.iconSrc}
                      alt={skill.name}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                  </div>
                  <span className="text-xs md:text-sm font-mono-tech text-[var(--color-text-secondary)]">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </BentoItem>

          {/* 3. AI/ML (Wide Block) */}
          <BentoItem
            className="md:col-span-1 lg:col-span-1 md:row-span-1"
            title="AI Integration"
            subtitle="INTELLIGENCE"
            delay={0.3}
          >
            <div className="flex flex-wrap gap-2 md:gap-3 mt-4 content-start">
              {skillsData.ai.map((skill) => (
                <span
                  key={skill.name}
                  className="px-2 py-1 md:px-3 text-[10px] font-mono-tech border border-[var(--color-accent)]/30 text-[var(--color-accent)] rounded-full bg-[var(--color-accent)]/5 whitespace-nowrap"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </BentoItem>

          {/* 4. Tools (Infrastructure) - FIX: Better Responsiveness */}
          <BentoItem
            className="md:col-span-2 lg:col-span-1 md:row-span-1"
            title="DevOps & Tools"
            subtitle="INFRASTRUCTURE"
            delay={0.4}
          >
            <div className="flex justify-around md:justify-between items-center mt-4 px-2 md:px-0 h-full pb-4">
              {skillsData.tools.map((skill) => (
                <div
                  key={skill.name}
                  className="group/icon flex flex-col items-center gap-2"
                >
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-12 md:h-12 p-2 rounded-lg bg-[var(--color-background)]/30 border border-transparent group-hover/icon:border-[var(--color-border)] transition-all">
                    <MetallicIcon
                      src={skill.iconSrc}
                      alt={skill.name}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-[10px] font-mono-tech text-[var(--color-text-secondary)] opacity-0 group-hover/icon:opacity-100 transition-opacity">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </BentoItem>

          {/* 5. Decorative / Stat Block */}
          <BentoItem
            className="md:col-span-3 lg:col-span-4 min-h-[100px] md:min-h-[120px] md:max-h-[120px] flex items-center justify-center bg-[var(--color-accent)]/5 !border-[var(--color-accent)]/20"
            delay={0.5}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 md:gap-12 text-center w-full justify-center px-2">
              <div className="flex flex-col items-center">
                <span className="block text-2xl md:text-3xl font-cinzel text-[var(--color-accent)]">
                  100%
                </span>
                <span className="text-[8px] md:text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest">
                  COMMITMENT
                </span>
              </div>

              <div className="w-[1px] h-6 md:h-8 bg-[var(--color-accent)]/30" />

              <div className="flex flex-col items-center">
                <span className="block text-2xl md:text-3xl font-cinzel text-[var(--color-accent)]">
                  24/7
                </span>
                <span className="text-[8px] md:text-[10px] font-mono-tech text-[var(--color-text-secondary)] tracking-widest">
                  UPTIME
                </span>
              </div>

              <div className="w-[1px] h-6 md:h-8 bg-[var(--color-accent)]/30" />

              <div className="max-w-[200px] md:max-w-md text-xs md:text-sm text-[var(--color-text-secondary)] font-light italic text-center md:text-left">
                "Constantly evolving my stack to build faster, scalable, and
                more resilient systems."
              </div>
            </div>
          </BentoItem>
        </div>
      </div>
    </section>
  );
}

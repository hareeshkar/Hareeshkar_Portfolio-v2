import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProjectListItem from "./ProjectListItem";

const ProjectGallery = ({ projects }) => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Intersection observer to detect when section is out of view
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (!inView) {
      setHoveredProject(null);
    }
  }, [inView]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- CINEMATIC ANIMATION VARIANTS ---
  const cinematicReveal = {
    hidden: { opacity: 0, y: 80, scale: 0.96, filter: "blur(15px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const containerStagger = {
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };

  return (
    <section
      ref={ref}
      onMouseLeave={() => setHoveredProject(null)}
      className="relative min-h-screen bg-transparent py-16 px-6"
    >
      {/* Floating Preview Layer (Anti-Generic Hover Reveal) */}
      <AnimatePresence>
        {hoveredProject !== null && projects[hoveredProject] && (
          <motion.div
            key={hoveredProject}
            className="fixed z-[9999] pointer-events-none overflow-hidden rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-surface)] shadow-2xl block"
            initial={{ opacity: 0, scale: 0.75, y: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: mousePosition.x + 20,
              y: mousePosition.y + 20,
            }}
            exit={{ opacity: 0, scale: 0.75, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.4,
            }}
            style={{
              width: "420px",
              height: "280px",
              left: 0,
              top: 0,
              willChange: "transform, opacity",
            }}
          >
            {/* Image with intentional treatment */}
            <div className="relative w-full h-full overflow-hidden bg-black">
              <motion.img
                key={projects[hoveredProject].image}
                // start at natural scale to avoid intentional crop from upscaling
                initial={{
                  scale: 1,
                  filter: "blur(20px) grayscale(1)",
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  filter: "blur(0px) grayscale(0.1)",
                  opacity: 1,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                src={projects[hoveredProject].image}
                alt="Project Preview"
                // use object-contain so the full image is visible without cropping
                className="w-full h-full object-contain object-center contrast-[1.1] brightness-[0.9]"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";
                }}
              />

              {/* Black Scrim for text contrast (image only) - reduced slightly */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />

              {/* Blueprint Grid Overlay (The Architect's Touch) */}
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Scanning Line Animation */}
              <motion.div
                className="absolute left-0 right-0 h-[1px] bg-[var(--color-accent)]/60 shadow-[0_0_15px_var(--color-accent)] z-10"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* Noise Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Preview HUD — concise, meaningful project metadata */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-[var(--color-accent)] uppercase tracking-[0.2em] bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-sm drop-shadow-lg">
                      PROJECT PREVIEW • 0{hoveredProject + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/80 font-mono drop-shadow-md">
                    <span>
                      {projects[hoveredProject].liveLink ? "Live" : "—"}
                    </span>
                    <span>
                      {projects[hoveredProject].githubLink ? "Repo" : "—"}
                    </span>
                  </div>
                </div>

                <motion.div
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <span className="font-display text-base text-white leading-tight tracking-wide drop-shadow-lg max-w-sm">
                    {projects[hoveredProject].title.split("—")[0]}
                  </span>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {projects[hoveredProject].techStack.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-black/70 backdrop-blur-sm border border-[var(--color-accent)]/50 px-2 py-0.5 rounded text-white/95 font-mono drop-shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cursor Follower (Subtle interaction) */}
      <motion.div
        className="fixed z-[101] w-2 h-2 bg-[var(--color-accent)] rounded-full pointer-events-none mix-blend-difference hidden md:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: hoveredProject !== null ? 8 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.1 }}
      />

      {/* Content Layer with Cinematic Entry */}
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ margin: "-10%", once: true }}
        variants={containerStagger}
        style={{ willChange: "transform, opacity, filter" }} // GPU acceleration
      >
        <motion.div
          className="mb-24 border-b border-white/40 pb-12"
          variants={cinematicReveal}
        >
          {/* Separator Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/40 to-transparent mb-12 origin-left"
          />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <div className="h-[1px] w-12 bg-[var(--color-accent)]"></div>
            <span className="font-mono-tech text-xs text-[var(--color-accent)] tracking-[0.3em]">
              SELECTED WORKS // 002
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-5xl sm:text-7xl lg:text-8xl leading-[0.85] text-[var(--color-text-primary)] tracking-tight"
          >
            Digital <br />
            <span className="font-cormorant italic text-[var(--color-accent)] font-light">
              Artifacts
            </span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="flex flex-col"
          variants={cinematicReveal} // Apply cinematic reveal to the project list container
        >
          {projects.map((project, index) => (
            <ProjectListItem
              key={index}
              index={index}
              project={project}
              hoveredProject={hoveredProject}
              setHoveredProject={setHoveredProject}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectGallery;

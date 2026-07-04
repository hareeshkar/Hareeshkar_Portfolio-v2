import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProjectListItem from "./ProjectListItem";

const ProjectGallery = ({ projects }) => {
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });

  const cinematicReveal = {
    hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="relative bg-transparent py-24 md:py-32 px-6 md:px-12 overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Header — sized to echo the Hero's headline scale, so the section reads
            as a second movement of the same statement, not a smaller footnote. */}
        <motion.div
          className="mb-20 md:mb-28 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          variants={cinematicReveal}
        >
          <div>
            <div className="inline-flex items-center gap-3 mb-6 md:mb-8">
              <div className="h-[1px] w-10 bg-[var(--color-accent)]"></div>
              <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-[0.3em] uppercase">
                Selected Works
              </span>
            </div>

            <h2 className="font-cinzel text-[13vw] sm:text-[9vw] md:text-[6.5vw] lg:text-[6vw] leading-[0.88] text-[var(--color-text-primary)] uppercase tracking-tight">
              Digital{" "}
              <span className="font-cormorant italic text-[var(--color-accent)] font-light lowercase">
                Artifacts
              </span>
            </h2>
          </div>

          <span className="font-mono-tech text-[10px] text-[var(--color-text-secondary)] tracking-[0.25em] uppercase whitespace-nowrap">
            Catalogue &middot; {String(projects.length).padStart(2, "0")} Works
          </span>
        </motion.div>

        {/* Catalogue */}
        <motion.div
          className="flex flex-col"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={cinematicReveal}>
              <ProjectListItem index={index} project={project} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectGallery;

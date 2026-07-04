import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

// Three recipes cycle across the list so no two consecutive rows share the
// same image size, side, or indent — the "editorial staircase." Percentages
// are relative to the row itself (not the page), so md:ml-[x%] always leaves
// enough room for the row's own content and can't overflow the container.
const RECIPES = [
  { imgWidth: "md:w-[46%]", imgHeight: "md:h-72", indent: "md:ml-0", reverse: false },
  { imgWidth: "md:w-[30%]", imgHeight: "md:h-52", indent: "md:ml-[22%]", reverse: true },
  { imgWidth: "md:w-[37%]", imgHeight: "md:h-60", indent: "md:ml-[9%]", reverse: false },
];

const ProjectListItem = ({ project, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 32 }}
      transition={{ duration: 0.7, delay: (index % RECIPES.length) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative border-t border-[var(--color-border)] first:border-t-0"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-col ${recipe.reverse ? "md:flex-row-reverse" : "md:flex-row"} md:items-center gap-6 md:gap-14 py-12 md:py-16 px-2 -mx-2 ${recipe.indent} transition-colors duration-500 rounded-sm group-hover:bg-[var(--color-accent-light)]/25 focus-visible:outline-none focus-visible:bg-[var(--color-accent-light)]/25`}
      >
        {/* Thumbnail */}
        <div
          className={`relative w-full ${recipe.imgWidth} h-56 ${recipe.imgHeight} shrink-0 overflow-hidden bg-[#0a0a0a]`}
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale-[85%] contrast-[1.05] brightness-[0.85] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-700 ease-out"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className="block font-cinzel text-2xl md:text-4xl leading-none text-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition-opacity duration-500 mb-2 md:mb-3">
            N&deg;{String(index + 1).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-4">
            <h3 className="font-cinzel text-3xl md:text-4xl lg:text-5xl uppercase text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-500 leading-[0.95] tracking-tight">
              {heading}
            </h3>
            <FiArrowUpRight className="hidden md:block text-[var(--color-accent)] text-2xl opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shrink-0" />
          </div>

          {subtitle && (
            <p className="font-cormorant italic text-[var(--color-text-secondary)] text-base md:text-lg mt-2">
              {subtitle}
            </p>
          )}

          <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mt-4 line-clamp-2 max-w-lg">
            {project.description}
          </p>

          <p className="font-mono-tech text-xs text-[var(--color-text-secondary)] tracking-[0.1em] uppercase mt-4">
            {project.techStack.join(" · ")}
          </p>

          <span className="inline-flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent)] transition-colors duration-500 mt-5">
            View Case
            <FiArrowUpRight className="md:hidden" />
          </span>
        </div>
      </a>
    </motion.article>
  );
};

export default ProjectListItem;

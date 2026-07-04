import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

const ProjectListItem = ({
  project,
  index,
  setHoveredProject,
  hoveredProject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isHovered = hoveredProject === index;
  const isDimmed = hoveredProject !== null && !isHovered;

  // Use react-intersection-observer for stable "once" behavior
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: inView ? (isDimmed ? 0.3 : 1) : 0,
        y: inView ? 0 : 20,
        filter: inView ? (isDimmed ? "blur(1px)" : "blur(0px)") : "blur(0px)",
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHoveredProject(index)}
      className="group relative flex flex-col py-12 border-b border-border transition-colors duration-500 cursor-pointer"
    >
      <div className="flex items-baseline justify-between w-full">
        <div className="flex items-baseline gap-8">
          <span className="font-mono text-sm text-accent/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-text-primary group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
        </div>

        {/* Right-side link: renamed to "View Project" and links to project's github (with fallback) */}
        {/*
          Using an anchor here so the control is actionable.
          Fallback to main github if project.githubLink is falsy or a placeholder.
        */}
        {(() => {
          const repo =
            project.githubLink && project.githubLink !== "#"
              ? project.githubLink
              : "https://github.com/hareeshkar";
          return (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4 group-hover:translate-x-0"
              aria-label={`View project ${project.title}`}
            >
              <span className="font-mono text-xs text-accent tracking-widest uppercase">
                View Project
              </span>
              <FiArrowUpRight className="text-accent text-xl" />
            </a>
          );
        })()}
      </div>

      <div className="mt-4 ml-0 md:ml-14 max-w-3xl">
        <p className="text-text-secondary max-w-prose leading-relaxed text-base">
          {project.description &&
            (isExpanded
              ? project.description
              : project.description.length > 140
              ? project.description.slice(0, 137) + "…"
              : project.description)}
        </p>
        {project.description && project.description.length > 140 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent hover:text-accent/80 text-sm font-mono uppercase tracking-wider mt-2 transition-colors duration-300"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectListItem;

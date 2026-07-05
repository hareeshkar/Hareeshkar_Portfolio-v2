import React from "react";
import { motion } from "framer-motion";

const BentoItem = ({
  children,
  className = "",
  title,
  subtitle,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden bg-[var(--color-surface)]/40 backdrop-blur-md border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors duration-500 ${className}`}
      style={{ isolation: "auto" }}
    >
      {/* Hover Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 border-t border-r border-[var(--color-accent)]" />
      </div>
      <div className="absolute bottom-0 left-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 border-b border-l border-[var(--color-accent)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        {(title || subtitle) && (
          <div className="mb-6">
            {subtitle && (
              <span className="block font-mono-tech text-[9px] text-[var(--color-accent)] tracking-widest uppercase mb-1">
                {subtitle}
              </span>
            )}
            {title && (
              <h3 className="font-cinzel text-xl text-[var(--color-text-primary)]">
                {title}
              </h3>
            )}
          </div>
        )}
        <div className="flex-grow">{children}</div>
      </div>
    </motion.div>
  );
};

export default BentoItem;

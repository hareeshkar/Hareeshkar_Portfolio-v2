import React from "react";
import { motion } from "framer-motion";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { HiEnvelope } from "react-icons/hi2";

// --- THE "SOLID STATE" VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const techRevealVariant = {
  hidden: {
    opacity: 0,
    scale: 0.96, // Starts slightly smaller (zoomed out)
    y: 0, // FORCE ZERO MOVEMENT
    x: 0, // FORCE ZERO MOVEMENT
  },
  visible: {
    opacity: 1,
    scale: 1, // Locks into place
    transition: {
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1], // "Quart Out" - fast start, rock solid stop
    },
  },
};

const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    variants={techRevealVariant}
    // REMOVED "transition-all" to prevent CSS fighting the Entrance Animation
    // Only animating colors/borders on hover now
    className="group relative flex items-center gap-4 p-4 border border-[var(--color-border)] bg-[var(--color-surface)]/20 backdrop-blur-md overflow-hidden hover:border-[var(--color-accent)]/50 active:scale-[0.99] transition-colors duration-300 ease-out"
    // "opacity" and "transform" are the only cheap things to animate on mobile
    style={{ willChange: "opacity, transform" }}
  >
    {/* Hover Background Sweep */}
    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />

    {/* Icon Box */}
    <div className="relative z-10 p-2 bg-[var(--color-background)]/80 rounded-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors duration-300 border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/30">
      <Icon size={18} />
    </div>

    {/* Text Content */}
    <div className="relative z-10 flex flex-col">
      <span className="font-mono-tech text-[9px] text-[var(--color-text-secondary)] uppercase tracking-[0.15em] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
      <span className="font-cinzel text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
        Connect
      </span>
    </div>

    {/* Subtle Corner Accents (Visible on Hover) */}
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.a>
);

const ContactInfo = () => {
  return (
    <motion.div
      className="space-y-6 w-full"
      initial="hidden"
      whileInView="visible"
      // CRITICAL: margin decreased to -5% to ensure it triggers easily on mobile
      // once: true prevents any re-animation/refreshing when scrolling back
      viewport={{ once: true, margin: "-5% 0px" }}
      variants={containerVariants}
    >
      {/* The Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SocialLink
          href="mailto:hareeshkarravi@gmail.com"
          icon={HiEnvelope}
          label="Email Protocol"
        />
        <SocialLink
          href="https://github.com/hareeshkar"
          icon={SiGithub}
          label="Code Repository"
        />
        <SocialLink
          href="https://www.linkedin.com/in/hareeshkar-ravi"
          icon={SiLinkedin}
          label="Professional Net"
        />
        <SocialLink
          href="https://x.com/hareeshkar"
          icon={SiX}
          label="Broadcast Feed"
        />
      </div>

      {/* Location Data - Matches the reveal style */}
      <motion.div
        variants={techRevealVariant}
        className="mt-12 pt-8 border-t border-[var(--color-border)] flex justify-between items-end"
      >
        <div className="flex flex-col gap-2">
          <span className="font-mono-tech text-[10px] text-[var(--color-accent)] tracking-[0.2em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full animate-pulse" />
            CURRENT_COORDINATES
          </span>
          <span className="font-cinzel text-lg text-[var(--color-text-primary)]">
            Batticaloa, Sri Lanka
          </span>
        </div>
        <div className="text-right opacity-60">
          <span className="font-mono-tech text-[9px] text-[var(--color-text-secondary)]">
            7.7102° N <br /> 81.6924° E
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactInfo;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Material descriptions for common tech stack items
 * Themed as architectural materials/tools
 */
const MATERIAL_DESCRIPTIONS = {
  // Frontend Frameworks
  React: "Structural UI Framework — Component-based architecture",
  Vue: "Progressive Framework — Reactive data binding",
  Angular: "Enterprise Framework — Full-featured MVC",
  Svelte: "Compiled Framework — Zero runtime overhead",
  "Next.js": "React Meta-Framework — SSR & SSG capabilities",

  // Backend
  "Node.js": "JavaScript Runtime — Event-driven server foundation",
  Express: "Web Framework — Minimalist routing layer",
  "ASP.NET Core": "Enterprise Platform — High-performance .NET framework",
  Django: "Python Framework — Batteries-included backend",
  FastAPI: "Modern Python Framework — Async & type-safe",
  Spring: "Java Framework — Enterprise-grade architecture",

  // Languages
  JavaScript: "Foundation Language — Universal web scripting",
  TypeScript: "Type-Safe Superset — Enhanced JavaScript structure",
  Python: "General Purpose — Data & AI powerhouse",
  Java: "Enterprise Language — Platform-independent bytecode",
  "C#": "Modern OOP Language — .NET ecosystem foundation",
  ".NET": "Development Platform — Microsoft's unified framework",
  Swift: "Apple Language — iOS & macOS native development",
  SwiftUI: "Declarative UI — Apple's modern interface toolkit",
  PHP: "Server Language — Dynamic web content generation",

  // Databases
  MySQL: "Relational Database — Open-source SQL foundation",
  PostgreSQL: "Advanced RDBMS — Enterprise-grade data integrity",
  MongoDB: "Document Database — Flexible JSON-like storage",
  Firebase: "BaaS Platform — Real-time cloud database",
  SQLite: "Embedded Database — Lightweight local storage",
  Redis: "In-Memory Store — High-speed caching layer",

  // AI/ML
  OpenCV: "Computer Vision — Image processing toolkit",
  MediaPipe: "ML Framework — Real-time perception pipeline",
  "LLM APIs": "Language Models — AI-powered text generation",
  "Gemini AI": "Multimodal AI — Google's advanced AI model",
  TensorFlow: "ML Framework — Deep learning infrastructure",

  // Tools & Libraries
  Git: "Version Control — Distributed code management",
  Docker: "Containerization — Isolated runtime environments",
  Kubernetes: "Orchestration — Container deployment automation",
  Webpack: "Module Bundler — Asset compilation pipeline",
  Vite: "Build Tool — Lightning-fast dev server",
  "Tailwind CSS": "Utility Framework — Atomic CSS methodology",
  GSAP: "Animation Library — Professional motion toolkit",
  "Three.js": "3D Library — WebGL abstraction layer",
  "Chart.js": "Data Visualization — Canvas-based charting",

  // Mobile
  Android: "Mobile Platform — Java/Kotlin native development",
  iOS: "Mobile Platform — Swift/Objective-C ecosystem",
  "React Native": "Cross-Platform — Native mobile via React",

  // APIs & Protocols
  "REST API": "Architectural Style — HTTP-based web services",
  GraphQL: "Query Language — Efficient data fetching",
  WebSockets: "Protocol — Real-time bidirectional communication",

  // Default fallback
  default: "Technology Component — Core system element",
};

/**
 * Get material description for a tech item
 */
const getMaterialDescription = (techName) => {
  // Try exact match first
  if (MATERIAL_DESCRIPTIONS[techName]) {
    return MATERIAL_DESCRIPTIONS[techName];
  }

  // Try partial match (case-insensitive)
  const lowerTech = techName.toLowerCase();
  const partialMatch = Object.keys(MATERIAL_DESCRIPTIONS).find(
    (key) =>
      lowerTech.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerTech)
  );

  if (partialMatch) {
    return MATERIAL_DESCRIPTIONS[partialMatch];
  }

  // Fallback
  return `${techName} — Core system component`;
};

/**
 * MaterialTooltip - Architectural-themed tooltip for tech stack items
 */
const MaterialTooltip = ({
  techName,
  children,
  delay = 0.3,
  position = "top", // "top" | "bottom" | "left" | "right"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout, setShowTimeout] = useState(null);

  const description = getMaterialDescription(techName);

  const handleMouseEnter = () => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    setShowTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
    }
    setIsVisible(false);
  };

  // Intelligent position calculation - always below the card to avoid covering image
  const getPositionStyles = () => {
    // Always position below the tech tag, never covering the project image
    return {
      top: "calc(100% + 12px)", // 12px gap from tag
      left: "50%",
      transform: "translateX(-50%)",
    };
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute z-[100] pointer-events-none whitespace-nowrap"
            style={getPositionStyles()}
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Tooltip content */}
            <div className="bg-surface border border-accent/30 rounded-lg px-4 py-3 shadow-2xl backdrop-blur-sm">
              {/* Label */}
              <div className="text-accent text-xs font-semibold uppercase tracking-wider mb-1">
                Material
              </div>

              {/* Description */}
              <div className="text-text-primary text-sm font-medium max-w-xs">
                {description}
              </div>

              {/* Blueprint-style corner decorations */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/50" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/50" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/50" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/50" />
            </div>

            {/* Arrow indicator - always pointing up since tooltip is below */}
            <div
              className="absolute left-1/2 bottom-full -translate-x-1/2 mb-px"
              style={{
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "6px solid var(--color-accent)",
                opacity: 0.3,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaterialTooltip;
export { getMaterialDescription, MATERIAL_DESCRIPTIONS };

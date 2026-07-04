import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SkillIcon from "./SkillIcon";

const SkillCategory = ({ title, skills }) => {
  return (
    <div
      className="group relative flex flex-col h-full"
      style={{ isolation: "auto" }}
    >
      {/* Premium Card Container */}
      <div className="relative h-full p-8 md:p-10 rounded-sm bg-surface/40 backdrop-blur-md border border-border transition-all duration-700 hover:border-accent/40 hover:bg-surface/60">
        {/* Metallic/Glass Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 mb-10 border-b border-border/30 pb-4">
          <h3 className="font-cinzel text-2xl text-text-primary tracking-wide group-hover:text-accent transition-colors duration-500">
            {title}
          </h3>
          <div className="absolute -bottom-[1px] left-0 w-8 h-[1px] bg-accent/50 group-hover:w-full transition-all duration-700 ease-out" />
        </div>

        {/* Skills Grid */}
        <div className="relative z-10 grid grid-cols-3 sm:grid-cols-3 gap-8 md:gap-10 justify-items-center">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="w-full flex justify-center transform transition-transform duration-500 hover:-translate-y-1"
            >
              <SkillIcon skillName={skill.name} iconSrc={skill.iconSrc} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillCategory;

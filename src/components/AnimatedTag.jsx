import React, { memo } from "react";
import { motion } from "framer-motion";

const AnimatedTag = ({ text }) => {
  const textVariants = {
    rest: { y: 0 },
    hover: { y: "-100%", transition: { duration: 0.3, ease: "easeOut" } },
  };

  const hoverTextVariants = {
    rest: { y: "100%" },
    hover: { y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="relative inline-block overflow-hidden rounded-full border border-border px-4 py-2"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {/* Default Text */}
      <motion.div
        variants={textVariants}
        className="flex text-xs font-medium text-text-secondary"
      >
        {text}
      </motion.div>
      {/* Hover Text */}
      <motion.div
        variants={hoverTextVariants}
        className="absolute top-0 left-0 flex text-xs font-medium text-accent px-4 py-2"
      >
        {text}
      </motion.div>
    </motion.div>
  );
};

export default memo(AnimatedTag);

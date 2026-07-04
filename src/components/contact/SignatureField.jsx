import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * SignatureField - Input field with permanent signature-style font
 * Creates a personal, formal feel for the contact form
 */
const SignatureField = ({
  id = "name",
  name = "name",
  value = "",
  onChange,
  placeholder = "Your Name",
  required = true,
  className = "",
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.input
      type="text"
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`block w-full rounded-lg border-0 bg-transparent px-4 py-3 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-0 transition-all duration-300 sm:text-sm sm:leading-6 outline-none ${className}`}
      style={{
        fontFamily: "'Dancing Script', cursive",
        fontSize: "1.1rem",
        transition: "border-color 0.3s ease",
        willChange: "border-color",
      }}
      animate={{
        scale: isFocused ? 1.01 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    />
  );
};

export default SignatureField;

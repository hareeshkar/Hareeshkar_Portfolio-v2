import React from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="relative w-full aspect-video max-h-[50vh] overflow-hidden mt-4">
      {/* Background Image — fills and crops */}
      <img
        src={`${import.meta.env.BASE_URL}Footer.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content — copyright left, socials right */}
      <div className="absolute bottom-0 left-0 right-0 z-10 mx-auto max-w-7xl px-6 py-6 md:py-8 flex items-center justify-between">
        <p className="text-xs md:text-sm tracking-[0.25em] uppercase font-medium text-neutral-400">
          &copy; {new Date().getFullYear()} Ravi Hareeshkar
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/hareeshkar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors duration-300"
          >
            <SiGithub className="h-5 w-5 md:h-6 md:w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/hareeshkar-ravi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors duration-300"
          >
            <SiLinkedin className="h-5 w-5 md:h-6 md:w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

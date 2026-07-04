import React, { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenisScroll } from "../contexts/LenisContext";
import MobileMenu from "./MobileMenu";
import RHLogo from "./RHLogo";
import TextScramble from "./TextScramble";

const links = [
  { title: "About", href: "#about" },
  { title: "Projects", href: "#projects" },
  { title: "Skills", href: "#skills" },
  { title: "Contact", href: "#contact" },
];

// Name of the site-wide load-in sequence: navbar labels scramble in, then the
// logo builds stroke-by-stroke, then (and only then) this fires — Hero.jsx
// listens for it before starting its own entrance animation. A DOM event
// keeps Navbar and Hero decoupled (neither needs to import the other) while
// still letting the hero wait for a real completion signal instead of a
// guessed delay.
export const INTRO_READY_EVENT = "site-intro:ready";

// The load-in runs as a strict relay: each step only starts once the
// previous one hands off, via onComplete/onBuildComplete callbacks — never
// on a guessed timer. "menu" -> "logo" -> "contact" -> "done" (hero release).
const STAGES = { MENU: "menu", LOGO: "logo", CONTACT: "contact", DONE: "done" };
const STAGE_ORDER = [STAGES.MENU, STAGES.LOGO, STAGES.CONTACT, STAGES.DONE];

export default function Navbar() {
  const scrollTo = useLenisScroll();
  const shouldReduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stage, setStage] = useState(STAGES.MENU);

  const dispatchReady = useCallback(() => {
    window.dispatchEvent(new Event(INTRO_READY_EVENT));
  }, []);

  // Reduced-motion visitors skip straight to the settled state — everything
  // renders instantly and the hero is released immediately.
  useEffect(() => {
    if (shouldReduceMotion) dispatchReady();
  }, [shouldReduceMotion, dispatchReady]);

  const handleMenuDone = useCallback(() => {
    setStage((s) => (s === STAGES.MENU ? STAGES.LOGO : s));
  }, []);

  const handleLogoDone = useCallback(() => {
    setStage((s) => (s === STAGES.LOGO ? STAGES.CONTACT : s));
  }, []);

  const handleContactDone = useCallback(() => {
    setStage((s) => {
      if (s !== STAGES.CONTACT) return s;
      dispatchReady();
      return STAGES.DONE;
    });
  }, [dispatchReady]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = () => {
    setMenuOpen(true);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    scrollTo("#contact", { offset: -80 });
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    scrollTo("#home", { offset: -80 });
  };

  const handleNavigate = (href) => {
    setMenuOpen(false);
    setTimeout(() => scrollTo(href, { offset: -80 }), 80);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 pl-6 pr-10 sm:px-5 md:px-12 py-4 sm:py-5 md:py-8 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-md bg-surface/80" : ""
        }`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center max-w-7xl mx-auto gap-6 sm:gap-4 min-w-0">
          {/* Left — Menu: scrambles in first, on load */}
          <div className="flex justify-start min-w-0">
            <TextScramble
              text="Menu"
              as="button"
              type="button"
              trigger="alwaysAndHover"
              speed={33}
              onClick={handleMenuClick}
              onComplete={handleMenuDone}
              className="text-sm sm:text-sm md:text-base font-semibold tracking-[0.2em] md:tracking-[0.25em] uppercase cursor-pointer"
              accentColor="currentColor"
              baseColor="currentColor"
            />
          </div>

          {/* Center — Logo: builds stroke-by-stroke once Menu has locked in */}
          <div className="flex justify-center shrink-0">
            <a href="#home" onClick={handleLogoClick}>
              <RHLogo
                className="h-5 sm:h-6 md:h-6 w-auto text-current"
                awaitBuild={!shouldReduceMotion}
                // Sticky once true: the logo should draw in when its turn
                // comes and then STAY drawn, even after `stage` moves on to
                // "contact"/"done" — it must not revert to build=false and
                // snap back to hidden.
                build={STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(STAGES.LOGO) && !shouldReduceMotion}
                onBuildComplete={handleLogoDone}
              />
            </a>
          </div>

          {/* Right — Contact: waits its turn until the logo has finished building */}
          <div className="flex justify-end min-w-0">
            <TextScramble
              text="Contact"
              as="button"
              trigger="manualAndHover"
              active={stage === STAGES.CONTACT}
              startHidden
              speed={33}
              onClick={handleContactClick}
              onComplete={handleContactDone}
              className="text-sm sm:text-sm md:text-base font-semibold tracking-[0.2em] md:tracking-[0.25em] uppercase cursor-pointer"
              accentColor="currentColor"
              baseColor="currentColor"
            />
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={links}
        onNavigate={handleNavigate}
      />
    </>
  );
}

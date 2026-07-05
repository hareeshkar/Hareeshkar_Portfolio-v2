import React, { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { useTheme } from "./ThemeContext";
import { HiX, HiSun, HiMoon } from "react-icons/hi";
import RHLogo from "./RHLogo";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MobileMenu = ({ isOpen, onClose, items = [], onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const panelRef = useRef(null);
  const openTlRef = useRef(null);
  const busyRef = useRef(false);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();

    const itemEls = Array.from(
      panel.querySelectorAll(".mobile-menu-item-label")
    );

    // Reduced motion: resolve to the open state instantly, no tween.
    if (prefersReducedMotion()) {
      gsap.set(itemEls, { yPercent: 0, rotate: 0 });
      gsap.set(panel, { xPercent: 0, scale: 1 });
      return null;
    }

    gsap.set(itemEls, { yPercent: 100, rotate: 3 });
    gsap.set(panel, { xPercent: 100, scale: 0.96 });

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        busyRef.current = false;
      },
    });

    tl.to(
      panel,
      { xPercent: 0, scale: 1, duration: 0.6, ease: "power3.out" },
      0.08
    ).to(
      itemEls,
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: { each: 0.08, from: "start" },
      },
      0.2
    );

    openTlRef.current = tl;
    return tl;
  }, []);

  const playClose = useCallback(
    (postCloseCallback) => {
      busyRef.current = true;
      openTlRef.current?.kill();
      if (prefersReducedMotion()) {
        busyRef.current = false;
        onClose();
        if (typeof postCloseCallback === "function") postCloseCallback();
        return;
      }
      gsap.to(panelRef.current, {
        xPercent: 100,
        scale: 0.96,
        duration: 0.8,
        ease: "power3.out",
        force3D: true,
        onComplete: () => {
          busyRef.current = false;
          onClose();
          if (typeof postCloseCallback === "function") {
            postCloseCallback();
          }
        },
      });
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      const tl = buildOpenTimeline();
      tl?.play(0);
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }, [isOpen, buildOpenTimeline]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <aside
        ref={panelRef}
        className="absolute inset-0 backdrop-blur-xl flex flex-col pl-6 pr-10 md:px-10 py-6 md:py-10 z-[101]"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {/* Header — logo left, actions right */}
        <header className="flex items-center justify-between gap-5">
          <a
            href="#home"
            className="flex items-center"
            onClick={() => playClose()}
            style={{ willChange: "transform" }}
          >
            <RHLogo className="h-7 md:h-7 w-auto text-current" />
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <HiMoon className="w-5 h-5 md:w-5 md:h-5" />
              ) : (
                <HiSun className="w-5 h-5 md:w-5 md:h-5 text-accent" />
              )}
            </button>
            <button
              onClick={() => playClose()}
              className="w-10 h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <HiX className="w-5 h-5 md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        {/* Nav Links — centered vertically */}
        <nav className="flex-1 flex flex-col items-center justify-center -mt-16 md:-mt-20">
          <ul className="list-none m-0 p-0 flex flex-col items-center gap-6 md:gap-10">
            {items.map((item) => (
              <li key={item.title} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    playClose(() => {
                      if (typeof onNavigate === "function") {
                        onNavigate(item.href);
                        return;
                      }
                      if (
                        typeof window !== "undefined" &&
                        window.__lenisScrollTo
                      ) {
                        window.__lenisScrollTo(item.href, { offset: -80 });
                      } else {
                        const el = document.querySelector(item.href);
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        else window.location.href = item.href;
                      }
                    });
                  }}
                  className="mobile-menu-item block font-display text-3xl md:text-5xl text-text-primary hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  <span className="mobile-menu-item-label inline-block">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer — subtle branding */}
        <footer className="text-center pb-2">
          <p className="text-[10px] md:text-xs tracking-[0.25em] text-neutral-500 uppercase font-medium">
            <span className="text-[var(--color-accent)]">✦</span>{" "}
            Hareeshkar — <span className="text-[var(--color-accent)]">Full Stack</span> Developer{" "}
            <span className="text-[var(--color-accent)]">✦</span>
          </p>
        </footer>
      </aside>
    </div>
  );
};

export default MobileMenu;

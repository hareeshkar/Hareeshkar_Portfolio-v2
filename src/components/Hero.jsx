import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TextScramble from './TextScramble';
import { INTRO_READY_EVENT } from './Navbar';

// Orchestration: each level only declares timing (staggerChildren/delayChildren).
// Framer-motion propagates "hidden"/"visible" down the tree, so nesting these
// groups is what produces the cascade — background, then headline lines, then
// the CTA row, each waiting for the level above.
const group = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.155, delayChildren: 0.055 } },
};

// Zoom is the one beat that should read as quick and decisive, not lingering.
const bgReveal = {
  hidden: { scale: 1.08, filter: 'brightness(0.5)' },
  visible: {
    scale: 1,
    filter: 'brightness(1)',
    transition: { duration: 0.63, ease: [0.16, 1, 0.3, 1] },
  },
};

// Headline lines wipe up from a blurred, clipped state — reads like a
// signal resolving into focus rather than a generic fade/slide.
const titleLine = {
  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)', filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    filter: 'blur(0px)',
    transition: { duration: 0.69, ease: [0.16, 1, 0.3, 1] },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

// The CTA row's own children fire together (staggerChildren: 0) rather than
// cascading — the button and its tagline read as one beat, distinct from
// the title's separate line-by-line reveal above it.
const ctaRow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

// The leader-line "draws" itself rather than fading, echoing the
// schematic/annotation motif already used for the CTA divider.
const lineGrow = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1, transition: { duration: 0.36, ease: 'easeOut' } },
};

const footerReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.87 },
  },
};

export default function PremiumHero() {
  const videoRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const initialState = shouldReduceMotion ? false : 'hidden';

  // The hero holds at "hidden" until the navbar's own load-in sequence
  // (labels scramble in, then the logo builds) reports completion — so the
  // whole page reads as one orchestrated moment instead of two unrelated
  // animations firing at once. A short fallback timeout covers the case
  // where the navbar never mounts/fires (e.g. it's removed from a page).
  const [introReady, setIntroReady] = useState(shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const markReady = () => setIntroReady(true);
    window.addEventListener(INTRO_READY_EVENT, markReady);
    const fallback = setTimeout(markReady, 2300);
    return () => {
      window.removeEventListener(INTRO_READY_EVENT, markReady);
      clearTimeout(fallback);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced-motion users: hold a single still frame instead of
    // running the forward/reverse loop.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }

    const revealVideo = () => video.classList.add('video-ready');
    video.addEventListener('loadeddata', revealVideo, { once: true });

    const buffer = 0.05;
    let direction = 1; // 1 = forward, -1 = reverse
    let rafId = null;
    let lastTimestamp = null;

    // Browsers don't actually decode video in reverse for negative
    // playbackRate (it's clamped/ignored), which is what caused the
    // jitter/vibration. Reverse is simulated by manually stepping
    // currentTime backwards each frame instead.
    const reverseStep = (timestamp) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const next = video.currentTime - delta;
      if (next <= buffer) {
        video.currentTime = 0;
        direction = 1;
        lastTimestamp = null;
        video.play();
        return;
      }

      video.currentTime = next;
      rafId = requestAnimationFrame(reverseStep);
    };

    const startReverse = () => {
      direction = -1;
      video.pause();
      lastTimestamp = null;
      rafId = requestAnimationFrame(reverseStep);
    };

    const handleTimeUpdate = () => {
      if (direction === 1 && video.currentTime >= video.duration - buffer) {
        startReverse();
      }
    };

    const handleEnded = () => {
      if (direction === 1) startReverse();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#0B0B0B] text-[#E5E5E5] flex flex-col justify-between overflow-hidden select-none">

      {/* 1. Brand type system (matches the rest of the site: Cinzel display / Cormorant body / JetBrains Mono utility) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@300;400&display=swap');
      `}</style>

      {/* 2. Background — mobile image, desktop video */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-grain"
        initial={initialState}
        animate={introReady ? 'visible' : 'hidden'}
        variants={bgReveal}
      >
        {/* Mobile: image (LCP element on mobile) */}
        <img
          src={`${import.meta.env.BASE_URL}laser1mobile.jpeg`}
          alt="Background"
          fetchpriority="high"
          decoding="async"
          className="md:hidden absolute inset-0 w-full h-full object-cover opacity-85"
        />
        {/* Desktop: video */}
        <video
          ref={videoRef}
          src={`${import.meta.env.BASE_URL}laservideodekstop.mp4`}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          className="video-loading hidden md:block absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30 pointer-events-none" />
      </motion.div>

      {/* Dissolves the hero's fixed dark video into whatever the next section's
          background is (cream in light mode, void in dark mode), so the scroll
          transition reads as one continuous surface instead of a hard cut. */}
      <div className="absolute inset-x-0 bottom-0 h-40 md:h-56 z-[5] bg-gradient-to-b from-transparent to-[var(--color-background)] pointer-events-none" />

      {/* 3. Main Hero Typography Block */}
      <main className="relative flex-1 flex flex-col justify-center items-center md:items-end px-6 md:px-16 pt-24 md:pt-32 z-10">
        <motion.div
          className="max-w-4xl w-full flex flex-col items-center md:items-end text-center md:text-right"
          initial={initialState}
          animate={introReady ? 'visible' : 'hidden'}
          variants={group}
        >

          {/* Main Title — each line resolves into focus, one after the other */}
          <motion.div
            className="flex flex-col items-center md:items-end w-full tracking-[-0.01em] [font-family:var(--font-display)]"
            variants={group}
          >
            <motion.h1
              variants={titleLine}
              className="text-[12vw] md:text-[7vw] lg:text-[6.5vw] font-semibold leading-[0.88] text-[var(--color-accent)] uppercase select-none"
              style={{ textShadow: '0 0 45px var(--color-accent-glow)' }}
            >
              Full Stack
            </motion.h1>
            <motion.h1
              variants={titleLine}
              className="text-[12vw] md:text-[7vw] lg:text-[6.5vw] font-semibold leading-[0.88] text-white uppercase select-none mt-1"
            >
              Developer
            </motion.h1>
          </motion.div>

          {/* Controls, CTA & Description Row */}
          <div className="w-full flex flex-col items-center md:items-end mt-10 md:mt-12">

            {/* CTA anchored to its tagline by a schematic leader-line — button and tagline animate as one beat, separate from the title above */}
            <motion.div
              className="flex flex-col md:flex-row items-center md:justify-end gap-5 md:gap-7"
              variants={ctaRow}
            >

              <motion.a
                href="#contact"
                variants={riseIn}
                className="group flex-none flex items-center gap-2.5 pl-6 pr-2.5 py-2.5 rounded-full border border-[var(--color-accent)]/50 text-[11px] md:text-xs font-medium tracking-[0.2em] text-[var(--color-accent)] uppercase transition-lux hover:bg-[var(--color-accent)] hover:text-[#0B0B0B] hover:border-[var(--color-accent)] hover:shadow-[0_0_30px_-4px_var(--color-accent-glow)] [font-family:var(--font-tech)]"
              >
                <TextScramble
                  text="Get in Touch"
                  trigger="hover"
                  className="text-[11px] md:text-xs font-medium tracking-[0.2em] uppercase"
                  accentColor="currentColor"
                  baseColor="currentColor"
                />
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/10 text-sm transition-lux group-hover:bg-[#0B0B0B]/15 group-hover:rotate-45">
                  ↗
                </span>
              </motion.a>

              <motion.div
                variants={lineGrow}
                className="hidden md:block w-px h-11 origin-top bg-gradient-to-b from-transparent via-neutral-700 to-transparent"
              />

              <motion.p
                variants={riseIn}
                className="text-base md:text-lg italic leading-snug text-neutral-300 max-w-[260px] text-center md:text-left [font-family:var(--font-body)]"
              >
                I make <span className="text-[var(--color-accent)] not-italic">web applications</span> and <span className="text-[var(--color-accent)] not-italic">AI tools</span>.<br />
                Frontend interfaces, backend logic.
              </motion.p>
            </motion.div>

          </div>
        </motion.div>
      </main>

      {/* 4. Bottom Footer Bar — locks in last, after the headline and CTA have settled */}
      <motion.footer
        className="relative w-full flex flex-col items-center sm:flex-row sm:justify-between px-6 md:px-12 py-6 md:py-8 gap-4 sm:gap-0 z-20 [font-family:var(--font-tech)]"
        initial={initialState}
        animate={introReady ? 'visible' : 'hidden'}
        variants={footerReveal}
      >
        <TextScramble
          text="Hareeshkar — Full Stack Developer"
          as="span"
          trigger="inViewAndHover"
          speed={24}
          className="text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium text-neutral-400 text-center sm:text-left"
          accentColor="var(--color-text-secondary)"
          baseColor="var(--color-text-secondary)"
        />

        <div className="flex items-center space-x-3 text-[10px] md:text-xs tracking-[0.25em] font-medium text-neutral-400">
          <a href="#ig" className="hover:text-[var(--color-accent)] transition-colors duration-200">IG</a>
          <span className="text-neutral-800 font-normal">/</span>
          <a href="#ln" className="hover:text-[var(--color-accent)] transition-colors duration-200">LN</a>
          <span className="text-neutral-800 font-normal">/</span>
          <a href="#tw" className="hover:text-[var(--color-accent)] transition-colors duration-200">TW</a>
          <span className="text-neutral-800 font-normal">/</span>
          <a href="#wa" className="hover:text-[var(--color-accent)] transition-colors duration-200">WA</a>
        </div>

        <TextScramble
          text="Scroll For More"
          as="span"
          trigger="hover"
          className="text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium text-neutral-400 cursor-pointer"
          accentColor="var(--color-text-secondary)"
          baseColor="var(--color-text-secondary)"
        />
      </motion.footer>
    </div>
  );
}

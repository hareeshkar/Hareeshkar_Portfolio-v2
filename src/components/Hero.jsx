import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import TextScramble from './TextScramble';
import { INTRO_READY_EVENT } from './Navbar';
import { useLenisScroll } from '../contexts/LenisContext';

// --- Entrance Variants ---

const group = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.15 } },
};

const bgReveal = {
  hidden: { scale: 1.08, filter: 'brightness(0.5)' },
  visible: {
    scale: 1,
    filter: 'brightness(1)',
    transition: { duration: 0.57, ease: [0.16, 1, 0.3, 1], delay: 0.075 },
  },
};

const titleLine = {
  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)', filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: 'inset(0 0 0% 0)',
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const riseIn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const ctaRow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

const lineGrow = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const footerReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.78 },
  },
};

export default function PremiumHero() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const initialState = shouldReduceMotion ? false : 'hidden';
  const scrollTo = useLenisScroll();

  const [introReady, setIntroReady] = useState(shouldReduceMotion);

  // Only one of the mobile/desktop videos should ever be in the DOM — mounting both and
  // hiding one with CSS still triggers a fetch + decode for the hidden one.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handleChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // --- Scroll-linked animations ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Background parallax — Y movement only (scale/opacity handled by bgReveal variant)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  // Dissolve strip thickens as the section scrolls toward Projects, for a smoother seam.
  // Fixed height + opacity-only (no layout reflow) keeps this compositor-friendly.
  const dissolveOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.7, 0.85, 1]);

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

  // Reveals the desktop video once its first frame is actually decoded — without this,
  // the `video-loading` class (opacity: 0) never lifts and the video stays invisible.
  useEffect(() => {
    if (!isDesktop) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      video.classList.add('video-ready');
      return;
    }
    const revealVideo = () => video.classList.add('video-ready');
    video.addEventListener('loadeddata', revealVideo, { once: true });
    return () => video.removeEventListener('loadeddata', revealVideo);
  }, [isDesktop]);

  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;
  //
  //   if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  //     video.pause();
  //     return;
  //   }
  //
  //   const buffer = 0.05;
  //   let direction = 1;
  //   let rafId = null;
  //   let lastTimestamp = null;
  //
  //   const reverseStep = (timestamp) => {
  //     if (lastTimestamp === null) lastTimestamp = timestamp;
  //     const delta = (timestamp - lastTimestamp) / 1000;
  //     lastTimestamp = timestamp;
  //
  //     const next = video.currentTime - delta;
  //     if (next <= buffer) {
  //       video.currentTime = 0;
  //       direction = 1;
  //       lastTimestamp = null;
  //       video.play();
  //       return;
  //     }
  //
  //     video.currentTime = next;
  //     rafId = requestAnimationFrame(reverseStep);
  //   };
  //
  //   const startReverse = () => {
  //     direction = -1;
  //     video.pause();
  //     lastTimestamp = null;
  //     rafId = requestAnimationFrame(reverseStep);
  //   };
  //
  //   const handleTimeUpdate = () => {
  //     if (direction === 1 && video.currentTime >= video.duration - buffer) {
  //       startReverse();
  //     }
  //   };
  //
  //   const handleEnded = () => {
  //     if (direction === 1) startReverse();
  //   };
  //
  //   video.addEventListener('timeupdate', handleTimeUpdate);
  //   video.addEventListener('ended', handleEnded);
  //
  //   return () => {
  //     video.removeEventListener('timeupdate', handleTimeUpdate);
  //     video.removeEventListener('ended', handleEnded);
  //     if (rafId !== null) cancelAnimationFrame(rafId);
  //   };
  // }, []);

  return (
    <div
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#0B0B0B] text-[#E5E5E5] flex flex-col justify-between overflow-hidden select-none"
    >

      {/* Background — scroll-linked parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-grain"
        style={{ y: bgY, willChange: 'transform' }}
        initial={initialState}
        animate={introReady ? 'visible' : 'hidden'}
        variants={bgReveal}
      >
        {isDesktop ? (
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL}laservideodekstop.mp4`}
            autoPlay
            muted
            playsInline
            preload="auto"
            fetchpriority="high"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            style={{ willChange: 'transform', transform: 'translateZ(0)' }}
            className="video-loading absolute inset-0 w-full h-full object-cover opacity-85"
          />
        ) : (
          <video
            src={`${import.meta.env.BASE_URL}lasermobile.mp4`}
            autoPlay
            muted
            playsInline
            preload="auto"
            fetchpriority="high"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            style={{ willChange: 'transform', transform: 'translateZ(0)' }}
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30 pointer-events-none" />
      </motion.div>

      {/* Dissolve into next section — thickens (opacity only, no layout cost) as scroll approaches Projects */}
      <motion.div
        style={{ opacity: dissolveOpacity, willChange: 'opacity' }}
        className="absolute inset-x-0 bottom-0 h-40 md:h-56 z-[5] bg-gradient-to-b from-transparent to-[var(--color-background)] pointer-events-none"
      />

      {/* Main Content */}
      <main
        className="relative flex-1 flex flex-col justify-center items-center md:items-end px-6 md:px-12 pt-16 md:pt-20 z-10"
      >
        <motion.div
          className="max-w-4xl w-full flex flex-col items-center md:items-end text-center md:text-right"
          initial={initialState}
          animate={introReady ? 'visible' : 'hidden'}
          variants={group}
        >
          {/* Title */}
          <motion.div
            className="flex flex-col items-center md:items-end w-full tracking-[-0.01em] [font-family:var(--font-display)]"
            variants={group}
          >
            {/* Title lines decode (scramble) while rising through the existing
                blur-rise — the glyphs resolve just before the line settles. */}
            <motion.h1
              variants={titleLine}
              className="text-[12vw] md:text-[7vw] lg:text-[6.5vw] font-semibold leading-[0.88] text-[var(--color-accent)] uppercase select-none"
              style={{ textShadow: '0 0 45px var(--color-accent-glow)' }}
            >
              {shouldReduceMotion ? (
                'Full Stack'
              ) : (
                <TextScramble
                  text="Full Stack"
                  trigger="manualAndHover"
                  active={introReady}
                  speed={65}
                  showUnderline={false}
                  accentColor="currentColor"
                  baseColor="currentColor"
                />
              )}
            </motion.h1>
            <motion.h1
              variants={titleLine}
              className="text-[12vw] md:text-[7vw] lg:text-[6.5vw] font-semibold leading-[0.88] text-white uppercase select-none mt-1"
            >
              {shouldReduceMotion ? (
                'Developer'
              ) : (
                <TextScramble
                  text="Developer"
                  trigger="manualAndHover"
                  active={introReady}
                  speed={65}
                  showUnderline={false}
                  accentColor="currentColor"
                  baseColor="currentColor"
                />
              )}
            </motion.h1>
          </motion.div>

          {/* Subtitle — mobile: between title and CTA, desktop: stays inside CTA row */}
          <motion.p
            variants={riseIn}
            className="block md:hidden text-base italic leading-snug text-neutral-300 max-w-[260px] text-center mt-10 [font-family:var(--font-body)]"
          >
            I build <span className="text-[var(--color-accent)] not-italic">systems</span>, <span className="text-[var(--color-accent)] not-italic">web & app products</span>.<br />
            AI-infused, frontend to backend.
          </motion.p>

          {/* CTA Row */}
          <div className="w-full flex flex-col items-center md:items-end mt-10 md:mt-12">
            <motion.div
              className="flex flex-col md:flex-row items-center md:justify-end gap-5 md:gap-7"
              variants={ctaRow}
            >
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollTo('#contact', { offset: -80 }); }}
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
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/10 transition-lux group-hover:bg-[#0B0B0B]/15 group-hover:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[var(--color-accent)] group-hover:text-[#0B0B0B]">
                    <path d="M2 10L10 2M10 2H4.5M10 2V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.a>

              <motion.div
                variants={lineGrow}
                className="hidden md:block w-px h-11 origin-top bg-gradient-to-b from-transparent via-neutral-700 to-transparent"
              />

              {/* Subtitle — desktop only */}
              <motion.p
                variants={riseIn}
                className="hidden md:block text-lg italic leading-snug text-neutral-300 max-w-[260px] text-left [font-family:var(--font-body)]"
              >
                I build <span className="text-[var(--color-accent)] not-italic">systems</span>, <span className="text-[var(--color-accent)] not-italic">web & app products</span>.<br />
                AI-infused, frontend to backend.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="relative w-full flex flex-col items-center sm:flex-row sm:justify-between px-6 md:px-10 py-4 md:py-6 gap-4 sm:gap-0 z-20 [font-family:var(--font-tech)]"
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

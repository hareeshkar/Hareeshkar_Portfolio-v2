// useScramble.js — rAF-driven so glyph ticks stay frame-locked at any refresh
// rate (setInterval drifted against the display clock and janked on 120Hz).
// `speed` keeps its original meaning: ms per tick, +0.5 iteration per tick.
import { useState, useEffect, useRef, useCallback } from "react";

const GLYPHS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+-=[]{}|;:,.<>?/λΞΠΣΦΨΩ";

export const useScramble = ({
  text,
  speed = 40,
  startOnMount = false,
  playOnce = false,
}) => {
  const [display, setDisplay] = useState(text);
  const [finished, setFinished] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const rafRef = useRef(null);
  const iterationRef = useRef(0);

  const cancel = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    cancel();
    setDisplay(text);
    setFinished(false);
    iterationRef.current = 0;
  }, [text, cancel]);

  const play = useCallback(() => {
    stop();
    setFinished(false);
    iterationRef.current = 0;

    let lastTick = null;

    const step = (timestamp) => {
      if (lastTick === null) lastTick = timestamp;
      const elapsed = timestamp - lastTick;

      // Accumulate fractional iterations from real elapsed time instead of
      // counting timer fires — identical pacing on 60Hz and 120Hz displays.
      if (elapsed >= speed) {
        iterationRef.current += 0.5 * (elapsed / speed);
        lastTick = timestamp;

        if (iterationRef.current >= text.length) {
          rafRef.current = null;
          setFinished(true);
          setDisplay(text);
          if (playOnce) setHasPlayed(true);
          return;
        }

        setDisplay(() =>
          text
            .split("")
            .map((char, index) => {
              if (index < iterationRef.current) {
                return text[index];
              }
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("")
        );
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, speed, stop, playOnce]);

  useEffect(() => {
    if (startOnMount) {
      play();
    }
  }, [startOnMount, play]);

  useEffect(() => {
    setDisplay(text);
    setFinished(false);
    iterationRef.current = 0;
  }, [text]);

  useEffect(() => cancel, [cancel]);

  return { display, play, stop, finished, hasPlayed };
};

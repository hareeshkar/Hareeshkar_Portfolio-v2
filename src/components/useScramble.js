// useScramble.js (unchanged — already perfect for this use case)
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
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplay(text);
    setFinished(false);
    iterationRef.current = 0;
  }, [text]);

  const play = useCallback(() => {
    stop();
    setFinished(false);
    iterationRef.current = 0;

    intervalRef.current = setInterval(() => {
      setDisplay(() => {
        return text
          .split("")
          .map((char, index) => {
            if (index < iterationRef.current) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
      });

      if (iterationRef.current >= text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setFinished(true);
        setDisplay(text);
        if (playOnce) setHasPlayed(true);
      }

      iterationRef.current += 0.5;
    }, speed);
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { display, play, stop, finished, hasPlayed };
};
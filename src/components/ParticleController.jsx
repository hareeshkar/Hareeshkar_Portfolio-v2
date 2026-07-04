// File: /src/components/ParticleController.jsx

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { useParticles } from "./ParticleContext";
import { useTheme } from "./ThemeContext";
import getParticlePresets from "../particle-presets";

// Dynamically import Particles component and initialize engine
const ParticlesComponent = lazy(() =>
  import("@tsparticles/react").then(async (module) => {
    // Initialize the particles engine with slim preset
    await module.initParticlesEngine(async (engine) => {
      const { loadSlim } = await import("@tsparticles/slim");
      await loadSlim(engine);
    });
    return { default: module.Particles };
  })
);

export default function ParticleController() {
  const [isClient, setIsClient] = useState(false);
  const { config: currentConfigKey } = useParticles();
  const { theme } = useTheme();

  const presets = useMemo(() => getParticlePresets(theme), [theme]);

  // State for managing our two overlapping particle instances for cross-fading
  const [optionsA, setOptionsA] = useState(null);
  const [optionsB, setOptionsB] = useState(null);
  const [activeInstance, setActiveInstance] = useState("A");
  const [keyA, setKeyA] = useState("A-key-0");
  const [keyB, setKeyB] = useState("B-key-0");
  const isInitialLoad = useRef(true);
  const configCounter = useRef(0);
  const activeInstanceRef = useRef("A");
  const activeConfigRef = useRef(null);
  const pendingConfigRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const settleTimeoutRef = useRef(null);
  const activeThemeRef = useRef(theme);
  const latestThemeRef = useRef(theme);
  const presetsRef = useRef(presets);

  useEffect(() => {
    // Ensure component only renders on client-side
    setIsClient(true);
  }, []);

  useEffect(() => {
    latestThemeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    presetsRef.current = presets;
  }, [presets]);

  const clearTimers = useCallback(() => {
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
  }, []);

  const FADE_DURATION = 1800;

  const handleParticlesLoaded = useCallback((container) => {
    // When the new particles are loaded, we trigger the swap
    const targetInstance = container.id === "tsparticles-instanceA" ? "A" : "B";

    // Only swap if we are actually waiting for this instance to become active
    // and it's not already the active one (prevent double swaps)
    if (
      isTransitioningRef.current &&
      activeInstanceRef.current !== targetInstance
    ) {
      setActiveInstance(targetInstance);
      activeInstanceRef.current = targetInstance;

      // Start the settle timer
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = false;
        if (
          pendingConfigRef.current &&
          pendingConfigRef.current !== activeConfigRef.current
        ) {
          const queued = pendingConfigRef.current;
          pendingConfigRef.current = null;
          startTransition(queued);
        }
      }, FADE_DURATION);
    }
  }, []);

  const startTransition = useCallback(
    (configKeyToLoad) => {
      if (!configKeyToLoad) return;
      const lookup = presetsRef.current;
      const nextOptions = lookup?.[configKeyToLoad] || {
        particles: { number: { value: 0 } },
      };
      const themeForTransition = latestThemeRef.current;

      configCounter.current += 1;

      if (isInitialLoad.current) {
        setOptionsA(nextOptions);
        setKeyA(`A-key-${configCounter.current}`);
        activeConfigRef.current = configKeyToLoad;
        activeThemeRef.current = themeForTransition;
        isInitialLoad.current = false;
        return;
      }

      isTransitioningRef.current = true;
      pendingConfigRef.current = null;
      clearTimers();

      // Prepare the NEXT instance (inactive one) with new options
      // The swap will happen in handleParticlesLoaded
      if (activeInstanceRef.current === "A") {
        setOptionsB(nextOptions);
        setKeyB(`B-key-${configCounter.current}`);
        activeConfigRef.current = configKeyToLoad;
        activeThemeRef.current = themeForTransition;
      } else {
        setOptionsA(nextOptions);
        setKeyA(`A-key-${configCounter.current}`);
        activeConfigRef.current = configKeyToLoad;
        activeThemeRef.current = themeForTransition;
      }
    },
    [clearTimers]
  );

  useEffect(() => {
    if (!isClient || !currentConfigKey) return;

    const themeChanged = activeThemeRef.current !== latestThemeRef.current;
    if (!themeChanged && activeConfigRef.current === currentConfigKey) {
      return;
    }

    if (isTransitioningRef.current) {
      pendingConfigRef.current = currentConfigKey;
      return;
    }

    startTransition(currentConfigKey);
  }, [isClient, currentConfigKey, theme, startTransition]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!isClient) return null;

  const containerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none",
    background: "transparent",
  };

  const instanceStyle = (isActive) => ({
    position: "absolute",
    inset: 0,
    opacity: isActive ? 1 : 0,
    transition: `opacity ${
      isActive ? "1.8s" : "0.9s"
    } cubic-bezier(0.4, 0, 0.2, 1)`,
  });

  return (
    <div style={containerStyle}>
      <Suspense fallback={<div />}>
        {optionsA && (
          <div style={instanceStyle(activeInstance === "A")}>
            <ParticlesComponent
              key={keyA}
              id="tsparticles-instanceA"
              options={optionsA}
              particlesLoaded={handleParticlesLoaded}
            />
          </div>
        )}

        {optionsB && (
          <div style={instanceStyle(activeInstance === "B")}>
            <ParticlesComponent
              key={keyB}
              id="tsparticles-instanceB"
              options={optionsB}
              particlesLoaded={handleParticlesLoaded}
            />
          </div>
        )}
      </Suspense>
    </div>
  );
}

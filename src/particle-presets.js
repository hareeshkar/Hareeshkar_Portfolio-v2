// File: /src/particle-presets.js

const getParticlePresets = (theme) => {
  const isLight = theme === "light";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const lightModeColor = "#1C1B1A";
  const darkModeColor = "#DAA520";
  const prominentColor = isLight ? lightModeColor : darkModeColor;

  return {
    // 1. HERO: "ETHEREAL CONSTELLATION"
    hero: {
      fpsLimit: 60,
      particles: {
        number: { value: isMobile ? 60 : 70 }, // Optimized for 60fps
        color: { value: prominentColor },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: isMobile ? 0.25 : 0.35, // Smoother animation speed
            sync: false,
            minimumValue: 0.3,
            maximumValue: 0.8,
          },
        },
        size: {
          value: { min: 1, max: 2.5 },
          animation: {
            enable: true,
            speed: isMobile ? 0.15 : 0.2, // Smoother size animation
            sync: false,
            minimumValue: 1,
            maximumValue: 2.5,
          },
        },
        links: {
          enable: true,
          distance: isMobile ? 90 : 105, // Optimized for performance
          color: prominentColor,
          opacity: 0.18,
          warp: true,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          attract: { enable: true, rotate: { x: 600, y: 1200 } },
        },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: !isMobile,
            mode: "grab",
            parallax: {
              enable: !isMobile,
              smooth: 25,
              force: 20,
            },
          },
          onMove: {
            enable: isMobile && typeof window !== "undefined", // Tilt parallax on mobile
            parallax: {
              enable: true,
              smooth: 25,
              force: 20,
            },
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 180,
            links: { color: prominentColor, opacity: 0.35, blink: false },
          },
        },
      },
    },

    // 3. PROJECTS: "PRECISION GRID"
    projects: {
      fpsLimit: 60,
      smooth: true,
      detectRetina: true,
      particles: {
        number: { value: isMobile ? 65 : 70 }, // Optimized for 60fps
        color: { value: prominentColor },
        opacity: {
          value: { min: 0.08, max: 0.4 },
          animation: {
            enable: true,
            speed: isMobile ? 0.2 : 0.25, // Smoother animation
            sync: false,
            minimumValue: 0.08,
            maximumValue: 0.4,
          },
        },
        size: {
          value: { min: 0.8, max: 1.8 },
          animation: {
            enable: true,
            speed: isMobile ? 0.12 : 0.15, // Smoother size animation
            sync: false,
            minimumValue: 0.8,
            maximumValue: 1.8,
          },
        },
        shape: {
          type: "circle",
        },
        wobble: {
          enable: true,
          distance: 3, // Reduced for smoother performance
          speed: { min: isMobile ? 6 : 8, max: isMobile ? 18 : 20 }, // Optimized wobble
        },
        move: {
          enable: true,
          speed: { min: 2, max: 4 }, // Smoother movement
          direction: 45,
          straight: true,
          outModes: { default: "out" },
          trail: {
            enable: true,
            fill: {
              color: isLight
                ? "rgba(244, 241, 233, 0.06)" // Reduced for performance
                : "rgba(10, 10, 14, 0.06)",
            },
            length: 6, // Shorter for better performance
          },
          noise: {
            enable: true,
          },
          warp: true,
        },
        links: { enable: false },
      },
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: "bubble",
            parallax: {
              enable: false, // Disabled mouse parallax
              smooth: 15,
              force: 10,
            },
          },
          onMove: {
            enable: isMobile && typeof window !== "undefined", // Tilt parallax on mobile
            parallax: {
              enable: false, // Disabled mouse parallax
              smooth: 15,
              force: 10,
            },
          },
        },
        modes: {
          bubble: {
            distance: 120,
            size: 3,
            opacity: 0.5,
            duration: 2,
          },
        },
      },
    },

    // 2. ABOUT: "LIQUID DRIFT"
    about: {
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: isMobile ? 35 : 40 }, // Optimized for 60fps
        color: { value: prominentColor },
        opacity: {
          value: 0.7,
          animation: {
            enable: true,
            speed: isMobile ? 0.55 : 0.65, // Smoother animation
            sync: false,
            minimumValue: 0.5,
            maximumValue: 0.7,
          },
        },
        size: {
          value: { min: 1, max: 2.8 },
          animation: {
            enable: true,
            speed: isMobile ? 0.4 : 0.55, // Smoother size animation
            sync: false,
            minimumValue: 1,
            maximumValue: 2.8,
          },
        },
        links: {
          enable: true,
          distance: isMobile ? 155 : 165, // Optimized distance
          color: "random",
          opacity: 0.12,
        },
        move: {
          enable: true,
          speed: 0.65,
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: "connect",
            parallax: {
              enable: !isMobile,
              smooth: 25,
              force: 20,
            },
          },
          onMove: {
            enable: isMobile && typeof window !== "undefined", // Tilt parallax on mobile
            parallax: {
              enable: true,
              smooth: 25,
              force: 20,
            },
          },
        },
        modes: {
          connect: {
            distance: 250,
            links: { opacity: 0.3 },
            radius: 200,
          },
        },
      },
    },

    // 4. SKILLS: "MORPHING GEOMETRY" - ENHANCED
    skills: {
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: isMobile ? 50 : 60 }, // Enhanced from 45/55
        color: { value: prominentColor },
        shape: { type: ["circle", "square", "triangle", "polygon"] }, // Added polygon back
        opacity: {
          value: 0.6, // Enhanced from 0.5
          animation: {
            enable: true,
            speed: isMobile ? 0.35 : 0.4, // Enhanced animation speed
            sync: false,
            minimumValue: 0.4, // Enhanced range
            maximumValue: 0.6,
          },
        },
        size: {
          value: { min: 1, max: 2 }, // Enhanced size range
          animation: {
            enable: true,
            speed: isMobile ? 0.25 : 0.3, // Enhanced size animation
            sync: false,
            minimumValue: 1,
            maximumValue: 2,
          },
        },
        links: {
          enable: true,
          distance: isMobile ? 85 : 90,
          color: prominentColor,
          opacity: 0.2,
          // Simplify link triangulation to avoid heavy first-hover compute
          triangles: { enable: false, opacity: 0.0 },
        },
        move: {
          enable: true,
          speed: 1, // Enhanced movement speed
          direction: "none",
          straight: false,
          rotate: {
            value: 35, // Enhanced rotation angle
            animation: { enable: true, speed: isMobile ? 3.5 : 4, sync: false }, // Enhanced rotation speed
          },
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        // Use canvas-level detection to avoid global pointer work on hover
        detectsOn: "canvas",
        events: {
          onHover: {
            // Keep hover interaction but remove parallax and extra modes
            enable: !isMobile,
            mode: "grab",
            parallax: {
              enable: false,
              smooth: 0,
              force: 0,
            },
          },
          onMove: {
            // Disable tilt/mouse parallax to prevent extra per-frame math
            enable: false,
            parallax: {
              enable: false,
              smooth: 0,
              force: 0,
            },
          },
          onClick: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          // Keep grab visuals, tuned and lightweight
          grab: {
            distance: 140, // balanced with visuals
            links: { color: prominentColor, opacity: 0.3 },
          },
          // Remove bubble & repulse pressure from hover combo (still available on click)
          bubble: {
            distance: 130, // Enhanced bubble distance
            size: 4, // Enhanced bubble size
            opacity: 0.7, // Enhanced bubble opacity
            duration: 2, // Enhanced duration
          },
          repulse: {
            distance: 160, // Enhanced repulse distance
            duration: 0.8, // Enhanced duration
            speed: 1, // Enhanced speed
            easing: "ease-out-quad",
          },
        },
      },
    },

    // 5. CONTACT: "SERENE ATMOSPHERE"
    contact: {
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: isMobile ? 18 : 20 }, // Optimized for 60fps
        color: { value: prominentColor },
        opacity: {
          value: { min: 0.08, max: 0.5 },
          animation: {
            enable: true,
            speed: isMobile ? 0.6 : 0.7, // Smoother animation
            sync: false,
            minimumValue: 0.08,
            maximumValue: 0.5,
          },
        },
        size: {
          value: { min: 1, max: 2.8 },
          animation: {
            enable: true,
            speed: isMobile ? 0.3 : 0.35, // Smoother size animation
            sync: false,
            minimumValue: 1,
            maximumValue: 2.8,
          },
        },
        links: { enable: false },
        move: {
          enable: true,
          speed: 0.1,
          direction: "none",
          random: true,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: !isMobile,
            mode: "bubble",
            parallax: {
              enable: !isMobile,
              smooth: 50, // Ultra smooth parallax
              force: 3, // Minimal force for smoothness
            },
          },
          onMove: {
            enable: isMobile && typeof window !== "undefined",
            parallax: {
              enable: true,
              smooth: 50,
              force: 3,
            },
          },
        },
        modes: {
          bubble: {
            distance: 85, // Optimized distance
            size: 3, // Optimized size
            opacity: 0.3, // Optimized opacity
            duration: 2, // Optimized duration
          },
        },
      },
    },
  };
};

export default getParticlePresets;

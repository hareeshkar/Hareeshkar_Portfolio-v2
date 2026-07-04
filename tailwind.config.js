/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-secondary": "var(--color-surface-secondary)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          tertiary: "var(--color-text-tertiary)",
        },
        accent: "var(--color-accent)",
        border: "var(--color-border)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-tech)",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      perspective: {
        1000: "1000px",
        1300: "1300px",
        1500: "1500px",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      willChange: {
        transform: "transform",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".line-clamp-2": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "2",
        },
        ".line-clamp-4": {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": "4",
        },
        ".gpu-accelerated": {
          transform: "translateZ(0)",
          "backface-visibility": "hidden",
          perspective: "1000px",
        },
      });
    },
  ],
};

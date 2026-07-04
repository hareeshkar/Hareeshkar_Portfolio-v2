// File: /src/App.jsx

import React, { Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import ParticleController from "./components/ParticleController";
import SectionObserver from "./components/SectionObserver";

// Lazy load heavy sections for better performance
const About = React.lazy(() => import("./components/About"));
const Projects = React.lazy(() => import("./components/project"));
const Skills = React.lazy(() => import("./components/Skills"));
const Contact = React.lazy(() =>
  import("./components/Contact").catch(() => {
    // Fallback: if chunk fails to load, return a minimal component
    return {
      default: () => (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Contact Section Unavailable
            </h2>
            <p className="text-gray-400 mb-4">
              Please refresh the page or contact directly:
            </p>
            <a
              href="mailto:hareeshkarravi@gmail.com"
              className="text-accent hover:underline"
            >
              hareeshkarravi@gmail.com
            </a>
          </div>
        </div>
      ),
    };
  })
);

// Loading fallback component
const SectionLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-gray-400">Loading...</div>
  </div>
);

import VideoPreloader from "./components/VideoPreloader";

function App() {
  return (
    <>
      {/* Preload videos in background */}
      <VideoPreloader />
      <ParticleController />

      {/* Global Scrim for Light Mode Contrast - Positioned correctly */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-black transition-opacity duration-700 ease-in-out"
        style={{ opacity: "var(--global-scrim-opacity)" }}
      />

      <Navbar />
      <main className="relative z-10">
        <SectionObserver configKey="hero">
          <Hero />
        </SectionObserver>

        <Suspense fallback={<SectionLoader />}>
          <SectionObserver configKey="about" threshold={0.1}>
            <About />
          </SectionObserver>

          <SectionObserver configKey="projects">
            <Projects />
          </SectionObserver>

          <SectionObserver configKey="skills">
            <Skills />
          </SectionObserver>

          <SectionObserver configKey="contact">
            <Contact />
          </SectionObserver>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;

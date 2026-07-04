/// <reference types="vite/client" />
// import React, { useMemo } from "react";
import SectionObserver from "./SectionObserver";
import ProjectGallery from "./ProjectGallery";

const projectsData = [
  {
    title: "PCA Cinemax — Enterprise Cinema Booking Platform",
    description:
      "Full-stack ticketing system with high-concurrency handling and Stripe payments. Engineered with Next.js 14 App Router and Prisma ORM, implementing real-time seat locking via Supabase to eliminate concurrency issues.",
    techStack: [
      "Next.js 14",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Prisma",
      "Stripe API",
    ],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar/pca-cinemax",
    image: `${import.meta.env.BASE_URL}project_images/pca.jpg`,
  },
  {
    title: "Synapse Med — AI Clinical Intelligence Engine",
    description:
      "MERN SPA converting medical lectures into interactive knowledge graphs. Orchestrates a 'Socratic Tutor' using Gemini to parse documents and produce visual flowcharts and quizzes.",
    techStack: [
      "MongoDB",
      "Express",
      "React",
      "Node.js",
      "Gemini AI",
      "Three.js",
    ],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar/synapse-med",
    image: `${import.meta.env.BASE_URL}project_images/syn.jpg`,
  },
  {
    title: "Clinical Simulator — iOS Training Platform",
    description:
      "Native iOS app (SwiftUI, SwiftData, Firebase) with multilingual patient simulation and AI-driven diagnostics. MVVM architecture, offline-first features and adaptive vitals animations.",
    techStack: ["SwiftUI", "SwiftData", "Firebase", "Gemini/OpenAI APIs"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar/ClinicalSimulator",
    image: `${import.meta.env.BASE_URL}project_images/ios.png`,
  },
  {
    title: "The Gadget Hub — Enterprise E‑Commerce",
    description:
      "B2B/B2C ASP.NET Core platform built on SOA with multi-tenant APIs, Entity Framework Core, JWT auth and RBAC. Automated quotation comparison and inventory sync.",
    techStack: ["ASP.NET Core", "C#", "MSSQL", "Entity Framework"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // fallback
    image: `${import.meta.env.BASE_URL}project_images/gad.jpg`,
  },
  {
    title: "E‑Waste Management Platform",
    description:
      "A multi-role platform for managing e-waste logistics, featuring role-based access control and analytics dashboards.",
    techStack: ["PHP", "MySQL", "REST API", "Chart.js"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // restored project (fallback)
    image: `${import.meta.env.BASE_URL}project_images/green.jpg`,
  },
  {
    title: "EcoStay Retreat — Resort Management",
    description:
      "Native Android app with a custom room-allocation algorithm and offline storage (SQLite). Improved operations with automated reminders and conflict-resolution logic.",
    techStack: ["Java", "Android SDK", "SQLite"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // restored project (fallback)
    image: `${import.meta.env.BASE_URL}project_images/ecoo.jpg`,
  },
  {
    title: "AI Powered Virtual Try-On Studio",
    description:
      "Photorealistic virtual try-on app leveraging generative models and iterative prompts for multi-angle outfit previews.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Gemini AI"],
    liveLink: "#",
    githubLink: "https://github.com/hareeshkar", // fallback
    image: `${import.meta.env.BASE_URL}project_images/ge.jpg`,
  },
  {
    title: "AI Powered Attendance System",
    description:
      "A secure, automated attendance system using facial recognition, featuring dynamic dashboards and leave policy enforcement.",
    techStack: ["Python", "OpenCV", "PHP", "MySQL", "GSAP"],
    liveLink: null,
    githubLink: "https://github.com/hareeshkar", // fallback
    image: `${import.meta.env.BASE_URL}project_images/icbt.jpg`,
  },
  {
    title: "Codebase Prompt Packer",
    description:
      "VS Code extension to package workspace context into LLM-friendly prompts to accelerate AI-assisted development workflows.",
    techStack: ["JavaScript", "VS Code API", "Node.js"],
    liveLink: null,
    githubLink: "https://github.com/hareeshkar/codebase-prompt-packer",
    image: `${import.meta.env.BASE_URL}project_images/co.jpg`,
  },
];

export default function Projects() {
  return (
    <SectionObserver configKey="projects" threshold={0.08}>
      <section id="projects">
        <ProjectGallery projects={projectsData} />
      </section>
    </SectionObserver>
  );
}
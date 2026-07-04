# Portfolio — Full-Stack Developer & UI/UX Engineer

A thoughtfully crafted portfolio showcasing full-stack development work, interactive design systems, and performance-focused architecture. Built with modern tooling and designed to reflect quality over complexity.

## 🎬 Live Demo

[![Portfolio Preview - Click to watch](https://img.shields.io/badge/▶️_Watch_Demo-Click_Here-blue?style=for-the-badge)](https://github.com/hareeshkar/Hareeshkar_Portfolio/raw/main/public/portfolio_preview.mp4)

**[🚀 View Live Portfolio](https://hareeshkar.github.io/Hareeshkar_Portfolio/)** | **[📹 Download Video Demo](https://github.com/hareeshkar/Hareeshkar_Portfolio/raw/main/public/portfolio_preview.mp4)**

---

## ✨ Features

### **Performance First**
- Lazy-loaded sections with Suspense for optimal Core Web Vitals
- Video preloading system to eliminate playback delays
- Optimized animations using GSAP and Framer Motion
- Production-grade bundle analysis and optimization

### **Interactive Design**
- Smooth scroll experiences with Lenis
- Advanced particle systems with customizable presets
- Text animation effects (cipher, scramble, split-text)
- Custom spotlight and gradient UI components
- 3D card transforms with enhanced interactions

### **Technical Depth**
- Full-stack project showcase (Next.js, MERN, SwiftUI)
- Real-world problem solving (concurrency handling, AI integration, offline-first architecture)
- Modern React patterns (Context API, Suspense, lazy loading)
- Responsive design with Tailwind CSS

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** — UI framework with Suspense for code splitting
- **Vite 7** — Lightning-fast build tool with HMR
- **Framer Motion** — Advanced animation library
- **GSAP** — Timeline-based animations and scroll effects
- **Tailwind CSS 4** — Utility-first styling

### **Interactivity & Animation**
- `@tsparticles/react` — Customizable particle system
- `@studio-freight/lenis` — Smooth scroll behavior
- `react-intersection-observer` — Viewport-based triggers
- `split-type` — Text manipulation library
- Custom scroll-reveal and text-scramble components

### **Build & Tooling**
- ESLint (modern config)
- Tailwind CSS Vite plugin
- gh-pages for GitHub deployment
- vite-bundle-visualizer for optimization insights

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Hero.jsx        # Landing section with cipher animations
│   ├── About.jsx       # Detailed background with animated counters
│   ├── Skills.jsx      # Skill categories with bento layout
│   ├── project.tsx     # Full-stack projects showcase
│   ├── Contact.jsx     # Contact form with integration
│   ├── blueprint/      # Architectural annotation system
│   ├── gallery/        # Project gallery with effects
│   └── ui/            # Reusable UI primitives
├── contexts/          # React Context (Theme, Lenis scroll)
├── utils/            # Image processing, helpers
├── App.jsx           # Main app with lazy-loaded sections
└── main.jsx          # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/hareeshkar/Hareeshkar_Portfolio.git
cd Hareeshkar_Portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the portfolio locally.

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

---

## 📊 Key Projects Featured

### **PCA Cinemax — Enterprise Cinema Booking**
Full-stack ticketing system with real-time seat locking, Stripe payments, and high-concurrency handling.
- **Tech**: Next.js 14, Prisma, Supabase PostgreSQL, Stripe API

### **Synapse Med — AI Clinical Intelligence**
MERN application converting medical lectures into interactive knowledge graphs using AI.
- **Tech**: MongoDB, Express, React, Node.js, Gemini AI, Three.js

### **Clinical Simulator — iOS Training Platform**
Native iOS app with patient simulation, offline-first architecture, and adaptive animations.
- **Tech**: SwiftUI, SwiftData, Firebase, Gemini/OpenAI APIs

### **The Gadget Hub — Enterprise E-Commerce**
Full-featured e-commerce platform with advanced filtering, payments, and inventory management.
- **Tech**: React, Node.js, MongoDB, Stripe

---

## 🎨 Design Philosophy

This portfolio emphasizes **intentionality over complexity**:
- Animations serve a purpose—they guide attention and reveal information
- Typography hierarchy uses Cinzel, Cormorant Garamond, and JetBrains Mono deliberately
- Performance is baked in from the start, not retrofitted
- Dark mode with thoughtful contrast for readability
- Accessibility considered in scroll triggers, animations, and color contrast

---

## 📈 Performance Insights

- **First Contentful Paint (FCP)**: ~1.2s
- **Largest Contentful Paint (LCP)**: ~2.1s
- **Cumulative Layout Shift (CLS)**: <0.1
- **Bundle Size**: ~180KB (gzipped after optimization)

---

## 🔧 Configuration Files

- **vite.config.js** — Build configuration, base path for GH Pages
- **tailwind.config.js** — Custom theme colors and design tokens
- **eslint.config.js** — Modern ESLint with React rules
- **particles-config.js** — Particle system presets and behaviors

---

## 📝 Customization

### Change Theme Colors
Edit `tailwind.config.js` to update accent colors and CSS custom properties.

### Modify Animations
- GSAP effects: See components using `useEffect` with ScrollTrigger
- Framer Motion: Check individual component `motion` props
- Particle presets: `src/particle-presets.js`

### Add/Remove Projects
Edit [project.tsx](src/components/project.tsx) to update the projects showcase.

---

## 🤝 Contributing & Feedback

This is a personal portfolio, but I genuinely value feedback on:
- Performance optimizations
- Design improvements
- Code quality and architecture
- Accessibility enhancements

Feel free to open issues or reach out at **hareeshkarravi@gmail.com**.

---

## 📄 License

This portfolio is personal work. Feel free to draw inspiration for your own portfolio, but please don't use the design or content directly.

---

## 🙏 Acknowledgments

Built with:
- **GSAP** — The standard for modern web animation
- **Framer Motion** — Intuitive motion library
- **Tailwind CSS** — Efficient styling
- **Vite** — Blazing fast builds
- And the incredible React ecosystem

---

**Last Updated**: January 2026  
**Status**: Actively maintained

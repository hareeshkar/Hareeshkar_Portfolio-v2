import { useEffect, useState } from "react";

const VIDEOS = [
  { src: "videos/fsc.mp4", priority: "high" },
  { src: "videos/isc.mp4", priority: "high" },
  { src: "videos/aic.mp4", priority: "high" },
];

// Video cache to prevent re-downloads
const videoCache = new Map();

export default function VideoPreloader() {
  const [loadedVideos, setLoadedVideos] = useState(new Set());

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    // Aggressive preloading on good connections, lazy on slow
    const effectiveType = connection?.effectiveType || "4g";
    const shouldAggressivePreload = ["4g", "wifi"].includes(effectiveType);

    const preloadVideo = async (videoConfig) => {
      const { src, priority } = videoConfig;

      // Check cache first
      if (videoCache.has(src)) {
        setLoadedVideos((prev) => new Set(prev).add(src));
        return;
      }

      try {
        // Create video element for preloading
        const video = document.createElement("video");
        video.preload = shouldAggressivePreload ? "auto" : "metadata";
        video.src = src;
        video.muted = true;
        video.playsInline = true;

        // Promise-based loading
        await new Promise((resolve, reject) => {
          video.addEventListener("loadeddata", () => {
            videoCache.set(src, video);
            setLoadedVideos((prev) => new Set(prev).add(src));
            resolve();
          });
          video.addEventListener("error", reject);

          // Start loading
          video.load();
        });

        console.log(`✓ Preloaded: ${src}`);
      } catch (error) {
        console.warn(`Failed to preload ${src}:`, error);
      }
    };

    // Stagger loading to prevent network congestion
    const loadSequentially = async () => {
      for (let i = 0; i < VIDEOS.length; i++) {
        await preloadVideo(VIDEOS[i]);
        // Small delay between videos
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    // Start preloading after initial page load
    if (document.readyState === "complete") {
      loadSequentially();
    } else {
      window.addEventListener("load", loadSequentially);
    }

    return () => {
      window.removeEventListener("load", loadSequentially);
    };
  }, []);

  // Expose loaded status globally for debugging
  useEffect(() => {
    window.__videoPreloadStatus = {
      loaded: Array.from(loadedVideos),
      total: VIDEOS.length,
      cache: videoCache,
    };
  }, [loadedVideos]);

  return null;
}

// Export cache for use in components
export { videoCache };

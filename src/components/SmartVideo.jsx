import React, { useRef, useEffect, useState, forwardRef } from "react";
import { videoCache } from "./VideoPreloader";

const SmartVideo = forwardRef(
  ({ src, poster, className, style, ...props }, ref) => {
    const internalVideoRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [posterUrl, setPosterUrl] = useState(null);

    // Merge external ref with internal ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(internalVideoRef.current);
        } else {
          ref.current = internalVideoRef.current;
        }
      }
    }, [ref]);

    // Generate poster frame from video
    useEffect(() => {
      if (!src || poster) return;

      const generatePoster = async () => {
        try {
          const cachedVideo = videoCache.get(src);
          if (cachedVideo) {
            const canvas = document.createElement("canvas");
            canvas.width = cachedVideo.videoWidth || 320;
            canvas.height = cachedVideo.videoHeight || 240;
            const ctx = canvas.getContext("2d");

            cachedVideo.currentTime = 0.1;
            await new Promise((resolve) => {
              cachedVideo.addEventListener("seeked", resolve, { once: true });
            });

            ctx.drawImage(cachedVideo, 0, 0, canvas.width, canvas.height);
            const posterDataUrl = canvas.toDataURL("image/jpeg", 0.8);
            setPosterUrl(posterDataUrl);
          }
        } catch (error) {
          console.warn("Failed to generate poster:", error);
        }
      };

      generatePoster();
    }, [src, poster]);

    // Use cached video or load fresh
    useEffect(() => {
      if (!internalVideoRef.current || !src) return;

      const video = internalVideoRef.current;
      const cachedVideo = videoCache.get(src);

      if (cachedVideo) {
        // Clone cached video source
        video.src = cachedVideo.src;

        // Wait for video to be ready
        const handleCanPlay = () => {
          setIsReady(true);
        };

        video.addEventListener("canplay", handleCanPlay, { once: true });

        // Force load
        video.load();

        return () => {
          video.removeEventListener("canplay", handleCanPlay);
        };
      } else {
        // Load fresh
        const handleLoadedData = () => setIsReady(true);
        video.addEventListener("loadeddata", handleLoadedData, { once: true });

        return () => {
          video.removeEventListener("loadeddata", handleLoadedData);
        };
      }
    }, [src]);

    return (
      <div className="relative w-full h-full">
        {/* Poster/Loading state */}
        {!isReady && (
          <div
            className="absolute inset-0 bg-neutral-900 animate-pulse"
            style={{
              backgroundImage: posterUrl ? `url(${posterUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "grayscale(100%) brightness(0.6)",
            }}
          />
        )}

        {/* Actual video */}
        <video
          ref={internalVideoRef}
          className={className}
          style={{
            ...style,
            opacity: isReady ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
          poster={poster || posterUrl}
          {...props}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }
);

SmartVideo.displayName = "SmartVideo";

export default SmartVideo;

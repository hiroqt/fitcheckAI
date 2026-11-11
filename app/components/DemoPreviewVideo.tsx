"use client";

import { useEffect, useRef, useState } from "react";

export function DemoPreviewVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;
    let isLoaded = false;
    const play = () => {
      if (!isLoaded) {
        video.src = "/demo-preview.mp4";
        video.load();
        isLoaded = true;
      }
      if (!motionPreference.matches && !document.hidden) void video.play().catch(() => {});
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) play();
      else video.pause();
    }, { rootMargin: "120px" });

    setReducedMotion(motionPreference.matches);
    if (observer) observer.observe(video);
    else {
      isVisible = true;
      play();
    }

    const updateMotion = () => {
      setReducedMotion(motionPreference.matches);
      if (motionPreference.matches) video.pause();
      else if (isVisible) play();
    };
    const updateVisibility = () => {
      if (document.hidden) video.pause();
      else if (isVisible && !motionPreference.matches) play();
    };
    motionPreference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      observer?.disconnect();
      motionPreference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      video.pause();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      aria-label="Live style preview shown on the FitCheck demo"
      controls={reducedMotion}
      loop
      muted
      playsInline
      preload="none"
      poster="/demo-preview-poster.jpg"
      className="block aspect-[53/40] w-full bg-[#101b43] object-cover"
    />
  );
}

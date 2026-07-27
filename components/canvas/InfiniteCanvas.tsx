"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";

interface InfiniteCanvasProps {
  children: React.ReactNode;
}

export default function InfiniteCanvas({ children }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // State for scale
  const [scale, setScale] = useState(1);
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 30 });

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    scaleSpring.set(scale);
  }, [scale, scaleSpring]);

  // Handle wheel for zoom (desktop)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.01), 2);
      setScale(newScale);
    }
  }, [scale]);

  // Pinch zoom support for mobile
  const lastTouchRef = useRef<{ distance: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchRef.current = { distance: Math.hypot(dx, dy) };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchRef.current) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const delta = (distance - lastTouchRef.current.distance) * 0.008;
      const newScale = Math.min(Math.max(0.5, scale + delta), 2);
      setScale(newScale);
      lastTouchRef.current = { distance };
    }
  }, [scale]);

  const handleTouchEnd = useCallback(() => {
    lastTouchRef.current = null;
  }, []);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-[var(--color-brand-navy-900)] ${isMobile ? "touch-auto" : "touch-none"}`}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <motion.div
        drag
        dragMomentum={true}
        dragElastic={0.2}
        whileTap={{ cursor: "grabbing" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab flex items-center justify-center"
        style={{
          width: isMobile ? "2000px" : "4000px",
          height: isMobile ? "2000px" : "4000px",
          scale: scaleSpring,
        }}
      >
        {children}
      </motion.div>

      {/* Zoom Controls Overlay */}
      <div className="absolute top-24 right-6 glass-panel flex flex-col gap-2 p-2 rounded-xl pointer-events-auto">
        <button
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          -
        </button>
      </div>

      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 px-4 py-2 glass-panel rounded-full text-xs text-white/50 pointer-events-none">
        {isMobile ? "Geser untuk navigasi, cubit untuk zoom" : "Drag untuk memindahkan kanvas, Ctrl+Scroll untuk zoom"}
      </div>
    </div>
  );
}

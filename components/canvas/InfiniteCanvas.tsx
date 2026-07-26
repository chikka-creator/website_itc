"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface InfiniteCanvasProps {
  children: React.ReactNode;
}

export default function InfiniteCanvas({ children }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for scale
  const [scale, setScale] = useState(1);
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 30 });

  useEffect(() => {
    scaleSpring.set(scale);
  }, [scale, scaleSpring]);

  // Handle wheel for zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newScale = Math.min(Math.max(0.5, scale - e.deltaY * 0.01), 2);
      setScale(newScale);
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[var(--color-brand-navy-900)] touch-none"
      onWheel={handleWheel}
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
        className="absolute w-[4000px] h-[4000px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab flex items-center justify-center"
        style={{ scale: scaleSpring }}
      >
        {children}
      </motion.div>

      {/* Zoom Controls Overlay */}
      <div className="absolute top-24 right-6 glass-panel flex flex-col gap-2 p-2 rounded-xl pointer-events-auto">
        <button 
          onClick={() => setScale(s => Math.min(s + 0.1, 2))}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          +
        </button>
        <button 
          onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          -
        </button>
      </div>
      
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 px-4 py-2 glass-panel rounded-full text-xs text-white/50 pointer-events-none">
        Drag untuk memindahkan kanvas, Ctrl+Scroll untuk zoom
      </div>
    </div>
  );
}

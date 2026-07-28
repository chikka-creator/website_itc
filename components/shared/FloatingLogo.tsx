"use client";

import { motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";

interface FloatingLogoProps {
  src: string;
  label: string;
  initialX: number;
  initialY: number;
  size?: number;
  delay?: number;
}

export default function FloatingLogo({
  src,
  label,
  initialX,
  initialY,
  size = 80,
  delay = 0,
}: FloatingLogoProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(initialX);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragElastic={0.12}
      dragTransition={{
        bounceStiffness: 300,
        bounceDamping: 30,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: initialY + 25 }}
      animate={{
        opacity: 1,
        y: initialY,
        scale: isDragging ? 1.12 : 1,
        zIndex: isDragging ? 50 : 20,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.5 + delay * 0.15,
      }}
      style={{
        x,
        willChange: "transform",
      }}
      className="absolute z-20 cursor-grab active:cursor-grabbing"
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(162,210,255,0.15)]"
        style={{
          width: size + 32,
          height: size + 56,
          background: "linear-gradient(145deg, rgba(162,210,255,0.3), rgba(254,249,239,0.2))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(162,210,255,0.3)",
        }}
      >
        <div className="flex items-center justify-center relative" style={{ height: size + 24, padding: "16px" }}>
          <Image
            src={src}
            alt={label}
            width={size}
            height={size}
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 text-center pb-3">
          <span className="text-[10px] font-bold text-brand-offwhite/50 uppercase tracking-[0.15em]">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

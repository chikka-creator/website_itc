"use client";

import { motion, useMotionValue, useTransform, useVelocity, useSpring } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  const smoothVelocityX = useSpring(xVelocity, { damping: 30, stiffness: 120, mass: 0.8 });
  const smoothVelocityY = useSpring(yVelocity, { damping: 30, stiffness: 120, mass: 0.8 });

  const rotateY = useTransform(smoothVelocityX, [-800, 0, 800], [-25, 0, 25]);
  const rotateX = useTransform(smoothVelocityY, [-800, 0, 800], [25, 0, -25]);
  const rotateZ = useTransform(smoothVelocityX, [-800, 0, 800], [-5, 0, 5]);

  return (
    <motion.div
      ref={containerRef}
      drag={!isMobile}
      dragMomentum={true}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isHovered && !isMobile ? 1.1 : 1,
        opacity: 1,
        zIndex: isDragging ? 50 : 20,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        delay: 0.6 + delay * 0.18,
      }}
      style={{
        x,
        y,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        rotateZ: isMobile ? 0 : rotateZ,
        perspective: isMobile ? "none" : 1200,
        transformOrigin: "center center",
      }}
      className={`absolute z-20 ${isMobile ? "" : "cursor-grab active:cursor-grabbing"}`}
    >
      {/* 3D Card Container — glassmorphism like DraggableWindow */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-shadow duration-300 ${
          isDragging
            ? "shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(245,158,11,0.15)]"
            : "shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(245,158,11,0.1)]"
        }`}
        style={{
          width: size + 32,
          height: size + 56,
          background: isDragging
            ? "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
            : "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: isDragging
            ? "1px solid rgba(245,158,11,0.25)"
            : "1px solid rgba(255,255,255,0.12)",
          boxShadow: isDragging
            ? "0 30px 60px rgba(0,0,0,0.5), 0 0 30px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.15)"
            : isHovered
            ? "0 12px 40px rgba(0,0,0,0.4), 0 4px 12px rgba(245,158,11,0.12), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Glow effect — intensifies on hover/drag */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-500"
          style={{
            opacity: isDragging ? 0.6 : isHovered ? 0.3 : 0,
            background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.15), transparent 70%)",
          }}
        />

        {/* Logo image */}
        <div className="flex items-center justify-center relative" style={{ height: size + 24, padding: "16px" }}>
          <Image
            src={src}
            alt={label}
            width={size}
            height={size}
            className="object-contain"
            style={{
              filter: `drop-shadow(0 ${isDragging ? "6" : "2"}px ${isDragging ? "16" : "8"}px rgba(0,0,0,${isDragging ? "0.6" : "0.4"}))`,
              transition: "filter 0.3s ease",
            }}
          />
        </div>

        {/* Label */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-3">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.15em]">
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

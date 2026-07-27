"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ReactNode } from "react";

interface FloatingLogoProps {
  icon: ReactNode;
  label: string;
  initialX: number;
  initialY: number;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

export default function FloatingLogo({
  icon,
  label,
  initialX,
  initialY,
  size = "md",
  delay = 0,
}: FloatingLogoProps) {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const xVelocity = useSpring(0, { stiffness: 100, damping: 20 });
  const yVelocity = useSpring(0, { stiffness: 100, damping: 20 });

  const rotateY = useTransform(xVelocity, [-500, 0, 500], [-15, 0, 15]);
  const rotateX = useTransform(yVelocity, [-500, 0, 500], [15, 0, -15]);

  const sizeClasses = {
    sm: "w-14 h-14",
    md: "w-18 h-18",
    lg: "w-22 h-22",
  };

  const iconSizes = { sm: 20, md: 26, lg: 32 };

  return (
    <motion.div
      drag
      dragMomentum={true}
      dragElastic={0.15}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        delay: 0.6 + delay * 0.15,
      }}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        perspective: 600,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      className="absolute z-20 cursor-grab active:cursor-grabbing"
    >
      <div
        className={`${sizeClasses[size]} rounded-2xl glass-panel flex flex-col items-center justify-center gap-1.5 shadow-[0_8px_32px_rgba(245,158,11,0.15)] border border-white/10 hover:border-[var(--color-brand-amber)]/30 transition-colors`}
      >
        <div className="text-[var(--color-brand-amber)]">{icon}</div>
        <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider leading-none">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect, useCallback, ReactNode } from "react";

interface FloatingCardProps {
  children: ReactNode;
  initialX: number;
  initialY: number;
  delay?: number;
  className?: string;
  rotate?: number;
}

export default function FloatingCard({
  children,
  initialX,
  initialY,
  delay = 0,
  className = "",
  rotate = 0,
}: FloatingCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const x = useMotionValue(initialX);

  const handleDragStart = useCallback(() => setIsDragging(true), []);
  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <motion.div
      drag={!isMobile}
      dragMomentum={false}
      dragElastic={0.12}
      dragTransition={{
        bounceStiffness: 300,
        bounceDamping: 30,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ opacity: 0, y: initialY + 30 }}
      animate={{
        opacity: 1,
        y: initialY,
        rotate: rotate,
        scale: isDragging ? 1.06 : 1,
        zIndex: isDragging ? 50 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.3 + delay * 0.15,
      }}
      style={{
        x,
        willChange: "transform",
      }}
      className={`absolute z-10 ${isMobile ? "" : "cursor-grab active:cursor-grabbing"} ${className}`}
    >
      <div className="glass-panel-card rounded-2xl shadow-[0_8px_24px_rgba(162,210,255,0.1)]"
        style={{ transition: "box-shadow 0.3s ease-out" }}>
        {children}
      </div>
    </motion.div>
  );
}

"use client";

import { motion, useMotionValue, useVelocity, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  const smoothVelocityX = useSpring(xVelocity, { damping: 30, stiffness: 120, mass: 0.8 });
  const smoothVelocityY = useSpring(yVelocity, { damping: 30, stiffness: 120, mass: 0.8 });

  const rotateY = useTransform(smoothVelocityX, [-800, 0, 800], [-20, 0, 20]);
  const rotateX = useTransform(smoothVelocityY, [-800, 0, 800], [20, 0, -20]);
  const rotateZ = useTransform(smoothVelocityX, [-800, 0, 800], [-4, 0, 4]);

  return (
    <motion.div
      drag={!isMobile}
      dragMomentum={true}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onPointerDown={(e) => e.stopPropagation()}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ scale: 0, opacity: 0, rotate: rotate - 15 }}
      animate={{
        scale: isHovered && !isMobile ? 1.05 : 1,
        opacity: 1,
        rotate: rotate,
        zIndex: isDragging ? 50 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 15,
        delay: 0.4 + delay * 0.12,
      }}
      style={{
        x,
        y,
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        rotateZ: isMobile ? 0 : rotateZ,
        perspective: isMobile ? "none" : 1000,
        transformOrigin: "center center",
      }}
      className={`absolute z-10 ${isMobile ? "" : "cursor-grab active:cursor-grabbing"} ${className}`}
    >
      <div
        className={`transition-shadow duration-300 ${
          isDragging
            ? "shadow-[0_25px_50px_rgba(0,0,0,0.4)]"
            : isHovered
            ? "shadow-[0_15px_35px_rgba(0,0,0,0.25)]"
            : "shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
        }`}
      >
        {children}
      </div>
    </motion.div>
  );
}

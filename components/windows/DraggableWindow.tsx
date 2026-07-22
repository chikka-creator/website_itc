"use client";

import { motion, useDragControls, useMotionValue, useTransform, useVelocity, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { GripHorizontal, X } from "lucide-react";

interface DraggableWindowProps {
  title: string;
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  className?: string;
  onFocus?: () => void;
  isFocused?: boolean;
}

export default function DraggableWindow({
  title,
  children,
  initialX = 0,
  initialY = 0,
  className,
  onFocus,
  isFocused = false,
}: DraggableWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);

  // Motion values to track drag position
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  // Initialize values
  useEffect(() => {
    x.set(initialX);
    y.set(initialY);
  }, [initialX, initialY, x, y]);

  // Track velocity to create the "paper pull" effect
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Make the spring much softer so the animation feels like a fluid drag
  const smoothVelocityX = useSpring(xVelocity, { damping: 30, stiffness: 120, mass: 0.8 });
  const smoothVelocityY = useSpring(yVelocity, { damping: 30, stiffness: 120, mass: 0.8 });

  // Map velocity to 3D rotation (tilt) and 2D rotation (skew)
  // Narrow the velocity range ([-800, 800]) and increase the degree limits ([-25, 25])
  // so the tilt is much more visible even on slower drags.
  const rotateY = useTransform(smoothVelocityX, [-800, 0, 800], [-25, 0, 25]);
  const rotateX = useTransform(smoothVelocityY, [-800, 0, 800], [25, 0, -25]);
  // Slightly increase the twist
  const rotateZ = useTransform(smoothVelocityX, [-800, 0, 800], [-5, 0, 5]);

  return (
    <motion.div
      ref={containerRef}
      drag
      dragControls={dragControls}
      dragListener={false} // Only drag from handle
      dragMomentum={true}
      dragElastic={0.1}
      onDragStart={() => {
        setIsDragging(true);
        onFocus?.();
      }}
      onDragEnd={() => setIsDragging(false)}
      onPointerDown={onFocus}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: isFocused ? 1.02 : 1, 
        opacity: isFocused ? 1 : 0.85,
        filter: isFocused ? "blur(0px)" : "blur(2px)",
        zIndex: isFocused ? 40 : 10
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{ 
        x, 
        y,
        rotateX,
        rotateY,
        rotateZ,
        perspective: 1200,
        transformOrigin: "center center"
      }}
      className={twMerge(
        clsx(
          "absolute flex flex-col rounded-2xl overflow-hidden transition-shadow duration-300",
          isFocused ? "glass-panel shadow-2xl" : "glass-panel-light dark:glass-panel shadow-lg",
          isDragging ? "cursor-grabbing shadow-[0_30px_60px_rgba(0,0,0,0.4)]" : "",
          className
        )
      )}
    >
      {/* Window Header / Drag Handle */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal size={16} className="text-white/40" />
          <span className="text-sm font-semibold tracking-wide text-white/80">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Window Content */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
}

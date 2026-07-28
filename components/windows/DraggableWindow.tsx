"use client";

import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useState, useRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { GripHorizontal } from "lucide-react";

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

  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  return (
    <motion.div
      ref={containerRef}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.12}
      dragTransition={{
        bounceStiffness: 300,
        bounceDamping: 30,
      }}
      onDragStart={() => {
        setIsDragging(true);
        onFocus?.();
      }}
      onDragEnd={() => setIsDragging(false)}
      onPointerDown={onFocus}
      initial={{ opacity: 0, y: initialY + 40 }}
      animate={{
        opacity: isFocused ? 1 : 0.85,
        y: initialY,
        scale: isDragging ? 1.03 : isFocused ? 1.02 : 1,
        zIndex: isFocused ? 40 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        x,
        y,
        willChange: "transform",
      }}
      className={twMerge(
        clsx(
          "absolute flex flex-col rounded-2xl overflow-hidden",
          "liquid-glass",
          isFocused ? "liquid-glass-focused" : "liquid-glass-warm",
          isDragging ? "cursor-grabbing" : "",
          className
        )
      )}
    >
      {/* Window Header / Drag Handle */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-black/90 border-b border-white/10 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal size={16} className="text-white/40" />
          <span className="text-sm font-semibold tracking-wide text-white/80">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
      </div>

      {/* Window Content */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
}

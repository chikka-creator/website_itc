"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

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
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  const xVelocity = useSpring(0, { stiffness: 100, damping: 20 });
  const yVelocity = useSpring(0, { stiffness: 100, damping: 20 });

  const rotateY = useTransform(xVelocity, [-500, 0, 500], [-20, 0, 20]);
  const rotateX = useTransform(yVelocity, [-500, 0, 500], [20, 0, -20]);

  return (
    <motion.div
      drag
      dragMomentum={true}
      dragElastic={0.15}
      onPointerDown={(e) => e.stopPropagation()}
      initial={{ scale: 0, opacity: 0, rotateY: -30 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 15,
        delay: 0.6 + delay * 0.18,
      }}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        perspective: 800,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.12, rotateX: -5, rotateY: 10 }}
      whileTap={{ scale: 0.95, cursor: "grabbing" }}
      className="absolute z-20 cursor-grab active:cursor-grabbing"
    >
      {/* 3D card container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: size + 32,
          height: size + 56,
          background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.3),
            0 2px 8px rgba(245,158,11,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.08), transparent 70%)",
          }}
        />

        {/* Logo image */}
        <div className="flex items-center justify-center" style={{ height: size + 24, padding: "16px" }}>
          <Image
            src={src}
            alt={label}
            width={size}
            height={size}
            className="object-contain drop-shadow-[0_4px_12px_rgba(245,158,11,0.15)]"
            style={{
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
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

"use client";

import { motion } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";
import DraggableWindow from "@/components/windows/DraggableWindow";
import { useState } from "react";
import { ArrowRight, Code, Palette, Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [focusedWindow, setFocusedWindow] = useState<string>("hero");

  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  const h = typeof window !== "undefined" ? window.innerHeight : 768;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-mesh">
      {/* Hero Content (Centered) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 p-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-display mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60"
        >
          Welcome to <br /> <span className="text-[3874FF]">ITClub</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-h2 text-white/70 max-w-2xl font-normal"
        >
          Ekstrakurikuler teknologi SMKN 1 Surabaya. <br />
          Eksplorasi kreativitas melalui kode dan desain.
        </motion.p>
      </div>

        <>
          {/* Floating Object 1: Divisi Programming */}
          <DraggableWindow
            title="Divisi Programming"
            initialX={Math.max(20, w * 0.1)}
            initialY={Math.max(100, h * 0.15)}
            className="w-[280px] h-[200px]"
            isFocused={focusedWindow === "programming"}
            onFocus={() => setFocusedWindow("programming")}
          >
            <div className="flex flex-col h-full justify-between pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Code className="text-[var(--color-brand-amber)]" />
              </div>
              <p className="text-body text-white/80">Logika, struktur, dan algoritma. Membangun fondasi sistem dari baris kode.</p>
            </div>
          </DraggableWindow>

          {/* Floating Object 2: Divisi Desain Grafis */}
          <DraggableWindow
            title="Divisi Desain Grafis"
            initialX={Math.min(w - 300, w * 0.7)}
            initialY={Math.max(150, h * 0.2)}
            className="w-[280px] h-[200px]"
            isFocused={focusedWindow === "desain"}
            onFocus={() => setFocusedWindow("desain")}
          >
            <div className="flex flex-col h-full justify-between pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Palette className="text-[var(--color-brand-amber)]" />
              </div>
              <p className="text-body text-white/80">Estetika, komposisi, dan visual. Menyampaikan pesan melalui karya seni digital.</p>
            </div>
          </DraggableWindow>

          {/* Floating Object 3: Project Terbaru */}
          <DraggableWindow
            title="Project Terbaru"
            initialX={Math.max(20, w * 0.2)}
            initialY={Math.min(h - 250, h * 0.6)}
            className="w-[320px] h-[160px]"
            isFocused={focusedWindow === "project"}
            onFocus={() => setFocusedWindow("project")}
          >
            <div className="flex flex-col h-full justify-between pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
                <Rocket className="text-[var(--color-brand-amber)]" />
              </div>
              <p className="text-body text-white/80">Lihat karya inovatif dari member ITClub.</p>
            </div>
          </DraggableWindow>
        </>

      {/* Floating Object 4: Gabung ITClub CTA */}
      <div className="absolute right-8 bottom-32 md:right-16 md:bottom-24 z-50">
        <MagneticButton>
          <Link href="/kontak">
            <div className="flex items-center gap-3 px-6 py-4 md:px-8 md:py-4 rounded-full bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] transition-shadow">
              <span>Gabung ITClub</span>
              <ArrowRight size={20} />
            </div>
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}

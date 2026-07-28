"use client";

import { useState } from "react";
import DraggableWindow from "@/components/windows/DraggableWindow";
import { Code2, Palette } from "lucide-react";
import { motion } from "framer-motion";

// Shared content for both mobile cards and desktop windows
function DivisionContent({ type }: { type: "programming" | "desain" }) {
  const isProgramming = type === "programming";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-brand-offwhite/5 border border-brand-offwhite/10 flex items-center justify-center flex-shrink-0">
          {isProgramming ? (
            <Code2 className="text-[var(--color-brand-amber)]" size={28} />
          ) : (
            <Palette className="text-[var(--color-brand-amber)]" size={28} />
          )}
        </div>
        <div>
          <h3 className="text-h2 text-brand-offwhite m-0 leading-tight">
            {isProgramming ? "Programming" : "Desain Grafis"}
          </h3>
          <span className="text-caption">
            {isProgramming ? "Logika & Struktur" : "Estetika & Komposisi"}
          </span>
        </div>
      </div>

      <p className="text-body text-brand-offwhite/80">
        {isProgramming
          ? "Divisi Programming berfokus pada pengembangan perangkat lunak, mulai dari website, aplikasi mobile, hingga struktur database. Kami belajar mengubah logika menjadi solusi digital yang fungsional."
          : "Divisi Desain Grafis mengajarkan seni komunikasi visual. Dari pembuatan logo, poster, UI/UX, hingga aset digital lainnya. Kami belajar membuat karya yang tak hanya indah, namun tepat sasaran."}
      </p>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold tracking-wider text-brand-offwhite/50 uppercase">
          Materi Pembelajaran
        </h4>
        <div className="flex flex-wrap gap-2">
          {(isProgramming
            ? ["HTML/CSS", "JavaScript", "React", "Next.js", "Database", "API"]
            : ["UI/UX Design", "Typography", "Color Theory", "Vector Art", "Branding", "Layouting"]
          ).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-lg bg-brand-offwhite/5 border border-brand-offwhite/10 text-xs font-medium text-brand-offwhite/70"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className={`mt-4 h-40 rounded-xl bg-gradient-to-${isProgramming ? "br" : "bl"} from-[var(--color-brand-navy-800)] to-transparent border border-brand-offwhite/5 flex items-center justify-center overflow-hidden`}>
        <span className="text-xs font-semibold text-brand-offwhite/40 uppercase tracking-widest text-center px-4">
          Data Sementara <br /> Foto Kegiatan
        </span>
      </div>
    </div>
  );
}

// Mobile card wrapper
function MobileDivisiCard({ type, index }: { type: "programming" | "desain"; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-2xl p-6"
    >
      <DivisionContent type={type} />
    </motion.div>
  );
}

export default function DivisiPage() {
  const [focusedWindow, setFocusedWindow] = useState<string>("programming");

  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  const isMobile = w < 768;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-mesh pt-24 px-6">
      <div className="max-w-4xl mx-auto text-center pointer-events-none mb-12">
        <h1 className="text-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6">
          Divisi ITClub
        </h1>
        <p className="text-h2 text-brand-offwhite/70 font-normal">
          Dua jalur keahlian, satu tujuan untuk berinovasi.
        </p>
      </div>

      {/* MOBILE: Static stacked cards */}
      {isMobile ? (
        <div className="max-w-md mx-auto flex flex-col gap-4 pb-40">
          <MobileDivisiCard type="programming" index={0} />
          <MobileDivisiCard type="desain" index={1} />
        </div>
      ) : (
        /* DESKTOP: Draggable windows */
        <div className="relative min-h-[600px] max-w-6xl mx-auto pb-40">
          <DraggableWindow
            title="Programming"
            initialX={Math.max(0, Math.min(20, (w - 800) / 2))}
            initialY={20}
            className="w-full max-w-[400px] min-h-[450px]"
            isFocused={focusedWindow === "programming"}
            onFocus={() => setFocusedWindow("programming")}
          >
            <DivisionContent type="programming" />
          </DraggableWindow>

          <DraggableWindow
            title="Desain Grafis"
            initialX={Math.max(0, Math.min(w - 420, (w - 400) / 2 + 100))}
            initialY={100}
            className="w-full max-w-[400px] min-h-[450px]"
            isFocused={focusedWindow === "desain"}
            onFocus={() => setFocusedWindow("desain")}
          >
            <DivisionContent type="desain" />
          </DraggableWindow>
        </div>
      )}
    </div>
  );
}

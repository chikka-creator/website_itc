"use client";

import { color, motion } from "framer-motion";
import MagneticButton from "@/components/shared/MagneticButton";
import DraggableWindow from "@/components/windows/DraggableWindow";
import { useState, useEffect } from "react";
import { ArrowRight, Code, Palette, Rocket } from "lucide-react";
import Link from "next/link";

// Card content data (reused for mobile cards and desktop windows)
const cards = [
  {
    id: "programming",
    title: "Divisi Programming",
    icon: Code,
    description: "Logika, struktur, dan algoritma. Membangun fondasi sistem dari baris kode.",
  },
  {
    id: "desain",
    title: "Divisi Desain Grafis",
    icon: Palette,
    description: "Estetika, komposisi, dan visual. Menyampaikan pesan melalui karya seni digital.",
  },
  {
    id: "project",
    title: "Project Terbaru",
    icon: Rocket,
    description: "Lihat karya inovatif dari member ITClub.",
  },
];

// Mobile card component (static, no drag)
function MobileCard({ card, index }: { card: typeof cards[0]; index: number }) {
  const Icon = card.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-card rounded-2xl p-6 flex flex-col gap-4 relative z-10"
    >
      <div className="w-12 h-12 rounded-full bg-brand-offwhite/10 flex items-center justify-center">
        <Icon className="text-[var(--color-brand-amber)]" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-brand-offwhite mb-1">{card.title}</h3>
        <p className="text-sm text-brand-offwhite/70 leading-relaxed">{card.description}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [focusedWindow, setFocusedWindow] = useState<string>("hero");
  const [dims, setDims] = useState({ w: 1024, h: 768 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDims({ w: window.innerWidth, h: window.innerHeight });
    setMounted(true);
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const w = dims.w;
  const h = dims.h;
  const isMobile = w < 768;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-mesh">
      {/* Hero Content (Centered) — hidden on mobile, shown on desktop */}
      <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center pointer-events-none z-0 p-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-display mb-6 tracking-tight text-brand-offwhite"
        >
          Welcome to <br /> <span className="text-brand-navy-900">ITClub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-h2 text-brand-offwhite max-w-2xl font-normal"
        >
          Ekstrakurikuler teknologi SMKN 1 Surabaya. <br />
          Eksplorasi kreativitas melalui kode dan desain.
        </motion.p>
      </div>

      {/* Content — mobile cards or desktop draggable windows */}
      {!mounted ? null : isMobile ? (
        /* MOBILE: Static cards below hero text */
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Hero text — not absolute, sits at top */}
          <div className="flex flex-col items-center justify-center text-center p-6 pt-32 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-display mb-6 tracking-tight text-brand-offwhite"
            >
              Welcome to <br /> <span className="text-[var(--color-brand-amber)]">ITClub</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-h2 text-brand-offwhite/70 max-w-sm font-normal"
            >
              Ekstrakurikuler teknologi SMKN 1 Surabaya. Eksplorasi kreativitas melalui kode dan desain.
            </motion.p>
          </div>
          {/* Cards */}
          <div className="px-6 pb-40 flex flex-col gap-4">
            {cards.map((card, i) => (
              <MobileCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </div>
      ) : (
        /* DESKTOP: Draggable floating windows */
        <>
          <DraggableWindow
            title="Divisi Programming"
            initialX={Math.max(20, w * 0.02)}
            initialY={Math.max(80, h * 0.08)}
            className="w-[280px] max-w-[90vw] h-[200px]"
            isFocused={focusedWindow === "programming"}
            onFocus={() => setFocusedWindow("programming")}
          >
            <div className="flex flex-col h-full justify-between pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-brand-offwhite/10 flex items-center justify-center mb-4">
                <Code className="text-[var(--color-brand-amber)]" />
              </div>
              <p className="text-body text-brand-offwhite/80">Logika, struktur, dan algoritma. Membangun fondasi sistem dari baris kode.</p>
            </div>
          </DraggableWindow>

          <DraggableWindow
            title="Divisi Desain Grafis"
            initialX={Math.max(20, w - 300)}
            initialY={Math.max(80, h * 0.08)}
            className="w-[280px] max-w-[90vw] h-[200px]"
            isFocused={focusedWindow === "desain"}
            onFocus={() => setFocusedWindow("desain")}
          >
            <div className="flex flex-col h-full justify-between pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-brand-offwhite/10 flex items-center justify-center mb-4">
                <Palette className="text-[var(--color-brand-amber)]" />
              </div>
              <p className="text-body text-brand-offwhite/80">Estetika, komposisi, dan visual. Menyampaikan pesan melalui karya seni digital.</p>
            </div>
          </DraggableWindow>

          <DraggableWindow
            title="Project Terbaru"
            initialX={Math.max(20, w * 0.02)}
            initialY={Math.max(20, h - 260)}
            className="w-[320px] max-w-[90vw] h-[160px]"
            isFocused={focusedWindow === "project"}
            onFocus={() => setFocusedWindow("project")}
          >
            <div className="flex flex-col h-full justify-between pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-brand-offwhite/10 flex items-center justify-center mb-2">
                <Rocket className="text-[var(--color-brand-amber)]" />
              </div>
              <p className="text-body text-brand-offwhite/80">Lihat karya inovatif dari member ITClub.</p>
            </div>
          </DraggableWindow>
        </>
      )}

      {/* Floating Object 4: Gabung ITClub CTA */}
      <div className="absolute right-8 bottom-32 md:right-16 md:bottom-24 z-50">
        <MagneticButton>
          <Link href="/kontak">
            <div className="flex items-center gap-3 px-6 py-4 md:px-8 md:py-4 rounded-full bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold shadow-[0_0_40px_rgba(255,164,27,0.3)] hover:shadow-[0_0_60px_rgba(255,164,27,0.5)] transition-shadow">
              <span>Gabung ITClub</span>
              <ArrowRight size={20} />
            </div>
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}

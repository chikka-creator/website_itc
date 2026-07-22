"use client";

import { useState, useEffect } from "react";
import DraggableWindow from "@/components/windows/DraggableWindow";
import { Code2, Palette } from "lucide-react";

export default function DivisiPage() {
  const [focusedWindow, setFocusedWindow] = useState<string>("programming");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-mesh pt-24 px-6">
      <div className="max-w-4xl mx-auto text-center pointer-events-none mb-12">
        <h1 className="text-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6">
          Divisi ITClub
        </h1>
        <p className="text-h2 text-white/70 font-normal">
          Dua jalur keahlian, satu tujuan untuk berinovasi.
        </p>
      </div>

      {mounted && (
        <div className="relative h-[600px] max-w-6xl mx-auto">
          {/* Programming Window */}
          <DraggableWindow
            title="Programming"
            initialX={Math.max(0, (window.innerWidth - 800) / 2)}
            initialY={50}
            className="w-full max-w-[400px] min-h-[450px]"
            isFocused={focusedWindow === "programming"}
            onFocus={() => setFocusedWindow("programming")}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Code2 className="text-[var(--color-brand-amber)]" size={28} />
                </div>
                <div>
                  <h3 className="text-h2 text-white m-0 leading-tight">Programming</h3>
                  <span className="text-caption">Logika & Struktur</span>
                </div>
              </div>

              <p className="text-body text-white/80">
                Divisi Programming berfokus pada pengembangan perangkat lunak, mulai dari website, aplikasi mobile, hingga struktur database. Kami belajar mengubah logika menjadi solusi digital yang fungsional.
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold tracking-wider text-white/50 uppercase">Materi Pembelajaran</h4>
                <div className="flex flex-wrap gap-2">
                  {["HTML/CSS", "JavaScript", "React", "Next.js", "Database", "API"].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* TODO(DATA): Placeholder for actual programming activity photo */}
              <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-[var(--color-brand-navy-800)] to-transparent border border-white/5 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-semibold text-white/20 uppercase tracking-widest text-center px-4">
                  Data Sementara <br /> Foto Kegiatan
                </span>
              </div>
            </div>
          </DraggableWindow>

          {/* Desain Grafis Window */}
          <DraggableWindow
            title="Desain Grafis"
            initialX={Math.min(window.innerWidth - 420, (window.innerWidth - 400) / 2 + 100)}
            initialY={100}
            className="w-full max-w-[400px] min-h-[450px]"
            isFocused={focusedWindow === "desain"}
            onFocus={() => setFocusedWindow("desain")}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="text-[var(--color-brand-amber)]" size={28} />
                </div>
                <div>
                  <h3 className="text-h2 text-white m-0 leading-tight">Desain Grafis</h3>
                  <span className="text-caption">Estetika & Komposisi</span>
                </div>
              </div>

              <p className="text-body text-white/80">
                Divisi Desain Grafis mengajarkan seni komunikasi visual. Dari pembuatan logo, poster, UI/UX, hingga aset digital lainnya. Kami belajar membuat karya yang tak hanya indah, namun tepat sasaran.
              </p>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold tracking-wider text-white/50 uppercase">Materi Pembelajaran</h4>
                <div className="flex flex-wrap gap-2">
                  {["UI/UX Design", "Typography", "Color Theory", "Vector Art", "Branding", "Layouting"].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* TODO(DATA): Placeholder for actual graphic design activity photo */}
              <div className="mt-4 h-40 rounded-xl bg-gradient-to-bl from-[var(--color-brand-navy-800)] to-transparent border border-white/5 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-semibold text-white/20 uppercase tracking-widest text-center px-4">
                  Data Sementara <br /> Foto Kegiatan
                </span>
              </div>
            </div>
          </DraggableWindow>
        </div>
      )}
    </div>
  );
}

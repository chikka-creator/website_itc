"use client";

import InfiniteCanvas from "@/components/canvas/InfiniteCanvas";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link as LinkIcon, User, Loader2, FolderKanban } from "lucide-react";

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  link_url: string | null;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
};

// Generate grid positions for cards so they don't overlap
function generatePositions(count: number): { x: number; y: number }[] {
  const cols = Math.ceil(Math.sqrt(count));
  const cardW = 380;
  const cardH = 340;
  const gapX = 40;
  const gapY = 40;

  return Array.from({ length: count }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: (col - Math.floor(cols / 2)) * (cardW + gapX),
      y: (row - Math.floor(count / cols / 2)) * (cardH + gapY),
    };
  });
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (data.projects) setProjects(data.projects);
      })
      .catch(err => console.error("Failed to load projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const positions = generatePositions(projects.length);

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute top-24 left-6 z-50 pointer-events-none">
        <h1 className="text-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-2">
          Project Canvas
        </h1>
        <p className="text-body text-brand-offwhite/70 max-w-sm">
          Jelajahi karya dari Divisi Programming dan Desain Grafis ITClub.
        </p>
      </div>

      <InfiniteCanvas>
        <div className="relative w-full h-full">
          {loading ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[var(--color-brand-amber)] animate-spin" />
              <p className="text-brand-offwhite/50 text-sm">Memuat project...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center pointer-events-auto">
              <div className="w-20 h-20 rounded-full bg-brand-offwhite/5 flex items-center justify-center">
                <FolderKanban className="text-brand-offwhite/20" size={36} />
              </div>
              <p className="text-brand-offwhite/50 text-lg font-medium">Belum ada project yang ditampilkan</p>
              <p className="text-brand-offwhite/30 text-sm max-w-xs">Project akan muncul di sini setelah admin menambahkannya melalui panel admin.</p>
            </div>
          ) : (
            projects.map((project, index) => {
              const pos = positions[index] || { x: 0, y: 0 };
              return (
                <motion.div
                  key={project.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.08 }}
                  className="absolute left-1/2 top-1/2 cursor-default pointer-events-auto group"
                  style={{ x: pos.x, y: pos.y }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="w-[280px] sm:w-[320px] md:w-[340px] max-w-[90vw] rounded-xl overflow-hidden transition-all duration-300 md:hover:scale-105 md:hover:shadow-[0_20px_60px_rgba(0,255,100,0.08)] md:hover:border-[var(--color-brand-amber)]/40 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative"
                        style={{ background: "linear-gradient(180deg, #111 0%, #0A0A0A 100%)" }}>
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]" style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
                    }} />

                    {/* Terminal Title Bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1a1a] border-b border-white/8 relative">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-[0_0_4px_rgba(255,95,86,0.4)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-[0_0_4px_rgba(255,189,46,0.4)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-[0_0_4px_rgba(39,201,63,0.4)]" />
                      </div>
                      <div className="flex items-center gap-1.5 text-white/25 text-[9px] font-mono">
                        <span>~/{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
                      </div>
                      <div className="w-[52px]" />
                    </div>

                    {/* Terminal Body */}
                    <div className="font-mono">
                      {/* Image / Preview area */}
                      <div className="w-full h-36 bg-[#050505] relative flex items-center justify-center overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-70 transition-opacity md:group-hover:opacity-100 duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <FolderKanban size={28} className="text-white/10" />
                            <span className="text-[9px] text-white/10">NO VISUAL ASSET</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-2 left-3 z-10">
                          <span className="px-2 py-0.5 bg-[var(--color-brand-amber)]/15 border border-[var(--color-brand-amber)]/25 rounded text-[8px] font-mono font-bold uppercase tracking-widest text-[var(--color-brand-amber)]">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Command output area */}
                      <div className="p-4 bg-[#0A0A0A] space-y-2">
                        {/* Command line */}
                        <div className="flex items-start gap-1.5">
                          <span className="text-[var(--color-brand-amber)] text-[11px] select-none">$</span>
                          <span className="text-white/40 text-[10px]">cat</span>
                          <span className="text-white text-[11px] font-bold">./{project.title.toLowerCase().replace(/\s+/g, '-')}</span>
                        </div>

                        {/* Output */}
                        <div className="ml-3 border-l border-white/10 pl-3 space-y-1.5">
                          <div className="flex items-start gap-1.5">
                            <span className="text-[var(--color-brand-amber)] text-[10px] shrink-0 mt-px">❯</span>
                            <h3 className="text-[12px] font-bold text-white leading-tight">{project.title}</h3>
                          </div>
                          <p className="text-white/40 text-[10px] leading-relaxed line-clamp-2">{project.description}</p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                          <div className="flex items-center gap-1.5 text-[9px] text-white/25">
                            <span className="text-[var(--color-brand-amber)]/50">user:</span>
                            <span className="text-white/50">"{project.author_name || 'anonymous'}"</span>
                          </div>
                          {project.link_url && (
                            <a
                              href={project.link_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--color-brand-amber)]/10 text-[var(--color-brand-amber)] border border-[var(--color-brand-amber)]/20 text-[9px] font-bold uppercase tracking-wider hover:bg-[var(--color-brand-amber)] hover:text-[#0A0A0A] transition-all"
                            >
                              <LinkIcon size={9} />
                              Execute
                            </a>
                          )}
                        </div>

                        {/* Blinking cursor */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[var(--color-brand-amber)] text-[10px]">$</span>
                          <span className="w-1.5 h-3 bg-[var(--color-brand-amber)] animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </InfiniteCanvas>
    </div>
  );
}

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
                  <div className="w-[280px] sm:w-[320px] md:w-[340px] max-w-[90vw] bg-[#0A0A0A]/95 backdrop-blur-xl rounded-xl overflow-hidden transition-all duration-300 md:hover:scale-105 md:hover:shadow-[0_20px_60px_rgba(162,210,255,0.15)] md:hover:border-[var(--color-brand-amber)]/30 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                    {/* Terminal Header */}
                    <div className="flex items-center px-4 py-2.5 bg-[#1C1C1C] border-b border-white/10 relative">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 text-white/30 text-[10px] font-mono truncate max-w-[120px] sm:max-w-[150px]">
                        ~/{project.title.toLowerCase().replace(/\s+/g, '-')}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-full h-40 bg-[#050505] relative flex items-center justify-center overflow-hidden border-b border-white/5">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-80 transition-opacity md:group-hover:opacity-100 duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/20">
                          <FolderKanban size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent opacity-80" />
                      <div className="absolute bottom-3 left-4">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--color-brand-amber)]">
                          [{project.category}]
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 font-mono">
                      <div className="flex gap-2 text-brand-offwhite mb-2 items-start">
                        <span className="text-[var(--color-brand-amber)] shrink-0 mt-0.5 leading-tight">❯</span>
                        <h3 className="text-[13px] font-bold text-brand-offwhite leading-tight">{project.title}</h3>
                      </div>
                      <div className="flex gap-2 text-brand-offwhite/50 mb-5 text-[11px] leading-relaxed">
                        <span className="text-[var(--color-brand-navy-900)] shrink-0 opacity-0">❯</span>
                        <p className="line-clamp-2">{project.description}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        {project.author_name ? (
                          <div className="flex items-center gap-2 text-[10px] text-[var(--color-brand-navy-900)]">
                            <span className="opacity-50">author:</span>
                            <span className="text-brand-offwhite/80">"{project.author_name}"</span>
                          </div>
                        ) : (
                          <div />
                        )}

                        {project.link_url && (
                          <a
                            href={project.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--color-brand-offwhite)]/5 text-[var(--color-brand-amber)] border border-[var(--color-brand-offwhite)]/10 text-[10px] font-semibold hover:bg-[var(--color-brand-amber)] hover:text-[#0A0A0A] transition-all"
                          >
                            <LinkIcon size={10} />
                            EXECUTE
                          </a>
                        )}
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

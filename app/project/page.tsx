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
        <p className="text-body text-white/70 max-w-sm">
          Jelajahi karya dari Divisi Programming dan Desain Grafis ITClub.
        </p>
      </div>

      <InfiniteCanvas>
        <div className="relative w-full h-full">
          {loading ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[var(--color-brand-amber)] animate-spin" />
              <p className="text-white/50 text-sm">Memuat project...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center pointer-events-auto">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <FolderKanban className="text-white/20" size={36} />
              </div>
              <p className="text-white/50 text-lg font-medium">Belum ada project yang ditampilkan</p>
              <p className="text-white/30 text-sm max-w-xs">Project akan muncul di sini setelah admin menambahkannya melalui panel admin.</p>
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
                  <div className="w-[340px] glass-panel rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_10px_40px_rgba(245,158,11,0.15)] hover:border-white/20">
                    {/* Thumbnail */}
                    <div className="w-full h-44 bg-gradient-to-br from-white/5 to-transparent relative flex items-center justify-center overflow-hidden">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/15">
                          <FolderKanban size={40} />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">{project.category}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-brand-amber)]/90 text-[var(--color-brand-navy-900)] px-2.5 py-1 rounded-md shadow-lg">
                          {project.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1">{project.title}</h3>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>

                      <div className="flex items-center justify-between">
                        {project.author_name ? (
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-brand-amber)]/80">
                            <User size={13} />
                            <span>{project.author_name}</span>
                          </div>
                        ) : (
                          <div />
                        )}

                        {project.link_url && (
                          <a
                            href={project.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
                          >
                            <LinkIcon size={12} />
                            Lihat
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

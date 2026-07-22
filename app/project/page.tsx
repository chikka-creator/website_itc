"use client";

import InfiniteCanvas from "@/components/canvas/InfiniteCanvas";
import { motion } from "framer-motion";

const dummyProjects = [
  { id: 1, title: "Sistem Informasi Manajemen", category: "Programming", x: -300, y: -200 },
  { id: 2, title: "Rebranding Logo Ekskul", category: "Desain Grafis", x: 200, y: -150 },
  { id: 3, title: "Aplikasi Presensi QR", category: "Programming", x: -150, y: 150 },
  { id: 4, title: "Poster Lomba Kemerdekaan", category: "Desain Grafis", x: 300, y: 100 },
];

export default function ProjectPage() {
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
          {dummyProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: project.id * 0.1 }}
              className="absolute left-1/2 top-1/2 cursor-default pointer-events-auto group"
              style={{ x: project.x, y: project.y }}
              onPointerDown={(e) => e.stopPropagation()} // Prevent canvas dragging when clicking card
            >
              <div className="w-[320px] glass-panel p-4 rounded-2xl transition-transform hover:scale-105 hover:shadow-[0_10px_40px_rgba(245,158,11,0.15)] hover:border-white/20">
                {/* TODO(DATA): Placeholder for project thumbnail */}
                <div className="w-full h-40 bg-white/5 rounded-xl border border-white/10 mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <span className="text-xs text-white/30 uppercase tracking-widest font-semibold text-center z-10">
                    Data Sementara <br/> Thumbnail Project
                  </span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-amber)]">
                    {project.category}
                  </span>
                  <h3 className="text-h2 !text-xl text-white">{project.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </InfiniteCanvas>
    </div>
  );
}

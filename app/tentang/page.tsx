"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Users, GraduationCap, Monitor, ArrowDown, Check, Clock, Calendar, Star, Zap, BookOpen, Code2, Palette, Send, Rocket } from "lucide-react";
import TimelineItem from "@/components/shared/TimelineItem";
import FloatingLogo from "@/components/shared/FloatingLogo";
import FloatingCard from "@/components/shared/FloatingCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TentangPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    if (timelineLineRef.current && timelineProgressRef.current) {
      gsap.to(timelineProgressRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timelineLineRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });
    }

    const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
    items.forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        }
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--color-brand-navy-900)] pb-32">
      {/* Hero Section */}
      <section className="hero-section relative min-h-[100dvh] h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0 bg-mesh opacity-50 z-0"></div>

        {/* ========== FLOATING DECORATIVE ELEMENTS ========== */}

        {/* Sticky Note — top left */}
        <FloatingCard initialX={-380} initialY={-220} delay={0} rotate={-6}>
          <div className="w-44 h-44 rounded-lg p-4 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, #fef3c7, #fde68a)",
              boxShadow: "0 8px 24px rgba(245,158,11,0.2), inset 0 -2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <p className="text-xs font-medium leading-relaxed" style={{ color: "#92400e" }}>
              Catatan: Topik bulan ini — React, UI/UX, dan API integration 🚀
            </p>
            <div className="flex items-center gap-1.5 mt-auto">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: "#a16207" }}>3 tugas selesai</span>
            </div>
          </div>
        </FloatingCard>

        {/* Task Card — left center */}
        <FloatingCard initialX={-340} initialY={40} delay={2} rotate={4}>
          <div className="w-48 rounded-xl p-4 glass-panel border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                <BookOpen size={12} className="text-blue-400" />
              </div>
              <span className="text-xs font-bold text-white/80">Today&apos;s tasks</span>
            </div>
            <div className="space-y-2.5">
              {["Buat UI Landing Page", "Setup Database API", "Review Code PR"].map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                    i < 2 ? "bg-green-500 border-green-500" : "border-white/20"
                  }`}>
                    {i < 2 && <Check size={10} className="text-white" />}
                  </div>
                  <span className={`text-[11px] ${i < 2 ? "text-white/40 line-through" : "text-white/70"}`}>
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FloatingCard>

        {/* Reminder Card — top right */}
        <FloatingCard initialX={350} initialY={-200} delay={1} rotate={5}>
          <div className="w-44 rounded-xl p-4 glass-panel border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white/80">Reminders</span>
              <Clock size={14} className="text-white/40" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                <span className="text-[10px] font-semibold text-white/60">Today&apos;s Meeting</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Calendar size={10} className="text-[var(--color-brand-amber)]" />
                  <span className="text-[10px] text-[var(--color-brand-amber)]">10:00 - 11:00</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                <span className="text-[10px] font-semibold text-white/60">Deadline Project</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Zap size={10} className="text-red-400" />
                  <span className="text-[10px] text-red-400">Besok</span>
                </div>
              </div>
            </div>
          </div>
        </FloatingCard>

        {/* Stats Card — bottom left */}
        <FloatingCard initialX={-320} initialY={220} delay={4} rotate={-3}>
          <div className="w-40 rounded-xl p-4 glass-panel border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} className="text-[var(--color-brand-amber)]" />
              <span className="text-xs font-bold text-white/80">Progress</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[var(--color-brand-amber)] to-orange-500 rounded-full" style={{ width: "72%" }} />
            </div>
            <span className="text-[10px] text-white/40 mt-1.5 block">72% minggu ini</span>
          </div>
        </FloatingCard>

        {/* Integration Card — bottom right */}
        <FloatingCard initialX={360} initialY={200} delay={3} rotate={3}>
          <div className="w-44 rounded-xl p-4 glass-panel border border-white/10">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">100+ Integrations</span>
            <div className="flex gap-2 mt-3">
              {["bg-red-500", "bg-blue-500", "bg-purple-500", "bg-green-500"].map((color, i) => (
                <div key={i} className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shadow-lg`}>
                  <Zap size={14} className="text-white" />
                </div>
              ))}
            </div>
          </div>
        </FloatingCard>

        {/* ========== TOOL LOGOS (existing) ========== */}
        <FloatingLogo src="/vscode.png" label="VS Code" initialX={-260} initialY={-100} size={64} delay={5} />
        <FloatingLogo src="/figma.png" label="Figma" initialX={270} initialY={-90} size={64} delay={6} />
        <FloatingLogo src="/postman.png" label="Postman" initialX={-240} initialY={120} size={56} delay={7} />
        <FloatingLogo src="/antigravity.png" label="Antigravity" initialX={250} initialY={130} size={56} delay={8} />

        {/* ========== HERO TEXT ========== */}
        <div className="relative z-30 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-display mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Cerita Kami
          </h1>
          <p className="text-h2 text-white/80 font-normal leading-relaxed max-w-2xl mx-auto">
            Lebih dari sekadar ekstrakurikuler. Kami adalah ruang untuk berkarya, berinovasi, dan belajar bersama.
          </p>
          <p className="mt-6 text-sm text-white/30 font-mono">
            ↓ Geser elemen di sekitar untuk berinteraksi
          </p>
        </div>

        <div className="absolute bottom-28 animate-bounce text-white/30 z-30">
          <ArrowDown size={28} />
        </div>
      </section>

      {/* Story Timeline */}
      <section className="relative px-6 max-w-4xl mx-auto mt-20">
        <div ref={timelineLineRef} className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 rounded-full overflow-hidden">
          <div ref={timelineProgressRef} className="w-full h-0 bg-gradient-to-b from-[var(--color-brand-amber)] to-[var(--color-brand-amber)]"></div>
        </div>

        <div className="space-y-24 md:space-y-32">
          <TimelineItem
            title="Pembelajaran Interaktif"
            description="Kami didampingi oleh guru yang kompeten, alumni berpengalaman, serta mentor dari Dunia Usaha / Dunia Industri (DU/DI)."
            icon={<GraduationCap className="text-[var(--color-brand-amber)]" size={24} />}
            media={
              <div className="glass-panel-light dark:glass-panel p-6 rounded-2xl">
                <div className="w-full h-48 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative overflow-hidden">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-widest relative z-10">Data Sementara - Foto Kegiatan</span>
                </div>
              </div>
            }
          />

          <TimelineItem
            reverse
            title="Ruang Lingkup Terfokus"
            description="Dengan 2 divisi utama: Programming dan Desain Grafis, kami memastikan setiap anggota mendapatkan materi yang terarah dan mendalam sesuai minat mereka."
            icon={<Monitor className="text-[var(--color-brand-amber)]" size={24} />}
            media={
              <div className="glass-panel p-6 rounded-2xl border-white/5">
                <div className="flex gap-4">
                  <div className="flex-1 h-32 rounded-xl bg-white/5 border border-white/10"></div>
                  <div className="flex-1 h-32 rounded-xl bg-white/5 border border-white/10"></div>
                </div>
              </div>
            }
          />

          <TimelineItem
            title="Keluarga Besar"
            description="Belajar bersama kakak kelas dan alumni yang siap membimbing dari nol hingga mampu membuat karya nyata yang membanggakan."
            icon={<Users className="text-[var(--color-brand-amber)]" size={24} />}
            media={
              <div className="glass-panel-light dark:glass-panel p-6 rounded-2xl">
                <div className="w-full h-48 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative overflow-hidden">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-widest relative z-10">Data Sementara - Struktur Organisasi</span>
                </div>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}

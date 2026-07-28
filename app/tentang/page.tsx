"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Users, GraduationCap, Monitor, ArrowDown, Check, Clock, Calendar, Star, Zap, BookOpen } from "lucide-react";
import TimelineItem from "@/components/shared/TimelineItem";
import FloatingLogo from "@/components/shared/FloatingLogo";
import FloatingCard from "@/components/shared/FloatingCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Responsive position helper
function r(mobile: number, tablet: number, desktop: number, w: number) {
  if (w < 640) return mobile;
  if (w < 1024) return tablet;
  return desktop;
}

export default function TentangPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1024);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setW(window.innerWidth);
    setMounted(true);
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const isMobile = w < 640;

  return (
    <div ref={containerRef} className="min-h-screen pb-40" style={{ background: "var(--bg)" }}>
      {/* Hero Section */}
      <section className="hero-section relative min-h-[100dvh] h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="hero-bg absolute inset-0 bg-mesh opacity-50 z-0"></div>

        {/* ========== FLOATING DECORATIVE ELEMENTS — RESPONSIVE POSITIONS ========== */}
        {mounted && (
          <>
            {/* Sticky Note — top left */}
            <FloatingCard
              initialX={r(-100, -240, -380, w)}
              initialY={r(-100, -150, -220, w)}
              delay={0} rotate={r(-3, -5, -6, w)}
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-sm p-3 md:p-4 flex flex-col justify-between relative bg-[var(--color-brand-amber)] shadow-[4px_12px_24px_rgba(0,0,0,0.15)] border border-black/5" style={{ transform: "rotate(-2deg)" }}>
                {/* Pushpin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-brand-slate)] shadow-md border-2 border-[var(--color-brand-offwhite)] z-10"></div>
                <p className="text-[10px] sm:text-[11px] md:text-[13px] font-medium leading-relaxed text-[#2C2C2C] mt-2 italic" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
                  Catatan: Topik bulan ini — React, UI/UX, dan API integration 🚀
                </p>
                <div className="flex items-center mt-auto">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-[var(--color-brand-navy-900)] flex items-center justify-center shadow-sm">
                    <Check size={12} className="text-[var(--color-brand-offwhite)]" />
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Task Card — left center */}
            <FloatingCard
              initialX={r(-90, -200, -340, w)}
              initialY={r(80, 50, 40, w)}
              delay={2} rotate={r(2, 3, 4, w)}
            >
              <div className="relative pt-4">
                {/* Folder Tab */}
                <div className="absolute top-0 left-0 w-20 h-6 bg-[var(--color-brand-offwhite)] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.04)]"></div>
                <div className="w-36 sm:w-40 md:w-48 rounded-xl rounded-tl-none p-3 sm:p-4 md:p-5 bg-[var(--color-brand-offwhite)] shadow-[0_15px_40px_rgba(0,0,0,0.12)] relative z-10">
                  <div className="mb-3">
                    <span className="text-[10px] md:text-[12px] font-bold text-[#1A1A1A]">Today's tasks</span>
                  </div>
                  <div className="space-y-3">
                    {["Buat UI Landing Page", "Setup Database API"].map((task, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded flex items-center justify-center bg-[var(--color-brand-slate)]`}>
                            <Check size={8} className="text-[var(--color-brand-offwhite)]" />
                          </div>
                          <span className="text-[8px] md:text-[9px] text-[#4A4A4A] font-medium">{task}</span>
                        </div>
                        <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${i === 0 ? "bg-[var(--color-brand-navy-900)] w-[60%]" : "bg-[var(--color-brand-amber)] w-[90%]"}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Reminder Card — top right */}
            <FloatingCard
              initialX={r(90, 210, 350, w)}
              initialY={r(-110, -140, -200, w)}
              delay={1} rotate={r(3, 4, 5, w)}
            >
              <div className="relative pt-4">
                {/* Folder Tab */}
                <div className="absolute top-0 right-0 w-20 h-6 bg-[var(--color-brand-offwhite)] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.04)] flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#1A1A1A]">Reminders</span>
                </div>
                <div className="w-32 sm:w-36 md:w-44 rounded-xl rounded-tr-none p-3 md:p-4 bg-[var(--color-brand-offwhite)] shadow-[0_15px_40px_rgba(0,0,0,0.12)] relative z-10 flex flex-col items-center">
                  {/* Floating Clock Icon */}
                  <div className="absolute -top-6 -left-4 w-10 h-10 rounded-xl bg-[var(--color-brand-offwhite)] shadow-[0_8px_20px_rgba(0,0,0,0.1)] flex items-center justify-center border border-black/5">
                    <Clock size={16} className="text-[#1A1A1A]" />
                  </div>
                  <div className="w-full mt-2">
                    <span className="text-[9px] md:text-[11px] font-bold text-[#1A1A1A] block mb-1">Today's Meeting</span>
                    <span className="text-[7px] md:text-[8px] text-[#666] block mb-2">Call with mentoring team</span>
                    <div className="flex items-center justify-center gap-1.5 bg-[var(--color-brand-navy-900)]/10 w-full py-1.5 rounded-md text-[8px] md:text-[9px] text-[var(--color-brand-navy-900)] font-semibold">
                      <Clock size={9} /> 10:00 - 11:00
                    </div>
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Stats Card — bottom left */}
            <FloatingCard
              initialX={r(-80, -190, -320, w)}
              initialY={r(140, 170, 220, w)}
              delay={4} rotate={r(-2, -3, -3, w)}
            >
              <div className="w-28 sm:w-32 md:w-40 rounded-xl p-3 md:p-4 bg-[var(--color-brand-offwhite)] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-black/5">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={12} className="text-[var(--color-brand-amber)]" />
                  <span className="text-[10px] md:text-xs font-bold text-[#1A1A1A]">Progress</span>
                </div>
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-brand-navy-900)] rounded-full" style={{ width: "72%" }} />
                </div>
                <span className="text-[8px] md:text-[10px] text-[#666] mt-2 block font-medium">72% minggu ini</span>
              </div>
            </FloatingCard>

            {/* Integration Card — bottom right */}
            <FloatingCard
              initialX={r(80, 220, 360, w)}
              initialY={r(120, 150, 200, w)}
              delay={3} rotate={r(2, 2, 3, w)}
            >
              <div className="relative pt-4">
                {/* Folder Tab */}
                <div className="absolute top-0 left-0 w-24 h-6 bg-[var(--color-brand-offwhite)] rounded-t-xl shadow-[0_-4px_10px_rgba(0,0,0,0.04)] flex items-center justify-center">
                  <span className="text-[7px] md:text-[8px] font-bold text-[#1A1A1A] uppercase tracking-wider">100+ Integrations</span>
                </div>
                <div className="w-32 sm:w-36 md:w-44 rounded-xl rounded-tl-none p-3 sm:p-4 bg-[var(--color-brand-offwhite)] shadow-[0_15px_40px_rgba(0,0,0,0.12)] relative z-10 border border-black/5">
                  <div className="flex gap-2 justify-center mt-1">
                    {[
                      { icon: <div className="text-[var(--color-brand-slate)] font-bold text-[10px] md:text-xs">M</div> },
                      { icon: <div className="text-[var(--color-brand-navy-900)] font-bold text-[10px] md:text-xs">#</div> },
                      { icon: <div className="text-[var(--color-brand-amber)] font-bold text-[10px] md:text-xs">31</div> }
                    ].map((item, i) => (
                      <div key={i} className={`w-7 h-7 md:w-9 md:h-9 rounded-xl bg-[var(--color-brand-offwhite)] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center border border-black/5`}>
                        {item.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* ========== TOOL LOGOS — RESPONSIVE ========== */}
            <FloatingLogo src="/vscode.png" label="VS Code" initialX={r(-80, -160, -260, w)} initialY={r(-50, -70, -100, w)} size={r(44, 54, 64, w)} delay={5} />
            <FloatingLogo src="/figma.png" label="Figma" initialX={r(80, 170, 270, w)} initialY={r(-40, -60, -90, w)} size={r(44, 54, 64, w)} delay={6} />
            <FloatingLogo src="/postman.png" label="Postman" initialX={r(-70, -150, -240, w)} initialY={r(60, 80, 120, w)} size={r(40, 48, 56, w)} delay={7} />
            <FloatingLogo src="/antigravity.png" label="Antigravity" initialX={r(70, 160, 250, w)} initialY={r(70, 90, 130, w)} size={r(40, 48, 56, w)} delay={8} />
          </>
        )}

        {/* ========== HERO TEXT ========== */}
        <div className="relative z-30 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-display mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Cerita Kami
          </h1>
          <p className="text-h2 text-brand-offwhite/80 font-normal leading-relaxed max-w-2xl mx-auto">
            Lebih dari sekadar ekstrakurikuler. Kami adalah ruang untuk berkarya, berinovasi, dan belajar bersama.
          </p>
          <p className="mt-4 md:mt-6 text-xs md:text-sm text-brand-offwhite/30 font-mono hidden md:block">
            ↓ Geser elemen di sekitar untuk berinteraksi
          </p>
        </div>

        <div className="absolute bottom-24 md:bottom-28 animate-bounce text-brand-offwhite/30 z-30">
          <ArrowDown size={24} className="md:hidden" />
          <ArrowDown size={28} className="hidden md:block" />
        </div>
      </section>

      {/* Story Timeline */}
      <section className="relative px-6 max-w-4xl mx-auto mt-20">
        <div ref={timelineLineRef} className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-brand-offwhite/10 -translate-x-1/2 rounded-full overflow-hidden">
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
                  <span className="text-xs font-semibold text-brand-offwhite/50 uppercase tracking-widest relative z-10">Data Sementara - Foto Kegiatan</span>
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
              <div className="glass-panel p-6 rounded-2xl border-brand-offwhite/5">
                <div className="flex gap-4">
                  <div className="flex-1 h-32 rounded-xl bg-brand-offwhite/5 border border-brand-offwhite/10"></div>
                  <div className="flex-1 h-32 rounded-xl bg-brand-offwhite/5 border border-brand-offwhite/10"></div>
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
                  <span className="text-xs font-semibold text-brand-offwhite/50 uppercase tracking-widest relative z-10">Data Sementara - Struktur Organisasi</span>
                </div>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
}

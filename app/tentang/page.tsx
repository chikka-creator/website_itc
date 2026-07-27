"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Users, GraduationCap, Monitor, ArrowDown } from "lucide-react";
import TimelineItem from "@/components/shared/TimelineItem";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TentangPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Parallax hero
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

    // Timeline Line Progress
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

    // Reveal items
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
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-display mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
            Cerita Kami
          </h1>
          <p className="text-h2 text-white/80 font-normal leading-relaxed">
            Lebih dari sekadar ekstrakurikuler. Kami adalah ruang untuk berkarya, berinovasi, dan belajar bersama di SMKN 1 Surabaya.
          </p>
        </div>
        <div className="absolute bottom-32 animate-bounce text-white/30">
          <ArrowDown size={32} />
        </div>
      </section>

      {/* Story Timeline */}
      <section className="relative px-6 max-w-4xl mx-auto mt-20">
        {/* Timeline Line */}
        <div ref={timelineLineRef} className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 rounded-full overflow-hidden">
          <div ref={timelineProgressRef} className="w-full h-0 bg-gradient-to-b from-[var(--color-brand-amber)] to-[var(--color-brand-amber)]"></div>
        </div>

        <div className="space-y-24 md:space-y-32">
          {/* Item 1 */}
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

          {/* Item 2 */}
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

          {/* Item 3 */}
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

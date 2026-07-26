"use client";

import { type ReactNode } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface TimelineItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  reverse?: boolean;
  media?: ReactNode;
}

export default function TimelineItem({
  title,
  description,
  icon,
  reverse = false,
  media,
}: TimelineItemProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "timeline-item relative flex flex-col items-center gap-8 md:gap-16",
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        )
      )}
    >
      <div className={twMerge(clsx("hidden md:block flex-1", reverse ? "text-left" : "text-right"))}>
        <h3 className="text-h2 text-white mb-4">{title}</h3>
        <p className="text-body text-white/70">{description}</p>
      </div>

      <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-[var(--color-brand-navy-800)] border-4 border-[var(--color-brand-navy-900)] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] ml-0 md:ml-[-1px]">
        {icon}
      </div>

      <div className="flex-1 md:hidden pl-8">
        <h3 className="text-h2 text-white mb-4">{title}</h3>
        <p className="text-body text-white/70">{description}</p>
      </div>

      <div className="hidden md:block flex-1">
        {media}
      </div>
    </div>
  );
}

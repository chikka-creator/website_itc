import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Dock from "@/components/dock/Dock";
import Providers from "@/components/shared/Providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ITClub SMKN 1 Surabaya | Digital Workspace",
  description: "Website Resmi ITClub SMKN 1 Surabaya. Ekstrakurikuler teknologi dengan divisi Programming dan Desain Grafis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[var(--color-brand-amber)] focus:text-[var(--color-brand-navy-900)] focus:rounded-lg focus:font-semibold focus:outline-none">
          Skip to content
        </a>
        <div className="noise-overlay" />
        <Providers>
          <SmoothScroll>
            <main id="main-content" className="flex-1 flex flex-col relative z-10">
              {children}
            </main>
            <Dock />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}

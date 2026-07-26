import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Dock from "@/components/dock/Dock";
import Providers from "@/components/shared/Providers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
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

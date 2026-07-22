import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Dock from "@/components/dock/Dock";

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
        <div className="noise-overlay" />
        <SmoothScroll>
          <main className="flex-1 flex flex-col relative z-10">
            {children}
          </main>
          <Dock />
        </SmoothScroll>
      </body>
    </html>
  );
}

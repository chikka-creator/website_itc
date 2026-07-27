"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import MagneticButton from "@/components/shared/MagneticButton";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registrasi berhasil! Mengarahkan ke halaman login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Terjadi kesalahan saat registrasi");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 pb-24 bg-mesh relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-md p-8 md:p-10 rounded-2xl z-10 relative"
      >
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <UserPlus className="text-[var(--color-brand-amber)]" />
        </div>
        
        <h1 className="text-h2 mb-2 text-white">Daftar Member</h1>
        <p className="text-body text-white/60 mb-8">Bergabunglah dan mulai petualangan digitalmu.</p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80" htmlFor="name">Nama Lengkap</label>
            <input 
              id="name"
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]/50 transition-all"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80" htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]/50 transition-all"
              placeholder="member@itclub.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-medium text-white/80" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]/50 transition-all"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <MagneticButton>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Daftar"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </MagneticButton>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Sudah punya akun? <Link href="/login" className="text-[var(--color-brand-amber)] hover:underline font-medium">Masuk di sini</Link>
        </p>
      </motion.div>
    </div>
  );
}

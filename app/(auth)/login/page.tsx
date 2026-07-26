"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import MagneticButton from "@/components/shared/MagneticButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Email atau password salah.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-mesh relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-md p-8 md:p-10 rounded-2xl z-10 relative"
      >
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
          <LogIn className="text-[var(--color-brand-amber)]" />
        </div>
        
        <h1 className="text-h2 mb-2 text-white">Selamat Datang</h1>
        <p className="text-body text-white/60 mb-8">Login untuk melanjutkan ke workspace Anda.</p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            />
          </div>

          <MagneticButton>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Masuk"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </MagneticButton>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Belum punya akun? <Link href="/register" className="text-[var(--color-brand-amber)] hover:underline font-medium">Daftar sekarang</Link>
        </p>
      </motion.div>
    </div>
  );
}

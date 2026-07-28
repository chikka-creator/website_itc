"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandLog {
  id: number;
  input?: string;
  output: React.ReactNode;
}

type Step = "email" | "password" | "loading" | "done";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 0,
      output: (
        <div className="space-y-2 ml-0">
          <p className="text-white/50">Welcome to ITClub Auth Terminal v1.0</p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1">
            <p className="text-[var(--color-brand-amber)] font-semibold">Petunjuk:</p>
            <p className="text-white/50">1. Ketik <span className="text-[var(--color-brand-amber)]">login</span> lalu Enter untuk mulai masuk</p>
            <p className="text-white/50">2. Masukkan email, lalu password</p>
            <p className="text-white/50">3. Ketik <span className="text-[var(--color-brand-amber)]">register</span> untuk daftar akun baru</p>
            <p className="text-white/50">4. Ketik <span className="text-[var(--color-brand-amber)]">clear</span> untuk bersihkan terminal</p>
          </div>
        </div>
      ),
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const addLog = (input: string, output: React.ReactNode) => {
    setHistory((prev) => [...prev, { id: Date.now(), input, output }]);
  };

  const clearInput = () => { setEmail(""); setPassword(""); };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "help") {
      addLog(cmd, (
        <div className="text-brand-offwhite/70 space-y-1 ml-4">
          <p><span className="text-[var(--color-brand-amber)] font-mono w-24 inline-block">login</span> - Masuk ke akun Anda</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-24 inline-block">register</span> - Daftar akun baru</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-24 inline-block">clear</span> - Bersihkan terminal</p>
        </div>
      ));
      clearInput();
      return;
    }

    if (trimmed === "clear") {
      setHistory([]);
      clearInput();
      return;
    }

    if (trimmed === "register") {
      addLog(cmd, (
        <p className="text-[var(--color-brand-amber)] ml-4">
          Redirecting ke halaman register...
        </p>
      ));
      clearInput();
      setTimeout(() => window.location.href = "/register", 800);
      return;
    }

    if (trimmed === "login") {
      addLog(cmd, (
        <div className="text-brand-offwhite/70 ml-4 space-y-1">
          <p>Masukkan email Anda:</p>
        </div>
      ));
      clearInput();
      setStep("email");
      return;
    }

    addLog(cmd, (
      <p className="text-[#FF5F56] ml-4">
        Perintah &apos;{trimmed}&apos; tidak ditemukan. Ketik &apos;help&apos; untuk daftar perintah.
      </p>
    ));
    clearInput();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (trimmed === "clear") {
      setHistory([]);
      setEmail("");
      return;
    }

    if (trimmed === "help" || trimmed === "login" || trimmed === "register") {
      handleCommand(trimmed);
      setEmail("");
      return;
    }

    if (!trimmed) return;

    addLog(trimmed, (
      <div className="text-brand-offwhite/70 ml-4 space-y-1">
        <p>Email diterima. Masukkan password Anda:</p>
      </div>
    ));
    setStep("password");
    setEmail("");
    setPassword("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();

    if (trimmed === "clear") {
      setHistory([]);
      setPassword("");
      return;
    }

    if (trimmed === "help" || trimmed === "login" || trimmed === "register") {
      handleCommand(trimmed);
      setPassword("");
      return;
    }

    if (!trimmed) return;

    const savedEmail = email || history.find((h) => h.input && h.input.includes("@"))?.input || "";
    setStep("loading");

    addLog("••••••••", (
      <p className="text-[var(--color-brand-amber)] ml-4 animate-pulse">
        Autenticating...
      </p>
    ));

    const res = await signIn("credentials", {
      redirect: false,
      email: savedEmail,
      password: trimmed,
    });

    if (res?.error) {
      addLog("", (
        <div className="text-[#FF5F56] ml-4 space-y-1">
          <p>✗ Authentication failed.</p>
          <p className="text-brand-offwhite/50 text-xs">Email atau password salah.</p>
        </div>
      ));
      setStep("email");
      setPassword("");
    } else {
      addLog("", (
        <p className="text-[#27C93F] ml-4">
          ✓ Login berhasil! Redirecting ke dashboard...
        </p>
      ));
      setStep("done");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    }
  };

  const placeholder = step === "email"
    ? "user@email.com"
    : step === "password"
    ? "••••••••"
    : step === "loading"
    ? "Processing..."
    : "Done.";

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center px-4 md:px-6 py-24" style={{ background: "var(--bg)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-3xl bg-black/85 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col h-[60vh] min-h-[450px] border border-white/10 shadow-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 bg-[#121212] border-b border-white/10 relative">
          <div className="flex gap-1.5 absolute left-4">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex items-center justify-center w-full gap-2 text-white/50 text-sm font-mono">
            <TerminalIcon size={14} />
            <span>itclub@auth: ~/login</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-4"
        >
          {history.map((log) => (
            <div key={log.id} className="space-y-2">
              {log.input !== undefined && (
                <div className="flex gap-2 text-brand-offwhite">
                  <span className="text-[var(--color-brand-amber)]">guest@itclub:~$</span>
                  <span>{log.input}</span>
                </div>
              )}
              {log.output && <div>{log.output}</div>}
            </div>
          ))}

          {/* Current Input */}
          {step !== "loading" && step !== "done" && (
            <form onSubmit={step === "email" ? handleEmailSubmit : handlePasswordSubmit} className="flex gap-2 text-brand-offwhite items-center">
              <span className="text-[var(--color-brand-amber)]">guest@itclub:~$</span>
              <input
                ref={inputRef}
                type={step === "password" ? "password" : "text"}
                value={step === "email" ? email : password}
                onChange={(e) => step === "email" ? setEmail(e.target.value) : setPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-brand-offwhite focus:ring-0 placeholder:text-brand-offwhite/20"
                placeholder={placeholder}
                autoFocus
                autoComplete={step === "email" ? "email" : "current-password"}
                spellCheck="false"
              />
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#121212] border-t border-white/10 flex items-center justify-between text-xs font-mono text-brand-offwhite/40">
          <span>ITClub Auth Terminal</span>
          <Link href="/register" className="text-[var(--color-brand-amber)] hover:text-[var(--color-brand-amber)]/80 transition-colors">
            Belum punya akun? <span className="underline">Daftar</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

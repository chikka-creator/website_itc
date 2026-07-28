"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandLog {
  id: number;
  input?: string;
  output: React.ReactNode;
}

type Step = "name" | "email" | "password" | "loading" | "done";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<Step>("name");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 0,
      output: (
        <div className="space-y-2 ml-0">
          <p className="text-white/50">Welcome to ITClub Registration Terminal v1.0</p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1">
            <p className="text-[var(--color-brand-amber)] font-semibold">Petunjuk:</p>
            <p className="text-white/50">1. Ketik <span className="text-[var(--color-brand-amber)]">register</span> lalu Enter untuk mulai daftar</p>
            <p className="text-white/50">2. Masukkan nama, email, lalu password (min 6 karakter)</p>
            <p className="text-white/50">3. Ketik <span className="text-[var(--color-brand-amber)]">login</span> jika sudah punya akun</p>
            <p className="text-white/50">4. Ketik <span className="text-[var(--color-brand-amber)]">clear</span> untuk bersihkan terminal</p>
          </div>
        </div>
      ),
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "help") {
      addLog(cmd, (
        <div className="text-brand-offwhite/70 space-y-1 ml-4">
          <p><span className="text-[var(--color-brand-amber)] font-mono w-24 inline-block">register</span> - Daftar akun baru</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-24 inline-block">login</span> - Masuk ke akun yang sudah ada</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-24 inline-block">clear</span> - Bersihkan terminal</p>
        </div>
      ));
      setName("");
      return;
    }

    if (trimmed === "clear") {
      setHistory([]);
      setName("");
      return;
    }

    if (trimmed === "login") {
      addLog(cmd, (
        <p className="text-[var(--color-brand-amber)] ml-4">
          Redirecting ke halaman login...
        </p>
      ));
      setName("");
      setTimeout(() => window.location.href = "/login", 800);
      return;
    }

    if (trimmed === "register") {
      addLog(cmd, (
        <div className="text-brand-offwhite/70 ml-4 space-y-1">
          <p>Masukkan nama lengkap Anda:</p>
        </div>
      ));
      setName("");
      setStep("name");
      return;
    }

    addLog(cmd, (
      <p className="text-[#FF5F56] ml-4">
        Perintah &apos;{trimmed}&apos; tidak ditemukan. Ketik &apos;help&apos; untuk daftar perintah.
      </p>
    ));
    setName("");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "clear") { setHistory([]); setName(""); return; }
    if (trimmed === "help" || trimmed === "login" || trimmed === "register") { handleCommand(trimmed); setName(""); return; }
    if (!trimmed) return;

    addLog(trimmed, (
      <div className="text-brand-offwhite/70 ml-4 space-y-1">
        <p>Nama diterima. Masukkan email Anda:</p>
      </div>
    ));
    setStep("email");
    setEmail("");
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (trimmed === "clear") { setHistory([]); setEmail(""); return; }
    if (trimmed === "help" || trimmed === "login" || trimmed === "register") { handleCommand(trimmed); setEmail(""); return; }
    if (!trimmed) return;

    addLog(trimmed, (
      <div className="text-brand-offwhite/70 ml-4 space-y-1">
        <p>Email diterima. Masukkan password Anda (min 6 karakter):</p>
      </div>
    ));
    setStep("password");
    setPassword("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (trimmed === "clear") { setHistory([]); setPassword(""); return; }
    if (trimmed === "help" || trimmed === "login" || trimmed === "register") { handleCommand(trimmed); setPassword(""); return; }
    if (!trimmed || trimmed.length < 6) {
      addLog(trimmed ? "••••••" : "", (
        <p className="text-[#FF5F56] ml-4">
          ✗ Password minimal 6 karakter.
        </p>
      ));
      setPassword("");
      return;
    }

    // Get name and email from history
    const nameEntry = history.find((h) => h.input && !h.input.includes("@") && h.input !== "help" && h.input !== "register" && h.input !== "login" && h.input !== "clear" && h.input.length > 1);
    const emailEntry = history.find((h) => h.input && h.input.includes("@"));

    const registerName = nameEntry?.input || "";
    const registerEmail = emailEntry?.input || "";

    setStep("loading");

    addLog("••••••••", (
      <p className="text-[var(--color-brand-amber)] ml-4 animate-pulse">
        Creating account...
      </p>
    ));

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: trimmed,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        addLog("", (
          <p className="text-[#27C93F] ml-4">
            ✓ Registrasi berhasil! Redirecting ke login...
          </p>
        ));
        setStep("done");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        addLog("", (
          <div className="text-[#FF5F56] ml-4 space-y-1">
            <p>✗ Registration failed.</p>
            <p className="text-brand-offwhite/50 text-xs">{data.message || "Terjadi kesalahan."}</p>
          </div>
        ));
        setStep("name");
        setPassword("");
      }
    } catch {
      addLog("", (
        <p className="text-[#FF5F56] ml-4">
          ✗ Terjadi kesalahan pada server.
        </p>
      ));
      setStep("name");
      setPassword("");
    }
  };

  const placeholders: Record<Step, string> = {
    name: "John Doe",
    email: "user@email.com",
    password: "••••••••",
    loading: "Processing...",
    done: "Done.",
  };

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
            <span>itclub@auth: ~/register</span>
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
            <form
              onSubmit={
                step === "name" ? handleNameSubmit :
                step === "email" ? handleEmailSubmit :
                handlePasswordSubmit
              }
              className="flex gap-2 text-brand-offwhite items-center"
            >
              <span className="text-[var(--color-brand-amber)]">guest@itclub:~$</span>
              <input
                ref={inputRef}
                type={step === "password" ? "password" : "text"}
                value={
                  step === "name" ? name :
                  step === "email" ? email :
                  password
                }
                onChange={(e) => {
                  if (step === "name") setName(e.target.value);
                  else if (step === "email") setEmail(e.target.value);
                  else setPassword(e.target.value);
                }}
                className="flex-1 bg-transparent border-none outline-none text-brand-offwhite focus:ring-0 placeholder:text-brand-offwhite/20"
                placeholder={placeholders[step]}
                autoFocus
                autoComplete={
                  step === "name" ? "name" :
                  step === "email" ? "email" :
                  "new-password"
                }
                spellCheck="false"
              />
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#121212] border-t border-white/10 flex items-center justify-between text-xs font-mono text-brand-offwhite/40">
          <span>ITClub Registration Terminal</span>
          <Link href="/login" className="text-[var(--color-brand-amber)] hover:text-[var(--color-brand-amber)]/80 transition-colors">
            Sudah punya akun? <span className="underline">Masuk</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

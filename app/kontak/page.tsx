"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";

interface CommandLog {
  id: number;
  input?: string;
  output: React.ReactNode;
}

export default function KontakPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 0,
      output: (
        <div className="text-brand-offwhite/70 space-y-1">
          <p>Welcome to ITClub Terminal v1.0</p>
          <p>Ketik <span className="text-[var(--color-brand-amber)]">help</span> untuk melihat daftar perintah yang tersedia.</p>
        </div>
      ),
    }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    let response: React.ReactNode = "";

    switch (trimmed) {
      case "help":
        response = (
          <div className="text-brand-offwhite/70 space-y-1 ml-4">
            <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">whoami</span> - Informasi tentang pengguna</p>
            <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">contact</span> - Menampilkan kontak resmi ITClub</p>
            <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">join</span> - Cara bergabung dengan ITClub</p>
            <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">clear</span> - Membersihkan terminal</p>
          </div>
        );
        break;
      case "whoami":
        response = <p className="text-brand-offwhite/70 ml-4">Anda adalah calon inovator hebat masa depan.</p>;
        break;
      case "contact":
        response = (
          <div className="text-brand-offwhite/70 space-y-2 ml-4">
            <p>Hubungi kami melalui platform berikut:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Instagram: @itclub.smkn1sby</li>
              <li>Email: itclub@smkn1-sby.sch.id</li>
              <li>
                WhatsApp: {/* TODO(DATA): Provide actual WhatsApp link */}
                <a href="https://wa.me/628815021497" className="text-[var(--color-brand-amber)] hover:underline ml-1">
                  klik untuk menghubungi kami
                </a>
              </li>
            </ul>
          </div>
        );
        break;
      case "join":
        response = (
          <div className="text-brand-offwhite/70 ml-4">
            <p>Pendaftaran member baru biasanya dibuka pada awal tahun ajaran baru (Juli-Agustus). Pantau terus Instagram resmi kami untuk info pendaftaran selanjutnya!</p>
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "":
        response = null;
        break;
      default:
        response = <p className="text-[var(--color-brand-navy-900)] ml-4">Perintah &apos;{trimmed}&apos; tidak ditemukan. Ketik &apos;help&apos; untuk daftar perintah.</p>;
    }

    setHistory((prev) => [
      ...prev,
      { id: Date.now(), input: cmd, output: response },
    ]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center px-4 md:px-6 py-24" style={{ background: "var(--bg)" }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-4xl bg-black/85 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col h-[60vh] min-h-[450px] border border-white/10 shadow-2xl"
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
            <span>itclub@smkn1sby: ~</span>
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
          <form onSubmit={handleSubmit} className="flex gap-2 text-brand-offwhite items-center">
            <span className="text-[var(--color-brand-amber)]">guest@itclub:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-brand-offwhite focus:ring-0"
              autoFocus
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </motion.div>
    </div>
  );
}

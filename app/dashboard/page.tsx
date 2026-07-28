"use client";

import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Link as LinkIcon, FileText, Clock, User, CheckCircle2,
  Plus, Send, ChevronRight, Activity, Zap
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  createdAt: string;
  user?: { name: string; email: string };
};

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [activeView, setActiveView] = useState<"terminal" | "history">("terminal");

  // Terminal state
  const [cmdHistory, setCmdHistory] = useState<{ id: number; input?: string; output: React.ReactNode }[]>([]);
  const [input, setInput] = useState("");
  const [formStep, setFormStep] = useState<"idle" | "title" | "link" | "desc">("idle");
  const [formData, setFormData] = useState({ title: "", linkUrl: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTasks();
      const onVisible = async () => {
        if (document.visibilityState === "visible") {
          const updated = await update();
          const role = (updated as any)?.user?.role;
          if (role === "admin") router.push("/admin/dashboard");
        }
      };
      document.addEventListener("visibilitychange", onVisible);
      return () => document.removeEventListener("visibilitychange", onVisible);
    }
  }, [status, router, update]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [cmdHistory]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeView, formStep]);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (res.ok) setTasks(data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const addLog = (input: string, output: React.ReactNode) => {
    setCmdHistory((prev) => [...prev, { id: Date.now(), input, output }]);
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === "help") {
      addLog(cmd, (
        <div className="text-brand-offwhite/70 space-y-1 ml-4">
          <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">submit</span> - Kumpulkan tugas baru</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">history</span> - Lihat histori tugas</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">status</span> - Lihat status sistem</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">clear</span> - Bersihkan terminal</p>
          <p><span className="text-[var(--color-brand-amber)] font-mono w-20 inline-block">logout</span> - Keluar dari sistem</p>
        </div>
      ));
      setInput("");
      return;
    }

    if (trimmed === "clear") {
      setCmdHistory([]);
      setInput("");
      return;
    }

    if (trimmed === "logout") {
      addLog(cmd, <p className="text-[var(--color-brand-amber)] ml-4">Disconnecting session...</p>);
      setInput("");
      setTimeout(() => signOut({ callbackUrl: "/" }), 800);
      return;
    }

    if (trimmed === "status") {
      addLog(cmd, (
        <div className="text-brand-offwhite/70 ml-4 space-y-1 font-mono text-xs">
          <p><span className="text-[#27C93F]">●</span> System: Online</p>
          <p><span className="text-[#27C93F]">●</span> Database: Connected</p>
          <p><span className="text-[var(--color-brand-amber)]">●</span> Tasks loaded: {tasks.length}</p>
          <p><span className="text-[#27C93F]">●</span> Session: Active</p>
        </div>
      ));
      setInput("");
      return;
    }

    if (trimmed === "history") {
      setActiveView("history");
      addLog(cmd, <p className="text-[var(--color-brand-amber)] ml-4">Switching to history view...</p>);
      setInput("");
      return;
    }

    if (trimmed === "submit") {
      setFormStep("title");
      addLog(cmd, (
        <div className="text-brand-offwhite/70 ml-4 space-y-1">
          <p>Masukkan judul tugas:</p>
        </div>
      ));
      setInput("");
      return;
    }

    addLog(cmd, (
      <p className="text-[#FF5F56] ml-4">
        Perintah &apos;{trimmed}&apos; tidak ditemukan. Ketik &apos;help&apos; untuk daftar perintah.
      </p>
    ));
    setInput("");
  };

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();

    if (formStep === "idle") {
      handleCommand(trimmed);
      return;
    }

    if (trimmed === "clear") { setCmdHistory([]); setInput(""); setFormStep("idle"); setFormData({ title: "", linkUrl: "", description: "" }); return; }
    if (trimmed === "cancel") {
      addLog(trimmed, <p className="text-[var(--color-brand-amber)] ml-4">Submission cancelled.</p>);
      setFormStep("idle");
      setFormData({ title: "", linkUrl: "", description: "" });
      setInput("");
      return;
    }
    if (!trimmed) return;

    if (formStep === "title") {
      addLog(trimmed, <p className="text-brand-offwhite/70 ml-4">Judul diterima. Masukkan link hasil kerja:</p>);
      setFormData((prev) => ({ ...prev, title: trimmed }));
      setFormStep("link");
      setInput("");
    } else if (formStep === "link") {
      addLog(trimmed, <p className="text-brand-offwhite/70 ml-4">Link diterima. Masukkan deskripsi singkat:</p>);
      setFormData((prev) => ({ ...prev, linkUrl: trimmed }));
      setFormStep("desc");
      setInput("");
    } else if (formStep === "desc") {
      setFormData((prev) => ({ ...prev, description: trimmed }));
      submitTask({ ...formData, description: trimmed });
      setInput("");
    }
  };

  const submitTask = async (data: { title: string; linkUrl: string; description: string }) => {
    setFormStep("idle");
    setIsSubmitting(true);

    addLog("••••", (
      <p className="text-[var(--color-brand-amber)] ml-4 animate-pulse">Transmitting data...</p>
    ));

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        addLog("", (
          <p className="text-[#27C93F] ml-4">
            ✓ Task transmitted successfully. ID: {result.task?.id || "N/A"}
          </p>
        ));
        fetchTasks();
      } else {
        addLog("", (
          <div className="text-[#FF5F56] ml-4">
            <p>✗ Transmission failed.</p>
            <p className="text-brand-offwhite/50 text-xs">{result.message || "Unknown error"}</p>
          </div>
        ));
      }
    } catch {
      addLog("", <p className="text-[#FF5F56] ml-4">✗ Connection error.</p>);
    } finally {
      setIsSubmitting(false);
      setFormData({ title: "", linkUrl: "", description: "" });
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-16 h-16 border-4 border-[var(--color-brand-amber)]/20 border-t-[var(--color-brand-amber)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const role = (session.user as any)?.role || "MEMBER";

  return (
    <div className="min-h-screen w-full text-brand-offwhite overflow-hidden flex flex-col md:flex-row font-sans selection:bg-[var(--color-brand-amber)] selection:text-[var(--color-brand-navy-900)]" style={{ background: "var(--bg)" }}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[var(--color-brand-amber)]/5 blur-[150px] opacity-50 rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--color-brand-slate)]/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* LEFT: SIDEBAR */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full md:w-[380px] h-auto md:h-screen p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-white/5 bg-black/80 backdrop-blur-3xl overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--color-brand-amber)] to-[var(--color-brand-slate)] rounded-2xl shadow-[0_0_30px_rgba(255,164,27,0.3)]">
              <Zap className="text-[var(--color-brand-navy-900)]" size={24} />
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#27C93F] rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">WORKSPACE<span className="text-white/30">_USR</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-amber)]">Node Active</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-3 rounded-xl bg-white/5 text-white/50 hover:bg-[#FF5F56]/10 hover:text-[#FF5F56] transition-all border border-transparent hover:border-[#FF5F56]/20"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-amber)]/10 blur-2xl rounded-full" />
          <p className="text-sm text-white/60 mb-1">Operator</p>
          <p className="text-lg font-medium text-white break-all leading-tight">{session.user?.name}</p>
          <p className="text-xs text-white/40 mt-1 break-all">{session.user?.email}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27C93F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27C93F]"></span>
            </span>
            <span className="text-xs font-mono text-[#27C93F]">SYS.ONLINE</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <FileText className="text-[var(--color-brand-slate)] mb-3 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
            <div>
              <p className="text-3xl font-light tracking-tighter">{tasks.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Tasks Sent</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <Activity className="text-[var(--color-brand-amber)] mb-3 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
            <div>
              <p className="text-3xl font-light tracking-tighter">{role}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Access Level</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-auto pt-6 flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 pl-2">Views</p>
          <button
            onClick={() => { setActiveView("terminal"); setFormStep("idle"); setInput(""); }}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              activeView === "terminal"
                ? "bg-white/10 border-white/20 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "bg-transparent border-transparent text-white/50 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              <ChevronRight size={18} className={activeView === "terminal" ? "text-[var(--color-brand-amber)]" : ""} />
              Terminal
            </span>
            {activeView === "terminal" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-amber)]" />}
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              activeView === "history"
                ? "bg-[var(--color-brand-amber)]/10 border-[var(--color-brand-amber)]/20 text-[var(--color-brand-amber)] shadow-[0_4px_20px_rgba(255,164,27,0.05)]"
                : "bg-transparent border-transparent text-white/50 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              <FileText size={18} />
              History
            </span>
            {activeView === "history" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-amber)]" />}
          </button>
        </div>
      </motion.aside>

      {/* RIGHT: MAIN CONTENT */}
      <main className="relative z-10 flex-1 h-auto md:h-screen overflow-y-auto p-6 md:p-10 pb-40 md:pb-10">
        <AnimatePresence mode="wait">
          {activeView === "terminal" ? (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto h-full flex flex-col"
            >
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-light tracking-tight mb-2">Task <span className="font-bold">Terminal</span></h2>
                  <p className="text-brand-offwhite/40 text-sm">Submit tugas via command line interface.</p>
                </div>
              </div>

              {/* Terminal Window */}
              <div className="flex-1 bg-black/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-brand-offwhite/10 flex flex-col min-h-[500px]">
                {/* Terminal Bar */}
                <div className="flex items-center px-4 py-3 bg-[#121212] border-b border-brand-offwhite/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="flex-1 text-center text-xs font-mono text-brand-offwhite/40">
                    itclub@workspace: ~{formStep !== "idle" ? "/submit" : ""}
                  </div>
                </div>

                {/* Terminal Body */}
                <div
                  ref={containerRef}
                  className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-4"
                >
                  {cmdHistory.length === 0 && (
                    <div className="text-brand-offwhite/50 space-y-1">
                      <p>ITClub Workspace Terminal v1.0</p>
                      <p>Ketik <span className="text-[var(--color-brand-amber)]">help</span> untuk melihat daftar perintah.</p>
                    </div>
                  )}

                  {cmdHistory.map((log) => (
                    <div key={log.id} className="space-y-2">
                      {log.input !== undefined && (
                        <div className="flex gap-2 text-brand-offwhite">
                          <span className="text-[var(--color-brand-amber)]">user@itclub:~$</span>
                          <span>{log.input}</span>
                        </div>
                      )}
                      {log.output && <div>{log.output}</div>}
                    </div>
                  ))}

                  {/* Input */}
                  {!isSubmitting && (
                    <form onSubmit={handleInput} className="flex gap-2 text-brand-offwhite items-center">
                      <span className="text-[var(--color-brand-amber)]">user@itclub:~$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-brand-offwhite focus:ring-0 placeholder:text-brand-offwhite/20"
                        placeholder={
                          formStep === "idle" ? "type a command..." :
                          formStep === "title" ? "judul tugas..." :
                          formStep === "link" ? "https://github.com/..." :
                          "deskripsi singkat..."
                        }
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* HISTORY VIEW */
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-light tracking-tight mb-2">Task <span className="font-bold text-[var(--color-brand-amber)]">History</span></h2>
                  <p className="text-brand-offwhite/40 text-sm">Semua tugas yang sudah Anda kumpulkan.</p>
                </div>
                <button
                  onClick={() => { setActiveView("terminal"); setFormStep("idle"); setInput(""); setCmdHistory([]); }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  <Plus size={18} />
                  Submit Tugas
                </button>
              </div>

              {loadingTasks ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[var(--color-brand-amber)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : tasks.length === 0 ? (
                <div className="w-full aspect-video border border-dashed border-brand-offwhite/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]">
                  <CheckCircle2 className="text-brand-offwhite/10 mb-4" size={48} />
                  <p className="text-brand-offwhite/40 font-mono">NO_TASKS_FOUND</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[var(--color-brand-slate)]/30 hover:bg-[var(--color-brand-navy-900)]/10 transition-all overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--color-brand-slate)]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-brand-slate)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="pr-4">
                          <h3 className="text-xl font-semibold mb-1 text-white group-hover:text-white transition-colors">{task.title}</h3>
                          <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                            <Clock size={12} />
                            {new Date(task.createdAt).toLocaleString("id-ID")}
                          </div>
                        </div>
                        <a
                          href={task.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-[40px] min-h-[40px] w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-brand-navy-900)] hover:text-white text-white/70 transition-colors"
                          title="Open Link"
                        >
                          <LinkIcon size={14} />
                        </a>
                      </div>

                      <p className="text-sm text-white/60 mb-6 line-clamp-2 relative z-10">{task.description}</p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                            {task.user?.name?.charAt(0) || "U"}
                          </div>
                          <span className="text-xs font-medium text-white/50">{task.user?.name || "Unknown"}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#27C93F] bg-[#27C93F]/10 px-2 py-1 rounded">SENT</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

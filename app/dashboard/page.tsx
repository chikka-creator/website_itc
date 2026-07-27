"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Plus, Link as LinkIcon, FileText, Clock, User, CheckCircle2 } from "lucide-react";
import MagneticButton from "@/components/shared/MagneticButton";

type Task = {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
};

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTasks();

      // When user comes back to this tab, refresh session and check role
      const onVisible = async () => {
        if (document.visibilityState === "visible") {
          const updated = await update();
          const role = (updated as any)?.user?.role;
          if (role === "admin") {
            router.push("/admin/dashboard");
          }
        }
      };
      document.addEventListener("visibilitychange", onVisible);
      return () => document.removeEventListener("visibilitychange", onVisible);
    }
  }, [status, router, update]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, linkUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Tugas berhasil dikumpulkan!");
        setTitle("");
        setDescription("");
        setLinkUrl("");
        fetchTasks(); // Refresh list
      } else {
        setMessage(data.message || "Gagal mengumpulkan tugas.");
      }
    } catch (err) {
      setMessage("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-mesh"><p className="text-white">Memuat...</p></div>;
  }

  if (!session) {
    return null; // Akan diredirect oleh useEffect
  }

  const role = (session.user as any)?.role || "MEMBER";

  return (
    <div className="min-h-screen w-full bg-mesh relative overflow-hidden py-24 pb-40 px-6 md:px-12">
      <div className="absolute inset-0 pointer-events-none z-0" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <h1 className="text-h1 text-white mb-2">Workspace</h1>
            <p className="text-body text-white/60">Selamat datang kembali, <span className="text-[var(--color-brand-amber)] font-semibold">{session.user?.name}</span> ({role})</p>
          </div>
          
          <MagneticButton>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </MagneticButton>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Pengumpulan Tugas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-panel p-6 md:p-8 rounded-2xl sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-amber)]/20 flex items-center justify-center">
                  <Plus className="text-[var(--color-brand-amber)]" />
                </div>
                <h2 className="text-xl font-bold text-white">Kumpulkan Tugas</h2>
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${message.includes('berhasil') ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/80">Judul Tugas</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]/50 transition-all"
                    placeholder="Contoh: Membuat UI Landing Page"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/80">Link Hasil Kerja</label>
                  <div className="relative">
                    <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                      type="url" 
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]/50 transition-all"
                      placeholder="https://github.com/..."
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm font-medium text-white/80">Deskripsi Singkat</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-amber)]/50 transition-all min-h-[120px] resize-none"
                    placeholder="Ceritakan sedikit tentang karya Anda..."
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Mengirim..." : "Submit Tugas"}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Histori Tugas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-panel p-6 md:p-8 rounded-2xl min-h-[600px]">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FileText className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {role === "ADMIN" ? "Semua Tugas Member" : "Histori Tugas Anda"}
                </h2>
              </div>

              {loadingTasks ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[var(--color-brand-amber)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-white/20" size={32} />
                  </div>
                  <p className="text-white/50">Belum ada tugas yang dikumpulkan.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
                          <p className="text-white/70 text-sm mb-4 line-clamp-2">{task.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
                            {role === "ADMIN" && task.user && (
                              <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>{task.user.name}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{new Date(task.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <a 
                            href={task.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors whitespace-nowrap"
                          >
                            <LinkIcon size={14} />
                            Lihat Karya
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

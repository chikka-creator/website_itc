"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Link as LinkIcon, FileText, Clock, User, CheckCircle2,
  ShieldAlert, Trash2, Plus, FolderKanban, Image, X, Users, Activity,
  Terminal as TerminalIcon, Eye, EyeOff
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  createdAt: string;
  user?: { name: string; email: string };
};

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  link_url: string | null;
  image_url: string | null;
  author_name: string | null;
  is_featured: number;
  created_at: string;
};

type ActiveTab = "tasks" | "projects";

// Stagger animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

export default function AdminDashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCategory, setProjectCategory] = useState("Programming");
  const [projectLinkUrl, setProjectLinkUrl] = useState("");
  const [projectImageUrl, setProjectImageUrl] = useState("");
  const [projectAuthor, setProjectAuthor] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");
  const [promotingTaskId, setPromotingTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      const role = (session.user as any)?.role;
      if (role !== "admin") {
        router.push("/dashboard");
      } else {
        fetchTasks();
        fetchProjects();
        const onVisible = async () => {
          if (document.visibilityState === "visible") {
            const updated = await update();
            const newRole = (updated as any)?.user?.role;
            if (newRole !== "admin") router.push("/dashboard");
          }
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
      }
    }
  }, [status, router, session, update]);

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

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok) setProjects(data.projects);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, { method: "DELETE" });
      if (res.ok) fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Yakin ingin menghapus project ini dari showcase?")) return;
    try {
      const res = await fetch(`/api/projects?id=${projectId}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleToggleFeatured = async (projectId: string, currentFeatured: number) => {
    const newStatus = currentFeatured === 1 ? 0 : 1;
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId, is_featured: newStatus }),
      });
      if (res.ok) fetchProjects();
    } catch (error) {
      console.error("Failed to toggle featured", error);
    }
  };

  const handlePromoteTask = (task: Task) => {
    setPromotingTaskId(task.id);
    setProjectTitle(task.title);
    setProjectDescription(task.description);
    setProjectLinkUrl(task.linkUrl);
    setProjectAuthor(task.user?.name || "");
    setProjectCategory("Programming");
    setProjectImageUrl("");
    setShowProjectForm(true);
    setActiveTab("projects");
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProject(true);
    setProjectMessage("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle, description: projectDescription, category: projectCategory,
          linkUrl: projectLinkUrl, imageUrl: projectImageUrl, authorName: projectAuthor,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjectMessage("Project berhasil ditambahkan ke showcase!");
        setProjectTitle(""); setProjectDescription(""); setProjectCategory("Programming");
        setProjectLinkUrl(""); setProjectImageUrl(""); setProjectAuthor("");
        setShowProjectForm(false); setPromotingTaskId(null); fetchProjects();
      } else {
        setProjectMessage(data.message || "Gagal menambahkan project.");
      }
    } catch {
      setProjectMessage("Terjadi kesalahan.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  if (status === "loading" || (loadingTasks && loadingProjects)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-[var(--color-brand-amber)]/20 border-t-[var(--color-brand-amber)] rounded-full animate-spin" />
          <p className="text-white/40 font-mono text-sm animate-pulse">INITIALIZING SYSTEM...</p>
        </motion.div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") return null;

  return (
    <div className="min-h-screen w-full text-white overflow-hidden flex flex-col md:flex-row font-mono selection:bg-[var(--color-brand-amber)] selection:text-[var(--color-brand-navy-900)]" style={{ background: "var(--bg)" }}>
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
      }} />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-[var(--color-brand-amber)]/5 blur-[150px] opacity-40 rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-brand-slate)]/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* LEFT: SIDEBAR */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full md:w-[380px] h-auto md:h-screen p-6 flex flex-col gap-5 border-b md:border-b-0 md:border-r border-white/5 bg-black/60 backdrop-blur-3xl overflow-y-auto"
      >
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--color-brand-amber)] to-[var(--color-brand-slate)] rounded-2xl shadow-[0_0_30px_rgba(255,164,27,0.3)]">
              <ShieldAlert className="text-[var(--color-brand-navy-900)]" size={24} />
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#27C93F] rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NEXUS<span className="text-white/30">_CTL</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-amber)]">Admin Node Active</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-3 rounded-xl bg-white/5 text-white/50 hover:bg-[#FF5F56]/10 hover:text-[#FF5F56] transition-all border border-transparent hover:border-[#FF5F56]/20"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-amber)]/10 blur-2xl rounded-full" />
          <p className="text-sm text-white/40 mb-1 font-mono">{'>'} Operator ID</p>
          <p className="text-lg font-medium text-white break-all leading-tight">{session.user?.email}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27C93F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27C93F]"></span>
            </span>
            <span className="text-xs font-mono text-[#27C93F]">SYS.ONLINE</span>
          </div>
        </motion.div>

        {/* HUD Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          <motion.div variants={item} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <FileText className="text-[var(--color-brand-slate)] mb-3 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
            <div>
              <p className="text-3xl font-light tracking-tighter">{tasks.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Data Ingress</p>
            </div>
          </motion.div>
          <motion.div variants={item} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <FolderKanban className="text-[var(--color-brand-amber)] mb-3 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
            <div>
              <p className="text-3xl font-light tracking-tighter">{projects.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Nodes Active</p>
            </div>
          </motion.div>
          <motion.div variants={item} className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Network Entities</p>
              <div className="flex items-center gap-2">
                <Users className="text-[var(--color-brand-amber)]" size={16} />
                <p className="text-xl font-medium">{new Set(tasks.map(t => t.user?.email)).size} Unique Users</p>
              </div>
            </div>
            <Activity className="text-white/20" size={32} />
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-auto pt-6 flex flex-col gap-2"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 pl-2">{'>'} Routing</p>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              activeTab === "tasks"
                ? "bg-white/10 border-white/20 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "bg-transparent border-transparent text-white/50 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              <TerminalIcon size={18} className={activeTab === "tasks" ? "text-[var(--color-brand-amber)]" : ""} />
              Ingress Queue
            </span>
            {activeTab === "tasks" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-amber)] animate-pulse" />}
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              activeTab === "projects"
                ? "bg-[var(--color-brand-amber)]/10 border-[var(--color-brand-amber)]/20 text-[var(--color-brand-amber)] shadow-[0_4px_20px_rgba(255,164,27,0.05)]"
                : "bg-transparent border-transparent text-white/50 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              <FolderKanban size={18} />
              Showcase Matrix
            </span>
            {activeTab === "projects" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-amber)] animate-pulse" />}
          </button>
        </motion.div>
      </motion.aside>

      {/* RIGHT: MAIN CONTENT */}
      <main className="relative z-10 flex-1 h-auto md:h-screen overflow-y-auto p-6 md:p-10 pb-40 md:pb-10">
        <AnimatePresence mode="wait">

          {/* TASKS VIEW */}
          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mx-auto"
            >
              {/* Terminal header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 text-xs font-mono text-white/30 mb-4">
                  <span className="text-[var(--color-brand-amber)]">$</span>
                  <span>nexus --view ingress-queue</span>
                  <span className="animate-pulse">_</span>
                </div>
                <h2 className="text-4xl font-light tracking-tight mb-2 font-sans">Ingress <span className="font-bold">Queue</span></h2>
                <p className="text-white/40 text-sm">Monitoring incoming data streams from network entities.</p>
              </motion.div>

              {tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.02] py-20"
                >
                  <CheckCircle2 className="text-white/10 mb-4" size={48} />
                  <p className="text-white/40 font-mono text-sm">NO_DATA_FOUND</p>
                  <p className="text-white/20 font-mono text-xs mt-2">{'>'} Menunggu data dari network entities...</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 xl:grid-cols-2 gap-4"
                >
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      variants={fadeUp}
                      className="group rounded-xl overflow-hidden border border-white/10 hover:border-[var(--color-brand-amber)]/30 transition-all shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    >
                      {/* macOS Title Bar */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-110 transition-all" />
                          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-110 transition-all" />
                          <div className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-110 transition-all" />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-white/30">
                          <TerminalIcon size={12} />
                          <span>task@nexus:~</span>
                        </div>
                        <div className="w-[52px]" />
                      </div>

                      {/* Terminal Body */}
                      <div className="bg-[#0d0d0d] p-5 font-mono text-sm">
                        {/* Command line */}
                        <div className="flex items-start gap-2 mb-3">
                          <span className="text-[var(--color-brand-amber)] select-none">{'>'}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{task.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-white/30 mt-1">
                              <Clock size={10} />
                              <span>{new Date(task.createdAt).toLocaleString("id-ID")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="ml-4 mb-4">
                          <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{task.description}</p>
                        </div>

                        {/* Output section */}
                        <div className="border-t border-white/5 pt-3 mt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                                {task.user?.name?.charAt(0) || "U"}
                              </div>
                              <span className="text-xs text-white/40">{task.user?.name}</span>
                            </div>
                            <div className="flex gap-1.5">
                              <a
                                href={task.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                title="Open URL"
                              >
                                <LinkIcon size={13} />
                              </a>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#FF5F56]/20 text-white/50 hover:text-[#FF5F56] transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                              <button
                                onClick={() => handlePromoteTask(task)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] text-[11px] font-bold uppercase tracking-wider hover:brightness-110 transition-all"
                              >
                                <FolderKanban size={11} />
                                Promote
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PROJECTS VIEW */}
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-5xl mx-auto"
            >
              {/* Terminal header */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-white/30 mb-4">
                    <span className="text-[var(--color-brand-amber)]">$</span>
                    <span>nexus --view showcase-matrix</span>
                    <span className="animate-pulse">_</span>
                  </div>
                  <h2 className="text-4xl font-light tracking-tight mb-2 font-sans">Showcase <span className="font-bold text-[var(--color-brand-amber)]">Matrix</span></h2>
                  <p className="text-white/40 text-sm">Manage active presentation nodes in the public canvas.</p>
                </div>
                <button
                  onClick={() => {
                    setShowProjectForm(!showProjectForm);
                    setPromotingTaskId(null);
                    if (!showProjectForm) {
                      setProjectTitle(""); setProjectDescription(""); setProjectCategory("Programming");
                      setProjectLinkUrl(""); setProjectImageUrl(""); setProjectAuthor("");
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  {showProjectForm ? <X size={18} /> : <Plus size={18} />}
                  {showProjectForm ? "Cancel" : "Initialize Node"}
                </button>
              </motion.div>

              <AnimatePresence>
                {showProjectForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="mb-10 overflow-hidden"
                  >
                    <div className="p-1 rounded-2xl bg-gradient-to-br from-[var(--color-brand-amber)] to-[var(--color-brand-amber)]/10">
                      <form onSubmit={handleSubmitProject} className="bg-black/80 rounded-xl p-6 md:p-8 relative">
                        <div className="absolute top-0 left-8 w-20 h-1 bg-[var(--color-brand-amber)] shadow-[0_0_20px_rgba(255,164,27,1)]" />

                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[var(--color-brand-amber)] rounded-full animate-pulse" />
                          {promotingTaskId ? "Promoting Data to Node" : "Configuring New Node"}
                        </h3>

                        {projectMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-6 p-4 rounded-xl border font-mono text-sm ${projectMessage.includes("berhasil") ? "bg-[#27C93F]/10 border-[#27C93F]/20 text-[#27C93F]" : "bg-[#FF5F56]/10 border-[#FF5F56]/20 text-[#FF5F56]"}`}
                          >
                            {projectMessage.includes("berhasil") ? "✓ " : "✗ "}{projectMessage}
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-mono">{'>'} Node Title</label>
                            <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-mono" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-mono">{'>'} Classification</label>
                            <select value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-mono appearance-none">
                              <option value="Programming" className="bg-black">Programming</option>
                              <option value="Desain Grafis" className="bg-black">Desain Grafis</option>
                              <option value="Multimedia" className="bg-black">Multimedia</option>
                              <option value="Jaringan" className="bg-black">Jaringan</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <label className="text-xs uppercase tracking-widest text-white/40 font-mono">{'>'} Payload Description</label>
                          <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all min-h-[100px] resize-none font-mono" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-mono">{'>'} Target Vector</label>
                            <input type="url" value={projectLinkUrl} onChange={(e) => setProjectLinkUrl(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-mono" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-mono">{'>'} Visual Asset</label>
                            <input type="url" value={projectImageUrl} onChange={(e) => setProjectImageUrl(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-mono" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40 font-mono">{'>'} Originator</label>
                            <input type="text" value={projectAuthor} onChange={(e) => setProjectAuthor(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-mono" />
                          </div>
                        </div>

                        <button type="submit" disabled={isSubmittingProject}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold tracking-wide font-mono hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50">
                          {isSubmittingProject ? "TRANSMITTING..." : "EXECUTE TRANSMISSION"}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/[0.02] py-20"
                >
                  <FolderKanban className="text-white/10 mb-4" size={48} />
                  <p className="text-white/40 font-mono text-sm">MATRIX_EMPTY</p>
                  <p className="text-white/20 font-mono text-xs mt-2">{'>'} Belum ada project di showcase.</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      variants={fadeUp}
                      className="group rounded-xl overflow-hidden border border-white/10 hover:border-[var(--color-brand-amber)]/30 transition-all shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                    >
                      {/* macOS Title Bar */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-white/5">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-110 transition-all" />
                          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-110 transition-all" />
                          <div className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-110 transition-all" />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-white/30">
                          <FolderKanban size={12} />
                          <span>project@nexus:~</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {project.is_featured === 1 && (
                            <span className="px-2 py-0.5 bg-[#27C93F]/20 rounded text-[9px] font-mono text-[#27C93F] border border-[#27C93F]/30 uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Terminal Body */}
                      <div className="bg-[#0d0d0d] font-mono text-sm">
                        {/* Image preview */}
                        {project.image_url ? (
                          <div className="w-full h-40 relative overflow-hidden">
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                          </div>
                        ) : (
                          <div className="w-full h-24 bg-white/[0.02] flex items-center justify-center border-b border-white/5">
                            <div className="text-white/10 flex items-center gap-2">
                              <Image size={20} />
                              <span className="text-xs">NO_VISUAL_ASSET</span>
                            </div>
                          </div>
                        )}

                        <div className="p-5">
                          {/* Command line */}
                          <div className="flex items-start gap-2 mb-3">
                            <span className="text-[var(--color-brand-amber)] select-none">{'>'}</span>
                            <h3 className="text-white font-semibold">{project.title}</h3>
                          </div>

                          <p className="text-white/50 text-xs leading-relaxed line-clamp-2 ml-4 mb-4">{project.description}</p>

                          {/* Category badge */}
                          <div className="ml-4 mb-4">
                            <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-mono text-white/40 border border-white/10">
                              {project.category}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-white/30">
                              <User size={11} />
                              <span>{project.author_name || "UNKNOWN"}</span>
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => handleToggleFeatured(project.id, project.is_featured)}
                                title={project.is_featured === 1 ? "Remove from showcase" : "Add to showcase"}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                                  project.is_featured === 1
                                    ? "bg-[#27C93F]/15 text-[#27C93F] hover:bg-[#27C93F]/25"
                                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                                }`}>
                                {project.is_featured === 1 ? <Eye size={13} /> : <EyeOff size={13} />}
                              </button>
                              {project.link_url && (
                                <a href={project.link_url} target="_blank" rel="noopener noreferrer"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
                                  <LinkIcon size={13} />
                                </a>
                              )}
                              <button onClick={() => handleDeleteProject(project.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#FF5F56]/20 text-white/40 hover:text-[#FF5F56] transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

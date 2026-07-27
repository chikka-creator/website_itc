"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Link as LinkIcon, FileText, Clock, User, CheckCircle2,
  ShieldAlert, Trash2, Plus, FolderKanban, Image, X, Users, Activity
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
  created_at: string;
};

type ActiveTab = "tasks" | "projects";

export default function AdminDashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");

  // Project form state
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

        // When user comes back to this tab, refresh session and check role
        const onVisible = async () => {
          if (document.visibilityState === "visible") {
            const updated = await update();
            const newRole = (updated as any)?.user?.role;
            if (newRole !== "admin") {
              router.push("/dashboard");
            }
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
          title: projectTitle,
          description: projectDescription,
          category: projectCategory,
          linkUrl: projectLinkUrl,
          imageUrl: projectImageUrl,
          authorName: projectAuthor,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setProjectMessage("Project berhasil ditambahkan ke showcase!");
        setProjectTitle("");
        setProjectDescription("");
        setProjectCategory("Programming");
        setProjectLinkUrl("");
        setProjectImageUrl("");
        setProjectAuthor("");
        setShowProjectForm(false);
        setPromotingTaskId(null);
        fetchProjects();
      } else {
        setProjectMessage(data.message || "Gagal menambahkan project.");
      }
    } catch (err) {
      setProjectMessage("Terjadi kesalahan.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  if (status === "loading" || (loadingTasks && loadingProjects)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="w-16 h-16 border-4 border-[var(--color-brand-amber)]/20 border-t-[var(--color-brand-amber)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") return null;

  return (
    <div className="min-h-screen w-full bg-[var(--color-brand-navy-900)] text-white overflow-hidden flex flex-col md:flex-row font-sans selection:bg-[var(--color-brand-amber)] selection:text-[var(--color-brand-navy-900)]">
      {/* Background Effects — lighter on mobile for GPU performance */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden md:block">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[var(--color-brand-amber)]/5 blur-[150px] opacity-50 rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[var(--color-brand-slate)]/5 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* LEFT: COMMAND CENTER WIDGET */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full md:w-[380px] h-auto md:h-screen p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 backdrop-blur-3xl overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[var(--color-brand-amber)] to-orange-600 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <ShieldAlert className="text-[var(--color-brand-navy-900)]" size={24} />
              <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NEXUS<span className="text-white/30">_CTL</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-amber)]">Admin Node Active</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-3 rounded-xl bg-white/5 text-white/50 hover:bg-[var(--color-brand-navy-900)]/10 hover:text-[var(--color-brand-navy-900)] transition-all border border-transparent hover:border-[var(--color-brand-navy-900)]/20"
            title="Disconnect"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand-amber)]/10 blur-2xl rounded-full" />
          <p className="text-sm text-white/60 mb-1">Operator ID</p>
          <p className="text-lg font-medium text-white break-all leading-tight">{session.user?.email}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-amber)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-amber)]"></span>
            </span>
            <span className="text-xs font-mono text-[var(--color-brand-amber)]">SYS.ONLINE</span>
          </div>
        </div>

        {/* HUD Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <FileText className="text-[var(--color-brand-slate)] mb-3 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
            <div>
              <p className="text-3xl font-light tracking-tighter">{tasks.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Data Ingress</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-colors">
            <FolderKanban className="text-[var(--color-brand-amber)] mb-3 opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
            <div>
              <p className="text-3xl font-light tracking-tighter">{projects.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/40">Nodes Active</p>
            </div>
          </div>
          <div className="col-span-2 bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Network Entities</p>
              <div className="flex items-center gap-2">
                <Users className="text-[var(--color-brand-amber)]" size={16} />
                <p className="text-xl font-medium">{new Set(tasks.map(t => t.user?.email)).size} Unique Users</p>
              </div>
            </div>
            <Activity className="text-white/20" size={32} />
          </div>
        </div>

        {/* Custom Navigation */}
        <div className="mt-auto pt-6 flex flex-col gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-2 pl-2">Routing</p>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              activeTab === "tasks"
                ? "bg-white/10 border-white/20 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
                : "bg-transparent border-transparent text-white/50 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              <FileText size={18} className={activeTab === "tasks" ? "text-[var(--color-brand-slate)]" : ""} />
              Ingress Queue
            </span>
            {activeTab === "tasks" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-slate)]" />}
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              activeTab === "projects"
                ? "bg-[var(--color-brand-amber)]/10 border-[var(--color-brand-amber)]/20 text-[var(--color-brand-amber)] shadow-[0_4px_20px_rgba(245,158,11,0.05)]"
                : "bg-transparent border-transparent text-white/50 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3 font-medium">
              <FolderKanban size={18} />
              Showcase Matrix
            </span>
            {activeTab === "projects" && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-amber)]" />}
          </button>
        </div>
      </motion.aside>

      {/* RIGHT: MAIN DATA VIEW */}
      <main className="relative z-10 flex-1 h-auto md:h-screen overflow-y-auto custom-scrollbar p-6 md:p-10 pb-40 md:pb-10">
        <AnimatePresence mode="wait">
          
          {/* TASKS VIEW */}
          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-light tracking-tight mb-2">Ingress <span className="font-bold">Queue</span></h2>
                  <p className="text-white/40 text-sm">Monitoring incoming data streams from network entities.</p>
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="w-full aspect-video border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]">
                  <CheckCircle2 className="text-white/10 mb-4" size={48} />
                  <p className="text-white/40 font-mono">NO_DATA_FOUND</p>
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
                      {/* Decorative elements */}
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
                        <div className="flex gap-2">
                          <a
                            href={task.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-[40px] min-h-[40px] w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-brand-navy-900)] hover:text-white text-white/70 transition-colors"
                            title="Inspect URL"
                          >
                            <LinkIcon size={14} />
                          </a>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="min-w-[40px] min-h-[40px] w-8 h-8 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-[var(--color-brand-navy-900)] hover:text-white text-white/70 transition-colors"
                            title="Purge Data"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-white/60 mb-6 line-clamp-2 relative z-10">{task.description}</p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50">
                            {task.user?.name.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-white/50">{task.user?.name}</span>
                        </div>
                        <button
                          onClick={() => handlePromoteTask(task)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform"
                        >
                          <FolderKanban size={12} />
                          Promote to Node
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* PROJECTS VIEW */}
          {activeTab === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-light tracking-tight mb-2">Showcase <span className="font-bold text-[var(--color-brand-amber)]">Matrix</span></h2>
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
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors shadow-lg"
                >
                  {showProjectForm ? <X size={18} /> : <Plus size={18} />}
                  {showProjectForm ? "Cancel Transmission" : "Initialize Node"}
                </button>
              </div>

              <AnimatePresence>
                {showProjectForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="mb-10 overflow-hidden"
                  >
                    <div className="p-1 rounded-2xl bg-gradient-to-br from-[var(--color-brand-amber)] to-[var(--color-brand-amber)]/10">
                      <form onSubmit={handleSubmitProject} className="bg-[var(--color-brand-navy-900)] rounded-xl p-6 md:p-8 relative">
                        <div className="absolute top-0 left-8 w-20 h-1 bg-[var(--color-brand-amber)] shadow-[0_0_20px_rgba(245,158,11,1)]" />
                        
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[var(--color-brand-amber)] rounded-full animate-pulse" />
                          {promotingTaskId ? "Promoting Data to Node" : "Configuring New Node"}
                        </h3>

                        {projectMessage && (
                          <div className={`mb-6 p-4 rounded-xl border ${projectMessage.includes("berhasil") ? "bg-[var(--color-brand-amber)]/10 border-[var(--color-brand-amber)]/20 text-[var(--color-brand-amber)]" : "bg-[var(--color-brand-navy-900)]/10 border-[var(--color-brand-navy-900)]/20 text-[var(--color-brand-navy-900)]"}`}>
                            {projectMessage}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Node Title</label>
                            <input
                              type="text"
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-medium"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Classification</label>
                            <select
                              value={projectCategory}
                              onChange={(e) => setProjectCategory(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all font-medium appearance-none"
                            >
                              <option value="Programming" className="bg-[var(--color-brand-navy-900)]">Programming</option>
                              <option value="Desain Grafis" className="bg-[var(--color-brand-navy-900)]">Desain Grafis</option>
                              <option value="Multimedia" className="bg-[var(--color-brand-navy-900)]">Multimedia</option>
                              <option value="Jaringan" className="bg-[var(--color-brand-navy-900)]">Jaringan</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <label className="text-xs uppercase tracking-widest text-white/40">Payload Description</label>
                          <textarea
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all min-h-[100px] resize-none"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Target Vector (URL)</label>
                            <input
                              type="url"
                              value={projectLinkUrl}
                              onChange={(e) => setProjectLinkUrl(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Visual Asset (URL)</label>
                            <input
                              type="url"
                              value={projectImageUrl}
                              onChange={(e) => setProjectImageUrl(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Originator</label>
                            <input
                              type="text"
                              value={projectAuthor}
                              onChange={(e) => setProjectAuthor(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-brand-amber)] focus:bg-white/10 transition-all"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingProject}
                          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--color-brand-amber)] text-[var(--color-brand-navy-900)] font-bold tracking-wide hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                          {isSubmittingProject ? "TRANSMITTING..." : "EXECUTE TRANSMISSION"}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {projects.length === 0 ? (
                <div className="w-full aspect-video border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-white/[0.02]">
                  <FolderKanban className="text-white/10 mb-4" size={48} />
                  <p className="text-white/40 font-mono">MATRIX_EMPTY</p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                  {projects.map((project, i) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="break-inside-avoid relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-amber)] to-orange-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                      <div className="relative rounded-3xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md">
                        
                        {/* Image Header */}
                        <div className="w-full h-48 bg-white/5 relative overflow-hidden flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          {project.image_url ? (
                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="text-white/10 flex flex-col items-center">
                              <Image size={40} />
                              <span className="font-mono text-xs mt-2 opacity-50">NO_VISUAL_ASSET</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-mono text-white/80 border border-white/20">
                              {project.category}
                            </span>
                            <div className="flex gap-2">
                              {project.link_url && (
                                <a href={project.link_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-[var(--color-brand-amber)] hover:text-[var(--color-brand-navy-900)] rounded-full backdrop-blur-md transition-colors">
                                  <LinkIcon size={14} />
                                </a>
                              )}
                              <button onClick={() => handleDeleteProject(project.id)} className="min-w-[40px] min-h-[40px] w-8 h-8 md:w-8 md:h-8 flex items-center justify-center bg-white/20 hover:bg-[var(--color-brand-navy-900)] hover:text-white rounded-full backdrop-blur-md transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold mb-2 group-hover:text-[var(--color-brand-amber)] transition-colors">{project.title}</h3>
                          <p className="text-white/50 text-sm mb-4 leading-relaxed">{project.description}</p>
                          <div className="flex items-center gap-2 pt-4 border-t border-white/10 text-xs font-mono text-white/40">
                            <User size={12} />
                            ORIGINATOR: {project.author_name || "UNKNOWN"}
                          </div>
                        </div>

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

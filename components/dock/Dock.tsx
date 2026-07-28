"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Layers, LayoutGrid, Terminal, LogIn, LayoutDashboard, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";
import { useTheme } from "@/components/shared/ThemeProvider";

const baseNavItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/divisi", label: "Divisi", icon: Layers },
  { href: "/project", label: "Project", icon: LayoutGrid },
  { href: "/kontak", label: "Kontak", icon: Terminal },
];

export default function Dock() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const role = (session?.user as any)?.role;

  const authItem = session
    ? { href: role === "admin" ? "/admin/dashboard" : "/dashboard", label: role === "admin" ? "Admin" : "Dashboard", icon: LayoutDashboard }
    : { href: "/login", label: "Login", icon: LogIn };

  const navItems = [...baseNavItems, authItem];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="pointer-events-auto flex items-center gap-1 md:gap-2 px-3 md:px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl"
        style={{
          background: "var(--nav-bg)",
          borderColor: "var(--nav-border)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative group" aria-label={item.label}>
              <motion.div
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex flex-col items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-300"
                style={{
                  background: isActive ? "var(--surface-hover)" : "transparent",
                  color: isActive
                    ? "var(--fg)"
                    : item.href === "/login" || item.href === "/dashboard"
                    ? "var(--color-brand-amber)"
                    : "var(--fg-muted)",
                }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--color-brand-amber)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg backdrop-blur-md"
                  style={{
                    background: "var(--card-bg)",
                    color: "var(--fg)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-8 mx-1" style={{ background: "var(--card-border)" }} />

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-colors duration-300"
          style={{ color: "var(--fg-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-amber)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </motion.nav>
    </div>
  );
}

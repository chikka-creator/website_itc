"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Info, Layers, LayoutGrid, Terminal, LogIn, LayoutDashboard } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSession } from "next-auth/react";

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
  const role = (session?.user as any)?.role;

  const authItem = session 
    ? { href: role === "admin" ? "/admin/dashboard" : "/dashboard", label: role === "admin" ? "Admin" : "Dashboard", icon: role === "admin" ? LayoutDashboard : LayoutDashboard }
    : { href: "/login", label: "Login", icon: LogIn };

  const navItems = [...baseNavItems, authItem];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-panel pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl"
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
                className={twMerge(
                  clsx(
                    "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                    item.href === "/login" || item.href === "/dashboard" ? "text-[var(--color-brand-amber)] hover:text-[var(--color-brand-amber)]" : ""
                  )
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-brand-amber)] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="glass-panel-light dark:glass-panel px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-[var(--color-brand-charcoal)] dark:text-[var(--color-brand-offwhite)] shadow-lg">
                  {item.label}
                </div>
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}

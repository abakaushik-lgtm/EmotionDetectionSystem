"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Camera,
  Mic,
  FileText,
  Layers,
  BarChart3,
  Lightbulb,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Face Detection", href: "/dashboard/face", icon: Camera },
  { label: "Audio Analysis", href: "/dashboard/audio", icon: Mic },
  { label: "Text Analysis", href: "/dashboard/text", icon: FileText },
  { label: "AI Fusion", href: "/dashboard/fusion", icon: Layers },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "AI Insights", href: "/dashboard/insights", icon: Lightbulb },
];

const adminItems = [
  { label: "Admin Panel", href: "/admin", icon: Shield },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const NavLink = ({
    item,
  }: {
    item: { label: string; href: string; icon: React.ElementType };
  }) => {
    const isActive = pathname === item.href;
    return (
      <Link href={item.href} onClick={() => setMobileOpen(false)}>
        <motion.div
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
            isActive
              ? "bg-gradient-to-r from-neon-purple/20 to-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-neon-blue"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          )}
        >
          <item.icon
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors",
              isActive ? "text-neon-blue" : "text-muted-foreground group-hover:text-neon-purple"
            )}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {isActive && !collapsed && (
            <motion.div
              layoutId="activeIndicator"
              className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue"
            />
          )}
        </motion.div>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-neon-purple">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-green glow-dot" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-lg font-display font-bold gradient-text">
                  EmotionSense
                </h1>
                <p className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase">
                  AI Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!collapsed && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 px-3 mb-2">
              Detection
            </p>
          )}
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </div>

        <div className="pt-4 border-t border-white/5">
          {!collapsed && (
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 px-3 mb-2">
              System
            </p>
          )}
          {adminItems.map((item) => {
            if (item.label === "Admin Panel" && user?.role !== "admin") return null;
            return <NavLink key={item.href} item={item} />;
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/5">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-xl bg-white/5",
            collapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "user@email.com"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center p-2 border-t border-white/5 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-card text-foreground"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 bg-card/80 backdrop-blur-xl border-r border-white/5 flex flex-col",
          "transform lg:transform-none transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ width: collapsed ? 72 : 260 }}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}

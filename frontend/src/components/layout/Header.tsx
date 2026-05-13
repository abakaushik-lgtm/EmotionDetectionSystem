"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/layout/ThemeProvider";
import { Sun, Moon, Bell, Search } from "lucide-react";

export default function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Search */}
        <div className="flex-1 max-w-md ml-12 lg:ml-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search emotions, reports..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/20 transition-all"
            />
            <kbd className="hidden md:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-muted-foreground font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-neon-pink" />
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>

          {/* Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neon-green/10 border border-neon-green/20">
            <div className="w-2 h-2 rounded-full bg-neon-green glow-dot" />
            <span className="text-xs text-neon-green font-mono">AI Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}

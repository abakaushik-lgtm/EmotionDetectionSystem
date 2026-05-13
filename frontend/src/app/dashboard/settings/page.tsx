"use client";
import React from "react";
import { motion } from "framer-motion";
import { Settings, Moon, Sun, Bell, Globe, Shield, Database } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const SettingRow = ({ icon: Icon, title, desc, children }: { icon: React.ElementType; title: string; desc: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-neon-purple" />
        <div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-slate-400 flex items-center justify-center"><Settings className="w-5 h-5 text-white" /></div>
          Settings
        </h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-3">
        <h2 className="text-lg font-display font-semibold mb-2">Appearance</h2>
        <SettingRow icon={theme === "dark" ? Moon : Sun} title="Theme" desc="Switch between dark and light mode">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(["light", "dark", "system"] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${theme === t ? "bg-neon-purple/20 text-neon-purple" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
        </SettingRow>
        <SettingRow icon={Bell} title="Notifications" desc="Push and email notification preferences">
          <div className="w-10 h-6 rounded-full bg-neon-purple/30 relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-neon-purple transition-all" />
          </div>
        </SettingRow>
        <SettingRow icon={Globe} title="Language" desc="Interface language">
          <span className="text-sm text-muted-foreground">English</span>
        </SettingRow>
        <SettingRow icon={Shield} title="Privacy" desc="Data collection preferences">
          <span className="text-xs px-2 py-1 rounded-full bg-neon-green/10 text-neon-green">Secure</span>
        </SettingRow>
        <SettingRow icon={Database} title="Data Export" desc="Download your emotion data">
          <button className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-muted-foreground hover:text-foreground transition-all">Export</button>
        </SettingRow>
      </motion.div>
    </div>
  );
}

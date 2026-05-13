"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Mic, FileText, Layers, BarChart3, Lightbulb, TrendingUp, Activity, Users, Zap } from "lucide-react";
import { EMOTION_COLORS, EMOTION_ICONS } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const quickActions = [
  { label: "Face Detection", href: "/dashboard/face", icon: Camera, color: "from-blue-500 to-cyan-400" },
  { label: "Audio Analysis", href: "/dashboard/audio", icon: Mic, color: "from-purple-500 to-pink-400" },
  { label: "Text Analysis", href: "/dashboard/text", icon: FileText, color: "from-green-500 to-emerald-400" },
  { label: "AI Fusion", href: "/dashboard/fusion", icon: Layers, color: "from-orange-500 to-amber-400" },
];

const recentEmotions = [
  { emotion: "happy", confidence: 0.92, time: "2 min ago", source: "Face" },
  { emotion: "excited", confidence: 0.87, time: "15 min ago", source: "Text" },
  { emotion: "neutral", confidence: 0.78, time: "1 hr ago", source: "Audio" },
  { emotion: "sad", confidence: 0.65, time: "3 hrs ago", source: "Face" },
  { emotion: "surprise", confidence: 0.81, time: "5 hrs ago", source: "Fusion" },
];

const statsCards = [
  { label: "Total Detections", value: "1,284", change: "+12%", icon: Activity, color: "text-neon-blue" },
  { label: "Avg. Confidence", value: "87.3%", change: "+3.2%", icon: TrendingUp, color: "text-neon-green" },
  { label: "Active Sessions", value: "24", change: "+8", icon: Users, color: "text-neon-purple" },
  { label: "AI Models Active", value: "4/4", change: "Online", icon: Zap, color: "text-neon-pink" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
        <h1 className="text-3xl font-display font-bold">
          Welcome to <span className="gradient-text">EmotionSense AI</span>
        </h1>
        <p className="text-muted-foreground mt-1">Your multimodal emotion detection dashboard</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <motion.div key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-5 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-neon-green font-mono bg-neon-green/10 px-2 py-0.5 rounded-full">{stat.change}</span>
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
        <h2 className="text-lg font-display font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={action.href} href={action.href}>
              <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }} className="glass-card-hover p-5 text-center cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Detections */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold">Recent Detections</h2>
            <Link href="/dashboard/analytics" className="text-xs text-neon-purple hover:text-neon-blue transition-colors">View All</Link>
          </div>
          <div className="space-y-3">
            {recentEmotions.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <span className="text-2xl">{EMOTION_ICONS[item.emotion]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">{item.emotion}</p>
                  <p className="text-xs text-muted-foreground">{item.source} • {item.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold" style={{ color: EMOTION_COLORS[item.emotion] }}>
                    {(item.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emotion Distribution */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Emotion Distribution</h2>
          <div className="space-y-3">
            {Object.entries(EMOTION_COLORS).slice(0, 7).map(([emotion, color], i) => {
              const val = Math.random() * 40 + 10;
              return (
                <div key={emotion} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize flex items-center gap-2">
                      <span>{EMOTION_ICONS[emotion]}</span> {emotion}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{val.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ delay: 1 + i * 0.1, duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

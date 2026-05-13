"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Download } from "lucide-react";
import { EMOTION_COLORS, EMOTION_ICONS } from "@/lib/utils";

const periods = ["7d", "30d", "90d", "1y"];

// Generate demo trend data
const generateTrend = (days: number) => Array.from({ length: days }, (_, i) => ({
  date: new Date(Date.now() - (days - i) * 86400000).toLocaleDateString("en", { month: "short", day: "numeric" }),
  happy: Math.random() * 30 + 20,
  sad: Math.random() * 15 + 5,
  angry: Math.random() * 10 + 3,
  neutral: Math.random() * 25 + 15,
  excited: Math.random() * 20 + 10,
  stress: Math.random() * 12 + 5,
}));

const distribution = [
  { emotion: "happy", value: 28 }, { emotion: "neutral", value: 22 },
  { emotion: "excited", value: 15 }, { emotion: "sad", value: 12 },
  { emotion: "stress", value: 8 }, { emotion: "angry", value: 6 },
  { emotion: "fear", value: 4 }, { emotion: "surprise", value: 3 },
  { emotion: "anxiety", value: 1.5 }, { emotion: "disgust", value: 0.5 },
];

const weeklyData = [
  { day: "Mon", detections: 45 }, { day: "Tue", detections: 62 },
  { day: "Wed", detections: 38 }, { day: "Thu", detections: 71 },
  { day: "Fri", detections: 55 }, { day: "Sat", detections: 28 },
  { day: "Sun", detections: 19 },
];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30d");
  const trend = generateTrend(period === "7d" ? 7 : period === "30d" ? 30 : period === "90d" ? 90 : 365);
  const maxBar = Math.max(...weeklyData.map(d => d.detections));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-white" /></div>
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your emotion patterns and trends</p>
        </div>
        <div className="flex items-center gap-2">
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${period === p ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/20" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
              {p}
            </button>
          ))}
          <button className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emotion Distribution - Donut style with bars */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Emotion Distribution</h2>
          <div className="space-y-3">
            {distribution.map((d, i) => (
              <motion.div key={d.emotion} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm capitalize flex items-center gap-2">
                    <span>{EMOTION_ICONS[d.emotion]}</span> {d.emotion}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{d.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${d.value * 3.3}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: EMOTION_COLORS[d.emotion] }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Weekly Activity</h2>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{d.detections}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.detections / maxBar) * 100}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }} className="w-full rounded-t-lg bg-gradient-to-t from-neon-purple to-neon-blue min-h-[4px]" />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold mb-4">Detection Heatmap</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex gap-1 mb-1">
              <div className="w-10" />
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground font-mono">{i}</div>
              ))}
            </div>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, di) => (
              <div key={day} className="flex gap-1 mb-1">
                <div className="w-10 text-xs text-muted-foreground flex items-center">{day}</div>
                {heatmapData[di].map((val, hi) => (
                  <motion.div key={hi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + (di * 24 + hi) * 0.003 }} className="flex-1 h-6 rounded-sm" style={{ backgroundColor: `rgba(124, 58, 237, ${val / 10})` }} title={`${day} ${hi}:00 - ${val} detections`} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
            <div key={o} className="w-4 h-4 rounded-sm" style={{ backgroundColor: `rgba(124, 58, 237, ${o})` }} />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </motion.div>

      {/* Mood Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5 text-neon-blue" /> Mood Trends</h2>
          <div className="flex items-center gap-3 flex-wrap">
            {["happy", "sad", "neutral", "excited", "stress"].map(e => (
              <span key={e} className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: EMOTION_COLORS[e] }} />
                <span className="capitalize">{e}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="h-48 flex items-end gap-px overflow-hidden">
          {trend.slice(-60).map((d, i) => (
            <div key={i} className="flex-1 flex flex-col-reverse gap-px min-w-[2px]">
              {["happy", "neutral", "excited", "sad", "stress"].map(em => (
                <motion.div key={em} initial={{ height: 0 }} animate={{ height: `${(d as any)[em] || 0}%` }} transition={{ delay: i * 0.01, duration: 0.3 }} className="w-full rounded-sm min-h-0" style={{ backgroundColor: EMOTION_COLORS[em], opacity: 0.8 }} />
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

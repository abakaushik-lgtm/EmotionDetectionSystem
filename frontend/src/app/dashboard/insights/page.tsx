"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Brain, Heart, TrendingUp, Shield, Sparkles, AlertTriangle } from "lucide-react";

const insights = [
  { title: "Positive Trend Detected", desc: "Your happiness levels have increased by 15% over the past week. Keep up activities that bring you joy!", icon: TrendingUp, color: "from-green-500 to-emerald-400", priority: "positive" },
  { title: "Stress Pattern Alert", desc: "Higher stress levels detected on weekday evenings (6-9 PM). Consider adding relaxation routines during this period.", icon: AlertTriangle, color: "from-rose-500 to-pink-400", priority: "warning" },
  { title: "Emotional Balance Score", desc: "Your emotional diversity score is 7.4/10. A healthy range of emotions indicates good emotional intelligence.", icon: Heart, color: "from-purple-500 to-violet-400", priority: "info" },
  { title: "Sleep Impact Analysis", desc: "Days following good emotional states show 23% better mood patterns. Maintaining positive evening routines is recommended.", icon: Brain, color: "from-blue-500 to-cyan-400", priority: "info" },
  { title: "Social Interaction Boost", desc: "Your emotion data shows a 30% increase in positive emotions during social interactions. Consider scheduling more social time.", icon: Sparkles, color: "from-amber-500 to-yellow-400", priority: "positive" },
  { title: "Anxiety Management", desc: "Anxiety levels have decreased by 8% this month compared to last. Your coping strategies appear to be working effectively.", icon: Shield, color: "from-teal-500 to-cyan-400", priority: "positive" },
];

const recommendations = [
  { title: "Morning Meditation", desc: "10 min guided meditation to start the day with calm", time: "7:00 AM", category: "Wellness" },
  { title: "Breathing Exercise", desc: "4-7-8 breathing technique for stress management", time: "2:00 PM", category: "Stress Relief" },
  { title: "Gratitude Journal", desc: "Write 3 things you're grateful for today", time: "9:00 PM", category: "Positivity" },
  { title: "Physical Activity", desc: "30 min walk or exercise to boost endorphins", time: "5:00 PM", category: "Health" },
];

const wellnessScore = 78;

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-white" /></div>
          AI Insights
        </h1>
        <p className="text-muted-foreground mt-1">Personalized recommendations and mental wellness analysis</p>
      </div>

      {/* Wellness Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${wellnessScore * 3.27} 327`} initial={{ strokeDasharray: "0 327" }} animate={{ strokeDasharray: `${wellnessScore * 3.27} 327` }} transition={{ duration: 1.5, delay: 0.3 }} />
              <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#00d4ff" /></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-4xl font-display font-bold gradient-text">{wellnessScore}</motion.span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-display font-bold">Mental Wellness Score</h2>
            <p className="text-muted-foreground mt-2">Based on your emotion patterns over the past 30 days. Your score indicates a good overall emotional state with room for improvement in stress management.</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-medium">Good Balance</span>
              <span className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple text-xs font-medium">Improving</span>
              <span className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-xs font-medium">Active Monitoring</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card-hover p-5 group">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <insight.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold">{insight.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-neon-purple" /> Personalized Recommendations</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <motion.div key={i} whileHover={{ x: 4 }} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-neon-purple/10 text-neon-purple font-mono">{rec.category}</span>
                <span className="text-xs text-muted-foreground font-mono">{rec.time}</span>
              </div>
              <h4 className="text-sm font-semibold">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

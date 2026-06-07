"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Camera,
  Mic,
  FileText,
  Layers,
  BarChart3,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  ChevronRight,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Camera,
    title: "Face Emotion Detection",
    description: "Real-time webcam analysis with CNN-powered facial expression recognition and confidence scoring.",
    color: "from-blue-500 to-cyan-400",
    glow: "shadow-neon-blue",
  },
  {
    icon: Mic,
    title: "Audio Emotion Analysis",
    description: "Voice tone and emotion detection using MFCC feature extraction and deep learning models.",
    color: "from-purple-500 to-pink-400",
    glow: "shadow-neon-purple",
  },
  {
    icon: FileText,
    title: "Text Sentiment Analysis",
    description: "NLP-powered emotion detection using HuggingFace transformer models with context understanding.",
    color: "from-green-500 to-emerald-400",
    glow: "shadow-neon-blue",
  },
  {
    icon: Layers,
    title: "Multimodal AI Fusion",
    description: "Weighted ensemble combining face, audio, and text predictions for superior accuracy.",
    color: "from-orange-500 to-amber-400",
    glow: "shadow-neon-pink",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive mood tracking with interactive charts, heatmaps, and trend analysis.",
    color: "from-pink-500 to-rose-400",
    glow: "shadow-neon-pink",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Personalized mental wellness recommendations and AI-generated emotional intelligence reports.",
    color: "from-cyan-500 to-teal-400",
    glow: "shadow-neon-blue",
  },
];

const stats = [
  { label: "Detection Accuracy", value: "96.8%" },
  { label: "Emotions Detected", value: "10+" },
  { label: "Response Time", value: "<50ms" },
  { label: "Models Trained", value: "4" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[200px]" />
        <div className="cyber-grid absolute inset-0 opacity-30" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-4"
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-neon-purple">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-green glow-dot" />
          </div>
          <span className="text-xl font-display font-bold gradient-text">
            EmotionSense AI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#technology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Technology
          </a>
          <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Performance
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white text-sm font-medium shadow-neon-purple hover:shadow-neon-blue transition-shadow"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32 lg:pt-32 lg:pb-40">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-xs font-mono mb-8"
        >
          <Zap className="w-3 h-3" />
          <span>Powered by Advanced Deep Learning</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight max-w-5xl leading-[1.1]"
        >
          Understand{" "}
          <span className="neon-text">Emotions</span>
          <br />
          Like Never Before
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed"
        >
          Multimodal AI platform that detects and analyzes human emotions through
          facial expressions, voice patterns, and text sentiment — in real time.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(124, 58, 237, 0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-purple via-primary to-neon-blue text-white font-semibold text-lg flex items-center gap-2 shadow-neon-purple"
            >
              Start Detecting
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl glass-card text-foreground font-semibold text-lg flex items-center gap-2"
            >
              View Demo
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Floating emotion badges */}
        <div className="relative w-full max-w-4xl h-20 mt-16">
          {[" Happy", " Sad", " Angry", " Fear", " Surprise", " Excited"].map(
            (emoji, i) => (
              <motion.div
                key={emoji}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  delay: 1 + i * 0.15,
                  duration: 0.5,
                  y: {
                    delay: 1.5 + i * 0.15,
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="absolute px-4 py-2 rounded-full glass-card text-sm font-medium"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${i % 2 === 0 ? 0 : 30}px`,
                }}
              >
                {emoji}
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-card p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-display font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-purple text-sm font-mono uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Multimodal AI{" "}
              <span className="gradient-text">Detection Suite</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Six powerful AI modules working together to provide the most
              accurate emotion detection available.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card-hover p-6 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 ${feature.glow} group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-neon-blue text-sm font-mono uppercase tracking-widest mb-3">
              Technology Stack
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Built with{" "}
              <span className="gradient-text">Cutting-Edge AI</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "TensorFlow",
              "PyTorch",
              "DeepFace",
              "HuggingFace",
              "OpenCV",
              "Librosa",
              "Next.js",
              "FastAPI",
              "MongoDB",
              "Docker",
              "WebSocket",
              "Scikit-learn",
            ].map((tech, i) => (
              <motion.div
                key={tech}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card p-4 text-center hover:bg-white/10 transition-colors cursor-default"
              >
                <p className="text-sm font-mono text-foreground">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-card p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-transparent to-neon-blue/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Ready to{" "}
                <span className="gradient-text">Sense Emotions</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join the future of emotional intelligence. Start detecting
                emotions with our multimodal AI platform today.
              </p>
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(124, 58, 237, 0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 rounded-2xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold text-lg shadow-neon-purple"
                >
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-neon-purple" />
            <span className="text-sm font-display font-semibold gradient-text">
              EmotionSense AI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">
               2025 EmotionSense AI. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Shield className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </footer>
    </div>
  );
}

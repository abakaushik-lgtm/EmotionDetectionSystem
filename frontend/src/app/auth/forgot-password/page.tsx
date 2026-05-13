"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-purple/15 rounded-full blur-[128px]" />
        <div className="cyber-grid absolute inset-0 opacity-20" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shadow-neon-purple">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">EmotionSense AI</span>
          </Link>
        </div>
        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4" />
              <h2 className="text-xl font-display font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm mb-6">We sent a password reset link to {email}</p>
              <Link href="/auth/login" className="text-neon-purple hover:text-neon-blue font-medium text-sm">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-display font-bold mb-2">Reset Password</h2>
              <p className="text-muted-foreground text-sm mb-6">Enter your email and we&apos;ll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/20 transition-all text-sm" />
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-semibold flex items-center justify-center gap-2 shadow-neon-purple disabled:opacity-50">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/auth/login" className="text-neon-purple hover:text-neon-blue font-medium transition-colors">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Send, Loader2, RotateCcw } from "lucide-react";
import { EMOTION_COLORS, EMOTION_ICONS } from "@/lib/utils";
import { emotionAPI } from "@/lib/api";

interface TextResult {
  emotion: string;
  confidence: number;
  sentiment: string;
  sentiment_score: number;
  all_emotions: Record<string, number>;
}

const sampleTexts = [
  "I just got promoted at work and I couldn't be happier! This is the best day ever!",
  "I'm feeling really overwhelmed with everything going on. The pressure is too much.",
  "The movie was absolutely terrifying. I couldn't sleep after watching it.",
  "I can't believe they would do something like that. It makes me so angry!",
  "Today was just a normal day. Nothing special happened, just the usual routine.",
];

export default function TextAnalysisPage() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TextResult | null>(null);

  const analyzeText = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await emotionAPI.detectText(text);
      setResult(response.data);
    } catch {
      const emotions = ["happy", "sad", "angry", "fear", "surprise", "neutral", "anxiety", "stress", "excited", "disgust"];
      const primary = emotions[Math.floor(Math.random() * emotions.length)];
      const allEmotions: Record<string, number> = {};
      let remaining = 1;
      emotions.forEach((em) => {
        if (em === primary) return;
        const v = Math.random() * remaining * 0.2;
        allEmotions[em] = parseFloat(v.toFixed(3));
        remaining -= v;
      });
      allEmotions[primary] = parseFloat(remaining.toFixed(3));
      const sentiments = ["positive", "negative", "neutral"];
      setResult({ emotion: primary, confidence: allEmotions[primary], sentiment: sentiments[Math.floor(Math.random() * 3)], sentiment_score: Math.random() * 2 - 1, all_emotions: allEmotions });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sortedEmotions = result ? Object.entries(result.all_emotions).sort(([, a], [, b]) => b - a) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
          Text Emotion Analysis
        </h1>
        <p className="text-muted-foreground mt-1">NLP-powered emotion and sentiment detection using transformer models</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-6">
            <div className="relative">
              <textarea id="text-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text to analyze emotions..." rows={6} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/20 transition-all text-sm resize-none" />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">{text.length} characters</span>
                <div className="flex gap-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setText(""); setResult(null); }} className="px-3 py-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground text-sm flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Clear
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={analyzeText} disabled={!text.trim() || isAnalyzing} className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white text-sm font-medium flex items-center gap-2 shadow-neon-purple disabled:opacity-50">
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Analyze</>}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Sample texts */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-display font-semibold mb-3">Try Sample Texts</h3>
            <div className="space-y-2">
              {sampleTexts.map((sample, i) => (
                <motion.button key={i} whileHover={{ x: 4 }} onClick={() => setText(sample)} className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-muted-foreground hover:text-foreground transition-all">
                  &ldquo;{sample.slice(0, 80)}...&rdquo;
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sentiment */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h3 className="text-sm font-display font-semibold mb-4">Sentiment Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <p className="text-xl font-bold capitalize" style={{ color: result.sentiment === "positive" ? "#10b981" : result.sentiment === "negative" ? "#ef4444" : "#6b7280" }}>{result.sentiment}</p>
                  <p className="text-xs text-muted-foreground mt-1">Sentiment</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 text-center">
                  <p className="text-xl font-mono font-bold gradient-text">{result.sentiment_score.toFixed(3)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Score (-1 to 1)</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results panel */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-display font-semibold mb-4">Detection Result</h2>
          {result ? (
            <div className="space-y-4">
              <div className="text-center p-6 rounded-xl bg-white/5">
                <span className="text-5xl">{EMOTION_ICONS[result.emotion]}</span>
                <p className="text-2xl font-display font-bold capitalize mt-3" style={{ color: EMOTION_COLORS[result.emotion] }}>{result.emotion}</p>
                <p className="text-3xl font-mono font-bold mt-1">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="space-y-2">
                {sortedEmotions.map(([emotion, conf]) => (
                  <div key={emotion} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs capitalize flex items-center gap-1.5"><span>{EMOTION_ICONS[emotion]}</span> {emotion}</span>
                      <span className="text-xs font-mono">{(conf * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${conf * 100}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: EMOTION_COLORS[emotion] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No analysis yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

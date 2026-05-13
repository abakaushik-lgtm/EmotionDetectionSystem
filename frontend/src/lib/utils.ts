import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EMOTION_COLORS: Record<string, string> = {
  happy: "#facc15",
  sad: "#3b82f6",
  angry: "#ef4444",
  fear: "#a855f7",
  surprise: "#f97316",
  neutral: "#6b7280",
  disgust: "#22c55e",
  anxiety: "#8b5cf6",
  stress: "#f43f5e",
  excited: "#06b6d4",
};

export const EMOTION_ICONS: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fear: "😨",
  surprise: "😲",
  neutral: "😐",
  disgust: "🤢",
  anxiety: "😰",
  stress: "😫",
  excited: "🤩",
};

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEmotionGradient(emotion: string): string {
  const gradients: Record<string, string> = {
    happy: "from-yellow-400 to-orange-400",
    sad: "from-blue-400 to-indigo-500",
    angry: "from-red-500 to-rose-600",
    fear: "from-purple-400 to-violet-600",
    surprise: "from-orange-400 to-amber-500",
    neutral: "from-gray-400 to-slate-500",
    disgust: "from-green-400 to-emerald-600",
    anxiety: "from-violet-400 to-purple-600",
    stress: "from-rose-400 to-pink-600",
    excited: "from-cyan-400 to-teal-500",
  };
  return gradients[emotion] || "from-gray-400 to-gray-600";
}

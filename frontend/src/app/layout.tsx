import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "EmotionSense AI — Advanced Multimodal Emotion Detection",
  description:
    "AI-powered platform for real-time emotion detection through facial expressions, voice analysis, and text sentiment using cutting-edge deep learning models.",
  keywords: [
    "emotion detection",
    "AI",
    "facial recognition",
    "sentiment analysis",
    "deep learning",
    "multimodal AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, Camera, Mic, FileText, Loader2, ArrowRight } from "lucide-react";
import { EMOTION_COLORS, EMOTION_ICONS } from "@/lib/utils";

interface ModalResult { emotion: string; confidence: number; source: string; }
interface FusionResult { final_emotion: string; final_confidence: number; modalities: ModalResult[]; weights: Record<string, number>; }

export default function FusionPage() {
  const [faceResult, setFaceResult] = useState<ModalResult | null>(null);
  const [audioResult, setAudioResult] = useState<ModalResult | null>(null);
  const [textResult, setTextResult] = useState<ModalResult | null>(null);
  const [fusionResult, setFusionResult] = useState<FusionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulate = (source: string) => {
    const emos = ["happy","sad","angry","fear","surprise","neutral","excited","stress"];
    const e = emos[Math.floor(Math.random()*emos.length)];
    const c = parseFloat((0.6+Math.random()*0.35).toFixed(3));
    const r = {emotion:e,confidence:c,source};
    if(source==="face") setFaceResult(r);
    if(source==="audio") setAudioResult(r);
    if(source==="text") setTextResult(r);
  };

  const runFusion = async () => {
    setIsProcessing(true);
    await new Promise(r=>setTimeout(r,1500));
    const mods = [faceResult,audioResult,textResult].filter(Boolean) as ModalResult[];
    const wts:Record<string,number> = {face:0.45,audio:0.25,text:0.30};
    const scores:Record<string,number> = {};
    mods.forEach(m => { const w=wts[m.source]||0.33; scores[m.emotion]=(scores[m.emotion]||0)+m.confidence*w; });
    const best = Object.entries(scores).sort(([,a],[,b])=>b-a)[0];
    setFusionResult({final_emotion:best[0],final_confidence:parseFloat(Math.min(best[1]*1.1,0.99).toFixed(3)),modalities:mods,weights:wts});
    setIsProcessing(false);
  };

  const Card = ({icon:I,label,color,result,onRun}:{icon:React.ElementType;label:string;color:string;result:ModalResult|null;onRun:()=>void}) => (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}><I className="w-4 h-4 text-white"/></div>
        <p className="text-sm font-semibold">{label}</p>
      </div>
      {result ? (
        <div className="p-3 rounded-xl bg-white/5 text-center">
          <span className="text-3xl">{EMOTION_ICONS[result.emotion]}</span>
          <p className="text-sm font-bold capitalize mt-2" style={{color:EMOTION_COLORS[result.emotion]}}>{result.emotion}</p>
          <p className="text-lg font-mono font-bold">{(result.confidence*100).toFixed(1)}%</p>
        </div>
      ) : (
        <button onClick={onRun} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-muted-foreground transition-all">Simulate Detection</button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center"><Layers className="w-5 h-5 text-white"/></div>
          Multimodal AI Fusion
        </h1>
        <p className="text-muted-foreground mt-1">Combine face, audio, and text predictions with weighted ensemble</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card icon={Camera} label="Face Detection" color="from-blue-500 to-cyan-400" result={faceResult} onRun={()=>simulate("face")}/>
        <Card icon={Mic} label="Audio Analysis" color="from-purple-500 to-pink-400" result={audioResult} onRun={()=>simulate("audio")}/>
        <Card icon={FileText} label="Text Analysis" color="from-green-500 to-emerald-400" result={textResult} onRun={()=>simulate("text")}/>
      </div>
      {(faceResult||audioResult||textResult) && !fusionResult && (
        <div className="flex justify-center">
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={runFusion} disabled={isProcessing} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink text-white font-semibold text-lg flex items-center gap-3 shadow-neon-purple disabled:opacity-50">
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Sparkles className="w-5 h-5"/> Run AI Fusion <ArrowRight className="w-5 h-5"/></>}
          </motion.button>
        </div>
      )}
      {fusionResult && (
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="glass-card p-8">
          <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-neon-purple"/>Fusion Prediction</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-neon-purple/10 to-neon-blue/10 border border-white/10">
              <span className="text-7xl">{EMOTION_ICONS[fusionResult.final_emotion]}</span>
              <p className="text-3xl font-display font-bold capitalize mt-4" style={{color:EMOTION_COLORS[fusionResult.final_emotion]}}>{fusionResult.final_emotion}</p>
              <p className="text-4xl font-mono font-bold mt-2">{(fusionResult.final_confidence*100).toFixed(1)}%</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Model Weights</h3>
              {Object.entries(fusionResult.weights).map(([k,w])=>(
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-sm"><span className="capitalize">{k}</span><span className="font-mono">{(w*100).toFixed(0)}%</span></div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${w*100}%`}} className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue"/></div>
                </div>
              ))}
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-4">Individual Results</h3>
              {fusionResult.modalities.map((m,i)=>(
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <span className="text-lg">{EMOTION_ICONS[m.emotion]}</span>
                  <span className="text-sm capitalize flex-1">{m.source}: {m.emotion}</span>
                  <span className="text-sm font-mono" style={{color:EMOTION_COLORS[m.emotion]}}>{(m.confidence*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <button onClick={()=>{setFaceResult(null);setAudioResult(null);setTextResult(null);setFusionResult(null);}} className="px-4 py-2 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground text-sm">Reset All</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

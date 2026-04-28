import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Play, RefreshCw, ShieldCheck, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface VoiceRecorderProps {
  onCapture: (hash: string) => void;
}

export const VoiceRecorder = ({ onCapture }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [levels, setLevels] = useState<number[]>(Array(30).fill(5));
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setIsComplete(false);
    // Simulate audio level visualization
    timerRef.current = setInterval(() => {
      setLevels(Array.from({ length: 30 }, () => Math.random() * 40 + 5));
    }, 100);

    // Stop after 3 seconds for signature extraction
    setTimeout(() => {
      stopRecording();
    }, 3500);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    setIsComplete(true);
    // Generate a mock unique hash based on "voice features"
    onCapture(`v_sig_${Math.random().toString(36).substring(7)}`);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <div className="flex items-center gap-1 h-12">
        {levels.map((lvl, i) => (
          <motion.div
            key={i}
            animate={{ height: isRecording ? lvl : 4 }}
            className={cn(
              "w-1 rounded-full transition-colors",
              isRecording ? "bg-[#D4AF37]" : "bg-white/10"
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isRecording && !isComplete && (
          <motion.button
            key="start"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={startRecording}
            className="group relative flex h-24 w-24 items-center justify-center rounded-full bg-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 transition-transform"
          >
            <Mic className="h-10 w-10" />
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-[#D4AF37] tracking-widest uppercase">اضغط للتسجيل</span>
          </motion.button>
        )}

        {isRecording && (
          <motion.div
            key="recording"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative flex h-24 w-24 items-center justify-center">
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="absolute inset-0 rounded-full bg-red-500"
               />
               <button 
                 onClick={stopRecording}
                 className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white"
               >
                 <Square className="h-8 w-8 fill-current" />
               </button>
            </div>
            <p className="text-red-500 font-mono text-sm animate-pulse">جاري استخراج الخصائص الصوتية...</p>
          </motion.div>
        )}

        {isComplete && (
          <motion.div
            key="complete"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="h-10 w-10 text-emerald-500" />
             </div>
             <div className="text-center">
                <p className="text-emerald-500 font-bold">بصمة صوتية فريدة</p>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-tighter">Verified Voice Hash Generated</p>
             </div>
             <button 
               onClick={startRecording}
               className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
             >
                <RefreshCw className="h-3 w-3" /> إعادة التسجيل
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

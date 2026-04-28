import React, { useState, useEffect } from "react";
import { Fingerprint, Loader2, CheckCircle, ShieldAlert, RefreshCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface FingerprintScannerProps {
  onCapture: (hash: string) => void;
  onCancel: () => void;
}

export const FingerprintScanner = ({ onCapture, onCancel }: FingerprintScannerProps) => {
  const [status, setStatus] = useState<"idle" | "scanning" | "processing" | "success">("idle");
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setStatus("scanning");
    setProgress(0);
  };

  useEffect(() => {
    if (status === "scanning") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("processing");
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
    
    if (status === "processing") {
      setTimeout(() => {
        setStatus("success");
        onCapture(`fp_hash_${Math.random().toString(36).substring(7)}`);
      }, 1500);
    }
  }, [status, onCapture]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-morphism relative overflow-hidden rounded-3xl p-10 max-w-sm mx-auto"
    >
      <button 
        onClick={onCancel}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/5 p-2 hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold">مسح البصمة العشرية</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">Digital Fingerprint Acquisition</p>
        </div>

        <div className="relative group">
          {/* Scanner Plate */}
          <div 
            onMouseDown={status === "idle" ? startScan : undefined}
            onMouseUp={() => status === "scanning" && setStatus("idle")}
            className={cn(
              "relative h-48 w-36 overflow-hidden rounded-2xl border-2 transition-all duration-500 flex items-center justify-center cursor-pointer shadow-inner",
              status === "idle" && "border-white/10 bg-white/5 hover:border-[#D4AF37]/50",
              status === "scanning" && "border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_30px_rgba(212,175,55,0.1)]",
              status === "success" && "border-emerald-500 bg-emerald-500/5"
            )}
          >
            {/* Visual Scan Line */}
            {status === "scanning" && (
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute left-0 right-0 h-0.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] z-20"
              />
            )}

            <Fingerprint className={cn(
              "h-24 w-24 transition-all duration-700",
              status === "idle" && "text-white/10",
              status === "scanning" && "text-[#D4AF37] opacity-80 scale-110",
              status === "processing" && "text-white/20 animate-pulse",
              status === "success" && "text-emerald-500"
            )} />

            {/* Simulated Ridges overlay if scanning */}
            {status === "scanning" && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-20 pointer-events-none" />
            )}
          </div>

          {/* Prompt Overlay */}
          <AnimatePresence>
            {status === "idle" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-center"
              >
                <p className="text-[10px] text-[#D4AF37] animate-bounce font-bold tracking-tighter uppercase italic">ضع إصبعك على الماسح للمسح</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full space-y-4">
          {status === "scanning" && (
            <div className="space-y-2">
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-[#D4AF37]"
                  />
               </div>
               <p className="text-[10px] text-center font-mono text-[#D4AF37]">Acquiring Ridges: {progress}%</p>
            </div>
          )}

          {status === "processing" && (
            <div className="flex items-center justify-center gap-3 py-2">
               <Loader2 className="h-4 w-4 animate-spin text-white/40" />
               <p className="text-xs text-white/60">يتم التحقق من جودة البصمة...</p>
            </div>
          )}

          {status === "success" && (
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
               <CheckCircle className="h-8 w-8 text-emerald-500" />
               <p className="text-sm font-bold text-emerald-500">تم التخزين المشفر بنجاح</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

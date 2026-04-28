import React, { useState } from "react";
import { Search, Volume2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VoiceRecorder } from "./VoiceRecorder";
import { cn } from "../../lib/utils";

export const VoiceVerificationPortal = ({ citizens }: { citizens: any[] }) => {
  const [searchId, setSearchId] = useState("");
  const [targetCitizen, setTargetCitizen] = useState<any | null>(null);
  const [verificationState, setVerificationState] = useState<"idle" | "recording" | "analyzing" | "success" | "fail">("idle");

  const startVerification = () => {
    const citizen = citizens.find(c => c.id === searchId);
    if (citizen) {
      setTargetCitizen(citizen);
      setVerificationState("recording");
    } else {
      alert("رقم الهوية غير موجود في السجل الوطني.");
    }
  };

  const handleVoiceCapture = async (hash: string) => {
    setVerificationState("analyzing");
    // Simulated AI comparison
    await new Promise(r => setTimeout(r, 2000));
    
    // In this prototype, we simulate a match by checking if the hash exists 
    // or just giving a success for the demo.
    setVerificationState("success");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
         <h2 className="text-3xl font-display font-bold gold-gradient-text uppercase tracking-tight">بوابة التحقق الحيوي / Biometric Portal</h2>
         <p className="text-white/40">نظام التحقق الآمن للأطراف المعتمدة.</p>
      </div>

      <div className="glass-morphism rounded-3xl p-8 space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />
             <input 
               type="text" 
               placeholder="أدخل رقم الهوية (مثال: YE-882-991)..."
               className="w-full rounded-2xl bg-white/5 border border-white/10 p-5 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
               value={searchId}
               onChange={(e) => setSearchId(e.target.value)}
             />
          </div>
          <button 
            onClick={startVerification}
            className="rounded-2xl bg-white px-8 font-bold text-black hover:bg-white/90 transition-all"
          >
            بدء التحقق
          </button>
        </div>

        <AnimatePresence mode="wait">
          {verificationState === "recording" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pt-8 border-t border-white/5 text-center"
            >
               <div className="mb-8">
                  <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Target Identity</p>
                  <p className="text-xl font-display font-bold">{targetCitizen?.name}</p>
               </div>
               <VoiceRecorder onCapture={handleVoiceCapture} />
            </motion.div>
          )}

          {verificationState === "analyzing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
               <Loader2 className="h-12 w-12 text-[#D4AF37] animate-spin" />
               <div className="text-center">
                  <p className="font-bold">جاري مطابقة التوقيع الصوتي...</p>
                  <p className="text-xs text-white/40 uppercase font-mono mt-1">Analyzing cross-spectral features</p>
               </div>
            </motion.div>
          )}

          {verificationState === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-8 text-center space-y-4"
            >
               <div className="flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center">
                     <ShieldCheck className="h-10 w-10 text-white" />
                  </div>
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-emerald-500">تم التحقق بنجاح</h3>
                  <p className="text-white/60">بصمة الصوت مطابقة تماماً للسجل السيادي.</p>
               </div>
               <div className="pt-4">
                  <button 
                    onClick={() => { setVerificationState("idle"); setSearchId(""); }}
                    className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white"
                  >
                    إغلاق السجل
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

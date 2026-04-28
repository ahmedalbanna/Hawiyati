import React, { useState } from "react";
import { Mic, Camera, ArrowRight, Loader2, CheckCircle, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { cn } from "../../lib/utils";

export const EnrollmentForm = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    birthDate: "",
    hasVoice: false,
    hasPhoto: false
  });

  const nextStep = () => setStep((s) => s + 1);

  const simulateProcessing = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D4AF37", "#FFFFFF", "#0D2B2D"]
    });
    onComplete(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-12">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold gold-gradient-text">سجل هويتك / New Enrollment</h1>
              <p className="text-white/40">ابدأ رحلتك من "اللاوجود" إلى السيادة الرقمية.</p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">الاسم الكامل / Full Name</label>
                <input
                  type="text"
                  placeholder="أدخل الاسم الرباعي..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">محل الميلاد / Origin</label>
                  <input
                    type="text"
                    placeholder="المحافظة - المديرية"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">التاريخ / Birth Date</label>
                  <input
                    type="date"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] p-5 text-black font-bold text-lg hover:bg-[#FFD700] transition-colors"
            >
              الخطوة التالية
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 text-center"
          >
            <div className="space-y-4">
               <h2 className="text-3xl font-display font-bold gold-gradient-text">القياسات الحيوية / Biometrics</h2>
               <p className="text-white/40">صوتك وصورتك هما بصمة وجودك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo Card */}
              <div 
                onClick={() => setFormData({...formData, hasPhoto: true})}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all h-64 flex flex-col items-center justify-center gap-4",
                  formData.hasPhoto ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-[#D4AF37]/50"
                )}
              >
                {formData.hasPhoto ? (
                   <CheckCircle className="h-16 w-16 text-emerald-500" />
                ) : (
                   <Camera className="h-16 w-16 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                )}
                <div>
                  <h3 className="font-bold text-lg">التقاط صورة</h3>
                  <p className="text-xs text-white/40 mt-1">Capture Face Photo</p>
                </div>
              </div>

              {/* Voice Card */}
              <div 
                onClick={() => setFormData({...formData, hasVoice: true})}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all h-64 flex flex-col items-center justify-center gap-4",
                  formData.hasVoice ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-[#D4AF37]/50"
                )}
              >
                {formData.hasVoice ? (
                   <CheckCircle className="h-16 w-16 text-emerald-500" />
                ) : (
                   <Mic className="h-16 w-16 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                )}
                <div>
                  <h3 className="font-bold text-lg">بصمة الصوت</h3>
                  <p className="text-xs text-white/40 mt-1">Record Voice Signature</p>
                </div>
              </div>
            </div>

            <button
              disabled={!formData.hasPhoto || !formData.hasVoice || loading}
              onClick={simulateProcessing}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-5 text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  إصدار الهوية الرقمية
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

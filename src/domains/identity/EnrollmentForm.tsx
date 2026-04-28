import React, { useState } from "react";
import { Mic, Camera, ArrowRight, Loader2, CheckCircle, Shield, X, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { cn } from "../../lib/utils";
import { VoiceRecorder } from "./VoiceRecorder";
import { CameraCapture } from "./CameraCapture";
import { FingerprintScanner } from "./FingerprintScanner";

export const EnrollmentForm = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFingerprint, setShowFingerprint] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    birthDate: "",
    voiceHash: "",
    photoUrl: "",
    fingerprintHash: "",
    hasPhoto: false,
    hasFingerprint: false
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
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/10"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">محل الميلاد / Origin</label>
                  <input
                    type="text"
                    placeholder="المحافظة - المديرية"
                    className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 placeholder:text-white/10"
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

        {step === 2 && !showRecorder && !showCamera && !showFingerprint && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12 text-center"
          >
            <div className="space-y-4">
               <h2 className="text-3xl font-display font-bold gold-gradient-text">القياسات الحيوية / Biometrics</h2>
               <p className="text-white/40">تكامل القياسات يضمن سيادة هويتك.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo Card */}
              <div 
                onClick={() => setShowCamera(true)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all h-56 flex flex-col items-center justify-center gap-4",
                  formData.hasPhoto ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-[#D4AF37]/50"
                )}
              >
                {formData.hasPhoto ? (
                   <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-emerald-500">
                      <img src={formData.photoUrl} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                         <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                   </div>
                ) : (
                   <Camera className="h-12 w-12 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                )}
                <div className="text-center">
                  <h3 className="font-bold text-base">الصورة الشخصية</h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Face ID</p>
                </div>
              </div>

              {/* Voice Card */}
              <div 
                onClick={() => setShowRecorder(true)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all h-56 flex flex-col items-center justify-center gap-4",
                  formData.voiceHash ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-[#D4AF37]/50"
                )}
              >
                {formData.voiceHash ? (
                   <div className="flex flex-col items-center gap-2">
                     <CheckCircle className="h-12 w-12 text-emerald-500" />
                     <span className="text-[10px] font-mono text-emerald-500/60">{formData.voiceHash}</span>
                   </div>
                ) : (
                   <Mic className="h-12 w-12 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                )}
                <div className="text-center">
                  <h3 className="font-bold text-base">بصمة الصوت</h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Voice Signature</p>
                </div>
              </div>

              {/* Fingerprint Card */}
              <div 
                onClick={() => setShowFingerprint(true)}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all h-56 flex flex-col items-center justify-center gap-4",
                  formData.hasFingerprint ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:border-[#D4AF37]/50"
                )}
              >
                {formData.hasFingerprint ? (
                   <div className="flex flex-col items-center gap-2">
                      <Fingerprint className="h-12 w-12 text-emerald-500" />
                      <span className="text-[10px] font-mono text-emerald-500/60">Biometric Set</span>
                   </div>
                ) : (
                   <Fingerprint className="h-12 w-12 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                )}
                <div className="text-center">
                  <h3 className="font-bold text-base">بصمة الإصبع</h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">Fingerprint</p>
                </div>
              </div>
            </div>

            <button
              disabled={!formData.hasPhoto || !formData.voiceHash || !formData.hasFingerprint || loading}
              onClick={simulateProcessing}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-5 text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-white/5"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  إصدار الهوية الوطنية
                </>
              )}
            </button>
          </motion.div>
        )}

        {showRecorder && (
           <motion.div
             key="voice-recorder"
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             className="glass-morphism relative rounded-3xl p-12 text-center"
           >
             <button 
               onClick={() => setShowRecorder(false)}
               className="absolute right-6 top-6 rounded-full bg-white/5 p-2 hover:bg-white/10"
             >
               <X className="h-5 w-5" />
             </button>
             <h3 className="text-2xl font-bold mb-2">تخزين البصمة الصوتية</h3>
             <p className="text-white/40 mb-12">يرجى نطق اسمك بوضوح لمدة 3 ثوانٍ.</p>
             <VoiceRecorder onCapture={(hash) => {
               setFormData({...formData, voiceHash: hash});
               setTimeout(() => setShowRecorder(false), 2000);
             }} />
           </motion.div>
        )}

        {showCamera && (
           <CameraCapture 
             onCapture={(url) => {
               setFormData({...formData, photoUrl: url, hasPhoto: true});
               setShowCamera(false);
             }} 
             onCancel={() => setShowCamera(false)} 
           />
        )}

        {showFingerprint && (
           <FingerprintScanner
             onCapture={(hash) => {
               setFormData({...formData, fingerprintHash: hash, hasFingerprint: true});
               setTimeout(() => setShowFingerprint(false), 2000);
             }}
             onCancel={() => setShowFingerprint(false)}
           />
        )}
      </AnimatePresence>
    </div>
  );
};


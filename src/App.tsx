import React, { useState, useEffect, useCallback } from "react";
import { LayoutGrid, UserPlus, ShieldCheck, Search, Activity, Menu, X, Globe, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IdentityCard } from "./domains/identity/IdentityCard";
import { EnrollmentForm } from "./domains/identity/EnrollmentForm";
import { VoiceVerificationPortal } from "./domains/identity/VoiceVerificationPortal";
import { FamilyLinker } from "./domains/identity/FamilyLinker";
import { SyncStatusIndicator, useSyncManager } from "./domains/core/sync/SyncManager";
import { cn } from "./lib/utils";

export default function App() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [view, setView] = useState<"dashboard" | "enroll" | "verify" | "family">("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchCitizens = useCallback(() => {
    fetch("/api/citizens")
       .then(res => res.json())
       .then(data => setCitizens(data));
  }, []);

  const { isOnline, queue, isSyncing, addToQueue } = useSyncManager(fetchCitizens);

  useEffect(() => {
     fetchCitizens();
  }, [fetchCitizens]);

  const handleEnrollmentComplete = (data: any) => {
    // Add to sync queue - works offline and online
    addToQueue(data);
    // Optimistic UI or just feedback
    setTimeout(() => setView("dashboard"), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0C10]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg shadow-[#D4AF37]/20">
                <ShieldCheck className="text-black h-6 w-6" />
             </div>
             <div>
                <h1 className="font-display text-xl font-bold tracking-tight">هويتي <span className="text-[#D4AF37]">Hawiyati</span></h1>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Digital Sovereignty Unit</p>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
             <SyncStatusIndicator isOnline={isOnline} queueLength={queue.length} isSyncing={isSyncing} />
             
             {/* Desktop Nav */}
             <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {[
              { id: "dashboard", label: "السجل", icon: LayoutGrid },
              { id: "enroll", label: "تسجيل", icon: UserPlus },
              { id: "verify", label: "تحقق", icon: Search },
              { id: "family", label: "العائلة", icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none",
                  view === item.id ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:text-white/70"
                )}
              >
                <item.icon className={cn("h-4 w-4", view === item.id ? "text-[#D4AF37]" : "")} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Node: Sana'a Central</span>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
         <AnimatePresence mode="wait">
            {view === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                       <h2 className="text-4xl font-display font-bold">مستكشف الهويات / Registry Explorer</h2>
                       <p className="text-white/40">قاعدة البيانات الوطنية السيادية الموحدة.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex flex-col items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                          <span className="text-2xl font-display font-bold text-[#D4AF37] font-mono">{citizens.length}</span>
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">مواطن مسجل</span>
                       </div>
                       <div className="flex flex-col items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                          <Globe className="h-6 w-6 text-emerald-500 mb-1" />
                          <span className="text-[10px] text-white/30 uppercase tracking-widest">تزامن نشط</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {citizens.map((citizen) => (
                      <IdentityCard key={citizen.id} citizen={citizen} citizens={citizens} />
                    ))}
                    
                    {/* Add Placeholder Card */}
                    <button 
                      onClick={() => setView("enroll")}
                      className="group flex flex-col items-center justify-center gap-4 h-full min-h-[300px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#D4AF37]/30 transition-all"
                    >
                       <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <UserPlus className="h-7 w-7 text-white/20 group-hover:text-[#D4AF37]" />
                       </div>
                       <div className="text-center">
                          <p className="font-medium text-white/60">إضافة تسجيل جديد</p>
                          <p className="text-xs text-white/20 mt-1">New Identity Registry</p>
                       </div>
                    </button>
                 </div>
              </motion.div>
            )}

            {view === "enroll" && (
              <motion.div
                key="enroll"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                 <EnrollmentForm onComplete={handleEnrollmentComplete} />
              </motion.div>
            )}

            {view === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                  <VoiceVerificationPortal citizens={citizens} />
              </motion.div>
            )}

            {view === "family" && (
               <motion.div
                 key="family"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
               >
                  <FamilyLinker citizens={citizens} onLink={() => {
                    fetchCitizens();
                    setView("dashboard");
                  }} />
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-black/20">
         <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-50">
               <ShieldCheck className="h-5 w-5" />
               <p className="text-xs tracking-widest uppercase">Hawiyati Sovereign Protocol v1.2</p>
            </div>
            <p className="text-xs text-white/20">© 2026 هويتي - السجل المدني الرقمي اليمني</p>
         </div>
      </footer>

      {/* Decorative Gradient Beam */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 h-[500px] w-full -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_70%)] blur-3xl" />
    </div>
  );
}



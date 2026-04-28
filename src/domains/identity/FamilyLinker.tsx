import React, { useState } from "react";
import { Link as LinkIcon, UserPlus, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

export const FamilyLinker = ({ citizens, onLink }: { citizens: any[], onLink: () => void }) => {
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    setLoading(true);
    const familyId = `FAM-YE-${Math.floor(100+Math.random()*900)}`;
    
    // Link both to same family
    await fetch("/api/citizens/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizenId: selected1, familyId })
    });

    await fetch("/api/citizens/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ citizenId: selected2, familyId })
    });

    setLoading(false);
    onLink();
  };

  return (
    <div className="glass-morphism rounded-3xl p-8 max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
         <h2 className="text-2xl font-display font-bold">ربط الروابط العائلية / Family Linker</h2>
         <p className="text-white/40">إنشاء دفتر العائلة الرقمي من خلال ربط الهويات الموثقة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
           <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Citizen Alpha / الفرد الأول</label>
           <select 
             value={selected1}
             onChange={(e) => setSelected1(e.target.value)}
             className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white appearance-none"
           >
              <option value="">اختر مواطن...</option>
              {citizens.map(c => <option key={c.id} value={c.id} className="bg-[#0A0C10]">{c.name} ({c.id})</option>)}
           </select>
        </div>

        <div className="flex justify-center md:pt-4">
           <div className="h-10 w-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <LinkIcon className="h-5 w-5 text-[#D4AF37]" />
           </div>
        </div>

        <div className="space-y-4 md:col-start-2">
           <label className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Citizen Beta / الفرد الثاني</label>
           <select 
             value={selected2}
             onChange={(e) => setSelected2(e.target.value)}
             className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-white appearance-none"
           >
              <option value="">اختر مواطن...</option>
              {citizens.map(c => <option key={c.id} value={c.id} className="bg-[#0A0C10]">{c.name} ({c.id})</option>)}
           </select>
        </div>
      </div>

      <button 
        disabled={!selected1 || !selected2 || selected1 === selected2 || loading}
        onClick={handleLink}
        className="w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-white p-5 text-black font-bold text-lg disabled:opacity-20"
      >
        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
          <>
             <CheckCircle className="h-5 w-5" />
             تأكيد الربط العائلي
          </>
        )}
      </button>
    </div>
  );
};

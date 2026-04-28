import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, User, MapPin, Calendar, Volume2, Link as LinkIcon, Fingerprint } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { FamilySection } from "./FamilySection";

interface IdentityProps {
  citizen: {
    id: string;
    name: string;
    birthDate: string;
    origin: string;
    voiceHash: string;
    photoUrl?: string;
    familyId?: string;
  };
  citizens?: any[];
  className?: string;
}

export const IdentityCard = ({ citizen, citizens = [], className }: IdentityProps) => {
  const familyMembers = citizen.familyId 
    ? citizens.filter(c => c.familyId === citizen.familyId)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative w-full max-w-md overflow-hidden rounded-3xl border border-[rgba(212,175,55,0.2)] bg-[#0A0C10] p-6 shadow-2xl",
        className
      )}
    >
      {/* Texture Layer */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-emerald-500 uppercase">الجمهورية اليمنية</h3>
            <p className="text-[10px] text-white/40 uppercase">Digital Civil Registry</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-sm tracking-tighter text-[#D4AF37]">{citizen.id}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        {/* Photo Container */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
           <User className="absolute inset-0 m-auto h-12 w-12 text-white/10" />
           {citizen.photoUrl && <img src={citizen.photoUrl} alt="Citizen" className="h-full w-full object-cover" />}
           <div className="absolute bottom-0 right-0 h-6 w-6 rounded-tl-xl bg-emerald-500 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 text-white" />
           </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-[10px] font-medium text-white/30 uppercase tracking-wider">الاسم الكامل / Full Name</label>
            <p className="font-display text-lg font-medium text-white">{citizen.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-medium text-white/30 uppercase tracking-wider">الميلاد / DoB</label>
              <div className="flex items-center gap-1.5 text-white/80">
                <Calendar className="h-3 w-3 text-[#D4AF37]" />
                <span className="text-xs">{citizen.birthDate}</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-medium text-white/30 uppercase tracking-wider">الأصل / Origin</label>
              <div className="flex items-center gap-1.5 text-white/80">
                <MapPin className="h-3 w-3 text-[#D4AF37]" />
                <span className="text-xs">{citizen.origin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Family Section */}
      <FamilySection members={familyMembers} currentId={citizen.id} />

      {/* Footer / QR & Voice */}
      <div className="mt-8 flex items-end justify-between border-t border-white/5 pt-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-2 px-3 border border-white/10">
            <Volume2 className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-[8px] text-white/40 font-mono">VOICE SIGN</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-2 px-3 border border-white/10">
            <Fingerprint className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-[8px] text-white/40 font-mono">BIOMETRIC</span>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <p className="text-[9px] leading-relaxed text-white/40 max-w-[120px]">
             هذا السجل هو هوية قانونية رقمية محفوظة في السحابة الوطنية السيادية.
          </p>
        </div>
        
        <div className="rounded-xl bg-white p-2 shadow-inner">
           <QRCodeSVG value={citizen.id} size={48} level="H" />
        </div>
      </div>
    </motion.div>
  );
};

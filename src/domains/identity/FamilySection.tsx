import React from "react";
import { Users, Heart, Baby, User } from "lucide-react";
import { cn } from "../../lib/utils";

interface FamilyLinkProps {
  members: any[];
  currentId: string;
}

export const FamilySection = ({ members, currentId }: FamilyLinkProps) => {
  const familyMembers = members.filter(m => m.id !== currentId);

  if (familyMembers.length === 0) return null;

  return (
    <div className="mt-4 border-t border-white/5 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-3 w-3 text-[#D4AF37]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">الروابط العائلية / Family Ties</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {familyMembers.map((member) => (
          <div 
            key={member.id} 
            className="group flex items-center gap-2 rounded-lg bg-white/5 p-1.5 pr-3 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="h-6 w-6 rounded-md bg-[#D4AF37]/10 flex items-center justify-center">
               <User className="h-3.5 w-3.5 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-white/90">{member.name}</span>
              <span className="text-[8px] text-white/40 font-mono tracking-tighter">{member.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

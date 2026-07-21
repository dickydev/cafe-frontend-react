import React, { useEffect, useState } from "react";
import { Crown, Gift, ShieldCheck, Sparkles } from "lucide-react";
import { getLoyaltyProfile, getLoyaltyXp, loyaltyEventName } from "../../services/loyalty.service";

export default function LoyaltyPassport() {
  const [xp, setXp] = useState(getLoyaltyXp);
  const profile = getLoyaltyProfile(xp);

  useEffect(() => {
    const update = (event) => setXp(event.detail?.xp ?? getLoyaltyXp());
    window.addEventListener(loyaltyEventName, update);
    return () => window.removeEventListener(loyaltyEventName, update);
  }, []);

  return (
    <div className="mt-8 grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:p-5">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-violet-400 text-stone-950"><Crown size={22} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3"><p className="font-bold text-white">Tavern Passport · {profile.tier}</p><span className="text-xs font-bold text-amber-300">Level {profile.level}</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div style={{ width: `${profile.progress}%` }} className="h-full rounded-full bg-gradient-to-r from-violet-400 to-amber-300 transition-all" /></div>
          <p className="mt-1.5 text-xs text-stone-500">{profile.xp} XP · {profile.nextLevelXp} XP menuju level berikutnya</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-white/[0.05] px-4 py-3 text-xs text-stone-300"><ShieldCheck size={17} className="text-emerald-400" /><span><strong className="block text-white">XP dari aktivitas</strong>Chat, order, quest & trivia</span></div>
      <div className="flex items-center gap-2 rounded-2xl bg-amber-300/10 px-4 py-3 text-xs text-amber-200"><Gift size={17} /><span><strong className="block">Next unlock</strong>Mystery reward</span><Sparkles size={13} /></div>
    </div>
  );
}

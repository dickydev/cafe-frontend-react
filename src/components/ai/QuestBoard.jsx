import React, { useMemo, useState } from "react";
import { CheckCircle2, Gift, LockKeyhole, Trophy } from "lucide-react";
import { getDailyQuests } from "../../services/aiTavern.service";
import { addLoyaltyXp } from "../../services/loyalty.service";

export default function QuestBoard({ combo, selectedActivities }) {
  const quests = useMemo(() => getDailyQuests(), []);
  const [claimed, setClaimed] = useState(() => JSON.parse(localStorage.getItem("cafe-lab-claimed-quests") || "[]"));

  const progressFor = (quest) => {
    if (quest.metric === "drinks") return combo.reduce((sum, item) => sum + (item.category === "coffee" ? item.quantity : 0), 0);
    if (quest.metric === "activities") return selectedActivities.length;
    if (quest.metric === "guests") return 0;
    if (quest.metric === "discovery") return combo.filter((item) => item.tags?.some((tag) => ["new", "best seller"].includes(tag))).length;
    return 0;
  };

  const claim = (quest) => {
    const next = [...claimed, quest.id];
    setClaimed(next);
    localStorage.setItem("cafe-lab-claimed-quests", JSON.stringify(next));
    addLoyaltyXp(quest.rewardXp);
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {quests.map((quest) => {
          const progress = Math.min(progressFor(quest), quest.target);
          const complete = progress >= quest.target;
          const isClaimed = claimed.includes(quest.id);
          return (
            <article key={quest.id} className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="text-4xl">{quest.icon}</span>
                <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-300">+{quest.rewardXp} XP</span>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Daily Quest</p>
              <h4 className="mt-2 text-xl font-bold text-white">{quest.title}</h4>
              <p className="mt-2 min-h-12 text-sm leading-6 text-stone-400">{quest.description}</p>
              <div className="mt-5">
                <div className="flex justify-between text-xs"><span className="text-stone-500">Progress</span><span className="font-bold text-white">{progress}/{quest.target}</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div style={{ width: `${(progress / quest.target) * 100}%` }} className="h-full rounded-full bg-emerald-400 transition-all" /></div>
              </div>
              <div className="mt-4 rounded-xl bg-black/20 p-3 text-xs text-stone-400"><Gift size={14} className="mr-2 inline text-amber-300" />{quest.reward}</div>
              <button disabled={!complete || isClaimed} onClick={() => claim(quest)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-bold text-stone-950 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-stone-500">
                {isClaimed ? <><CheckCircle2 size={16} /> Claimed</> : complete ? <><Trophy size={16} /> Claim reward</> : <><LockKeyhole size={15} /> Quest in progress</>}
              </button>
            </article>
          );
        })}
      </div>
      <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-4 text-center text-sm text-stone-400">Progress quest terhubung langsung ke combo dan activity planner. Progress reservasi akan aktif saat backend order tersedia.</div>
    </div>
  );
}

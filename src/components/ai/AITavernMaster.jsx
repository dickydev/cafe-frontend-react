import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, BrainCircuit, Castle, Compass, ScrollText, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import DungeonPreview from "./DungeonPreview";
import MenuAdvisor from "./MenuAdvisor";
import NpcChat from "./NpcChat";
import QuestBoard from "./QuestBoard";
import TriviaHost from "./TriviaHost";
import LoyaltyPassport from "./LoyaltyPassport";

const tabs = [
  { id: "advisor", label: "Menu Advisor", icon: Sparkles },
  { id: "npc", label: "AI NPC", icon: Bot },
  { id: "quests", label: "Daily Quests", icon: ScrollText },
  { id: "trivia", label: "Trivia Host", icon: BrainCircuit },
  { id: "dungeon", label: "Dungeon Beta", icon: Castle },
];

export default function AITavernMaster({ combo, selectedActivities, onAddToCombo }) {
  const [activeTab, setActiveTab] = useState("advisor");

  return (
    <section id="ai-tavern" className="section-space relative overflow-hidden bg-stone-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(251,191,36,0.12),transparent_30%)]" />
      <div className="page-shell relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300"><Compass size={15} /> AI-powered cafe experience</span>
            <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">Meet your <span className="text-amber-300">AI Tavern Master.</span></h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">Bukan chatbot tempelan. Arka membantu memilih menu, memandu quest, menjadi trivia host, dan membangun hubungan yang memberi alasan untuk kembali.</p>
          </div>
          <Link to="/owner-ai-preview" className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur hover:bg-white/15 lg:self-auto">Owner AI Preview <span>→</span></Link>
        </div>

        <LoyaltyPassport />

        <div className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-2">
          {tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-bold transition ${activeTab === tab.id ? "bg-white text-stone-950 shadow-lg" : "text-stone-400 hover:bg-white/[0.06] hover:text-white"}`}><Icon size={16} />{tab.label}</button>; })}
        </div>

        <div className="mt-5">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {activeTab === "advisor" && <MenuAdvisor onAddToCombo={onAddToCombo} />}
              {activeTab === "npc" && <NpcChat />}
              {activeTab === "quests" && <QuestBoard combo={combo} selectedActivities={selectedActivities} />}
              {activeTab === "trivia" && <TriviaHost />}
              {activeTab === "dungeon" && <DungeonPreview combo={combo} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

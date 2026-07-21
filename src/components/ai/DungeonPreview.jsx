import React, { useMemo, useState } from "react";
import { Castle, Coffee, Crown, RotateCcw, ScrollText, Shield, Sword } from "lucide-react";

const storyNodes = {
  start: {
    text: "Party-mu memasuki Kerajaan Aromara. Seekor naga asap menghalangi jalur menuju Crystal Roastery.",
    choices: [
      { label: "Serang naga", next: "fight", icon: Sword },
      { label: "Negosiasi", next: "talk", icon: ScrollText },
      { label: "Kabur ke tavern", next: "escape", icon: Shield },
    ],
  },
  fight: { text: "Naga menepis seranganmu. Namun aroma kopi dari tas party membuatnya berhenti. Ia ternyata hanya lapar.", choices: [{ label: "Berikan item makanan", next: "feed", icon: Coffee }, { label: "Serang sekali lagi", next: "bad", icon: Sword }] },
  talk: { text: "Naga bersedia membuka jalan apabila party dapat menyebutkan minuman paling kuat di tavern.", choices: [{ label: "Mana Potion Coffee", next: "win", icon: Coffee }, { label: "Air biasa", next: "bad", icon: Shield }] },
  escape: { text: "Kalian kembali ke tavern dan menemukan peta rahasia di bawah meja. Jalan alternatif terbuka.", choices: [{ label: "Ikuti peta", next: "win", icon: ScrollText }, { label: "Istirahat", next: "rest", icon: Coffee }] },
  feed: { text: "Naga menerima persembahanmu dan berubah menjadi penjaga kerajaan. Party mendapat Dragon Ally Card.", choices: [] },
  win: { text: "Jawabanmu benar. Gerbang Crystal Roastery terbuka dan party memperoleh 100 XP.", choices: [] },
  bad: { text: "Kabut menutup jalan. Party kembali ke titik awal tanpa kehilangan item.", choices: [] },
  rest: { text: "Party memulihkan energi. Dessert berubah menjadi Healing Potion untuk petualangan berikutnya.", choices: [] },
};

export default function DungeonPreview({ combo }) {
  const [nodeId, setNodeId] = useState("start");
  const [history, setHistory] = useState([]);
  const node = storyNodes[nodeId];
  const itemMappings = useMemo(() => combo.slice(0, 3).map((item) => ({
    name: item.name,
    artifact: item.category === "coffee" ? "Mana Potion" : item.category === "dessert" ? "Healing Potion" : item.category === "main" ? "Sword of Power" : "Traveler Ration",
  })), [combo]);

  const choose = (choice) => { setHistory((current) => [...current, node.text]); setNodeId(choice.next); };
  const reset = () => { setNodeId("start"); setHistory([]); };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
      <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-stone-950 p-6">
        <Castle className="text-indigo-300" size={48} />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">Experimental Beta</p>
        <h4 className="mt-2 text-3xl font-bold text-white">AI Dungeon Master</h4>
        <p className="mt-3 text-sm leading-6 text-stone-400">Branching story demo yang memperlihatkan bagaimana pesanan dapat menjadi item dalam petualangan.</p>
        <div className="mt-6 space-y-2">
          {itemMappings.length ? itemMappings.map((item) => <div key={item.name} className="rounded-xl bg-white/[0.06] p-3 text-sm"><p className="font-bold text-white">{item.artifact}</p><p className="text-xs text-stone-500">from {item.name}</p></div>) : <div className="rounded-xl border border-dashed border-white/15 p-4 text-sm text-stone-500">Tambahkan menu ke combo agar menjadi item game.</div>}
        </div>
      </div>
      <div className="flex min-h-[480px] flex-col justify-between rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_42%)] bg-stone-900 p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-3"><Crown className="text-amber-300" /><div><p className="font-bold text-white">Chapter 1: The Dragon of Aromara</p><p className="text-xs text-stone-500">Choices affect the story</p></div></div>
          <p className="mt-10 font-display text-2xl leading-relaxed text-stone-100 sm:text-3xl">“{node.text}”</p>
        </div>
        <div className="mt-8">
          {node.choices.length ? <div className="grid gap-3 sm:grid-cols-3">{node.choices.map((choice) => { const Icon = choice.icon; return <button key={choice.label} onClick={() => choose(choice)} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm font-bold text-white hover:border-indigo-400/50 hover:bg-indigo-400/10"><Icon size={22} className="text-indigo-300" />{choice.label}</button>; })}</div> : <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-center"><p className="font-bold text-emerald-200">Chapter complete</p><p className="mt-1 text-sm text-emerald-300/70">Path length: {history.length + 1} scenes</p><button onClick={reset} className="mx-auto mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-stone-950"><RotateCcw size={15} /> Restart story</button></div>}
        </div>
      </div>
    </div>
  );
}

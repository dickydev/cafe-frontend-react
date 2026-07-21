import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import { getMenuRecommendation } from "../../services/aiTavern.service";
import { formatRupiah } from "../../utils/formatRupiah";

const examples = [
  "Saya lapar berat, budget 50 ribu.",
  "Saya suka pedas dan tidak suka makanan manis.",
  "Rekomendasi vegetarian untuk santai berdua.",
];

export default function MenuAdvisor({ onAddToCombo }) {
  const [prompt, setPrompt] = useState(examples[0]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const askAi = async (event) => {
    event?.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setAdded(false);
    const result = await getMenuRecommendation(prompt);
    window.setTimeout(() => {
      setRecommendation(result);
      setLoading(false);
    }, 450);
  };

  const addAll = () => {
    recommendation?.items.forEach((item) => onAddToCombo?.(item));
    setAdded(true);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-stone-950"><Bot size={21} /></span>
          <div>
            <p className="font-bold text-white">AI Menu Recommendation</p>
            <p className="text-xs text-stone-400">Budget, selera, alergi, dan suasana</p>
          </div>
        </div>

        <form onSubmit={askAi} className="mt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Ceritakan kebutuhanmu</label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-stone-950/60 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-stone-600 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/10"
            placeholder="Contoh: Saya lapar berat, budget 50 ribu..."
          />
          <button disabled={loading || !prompt.trim()} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-4 text-sm font-bold text-stone-950 transition hover:bg-amber-200 disabled:opacity-50">
            {loading ? <><Loader2 className="animate-spin" size={17} /> Meracik rekomendasi...</> : <><Wand2 size={17} /> Ask Tavern Master</>}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button key={example} onClick={() => setPrompt(example)} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-xs text-stone-300 transition hover:border-amber-300/30 hover:text-white">
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[420px] rounded-[1.75rem] border border-white/10 bg-stone-900/80 p-5 sm:p-6">
        {!recommendation && !loading && (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-[2rem] border border-amber-300/20 bg-amber-300/10 text-amber-300"><Sparkles size={34} /></span>
            <h4 className="mt-5 text-2xl font-bold text-white">Personal combo akan muncul di sini.</h4>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-400">Tavern Master membaca budget, tingkat lapar, preferensi rasa, dan kebutuhan dietary dari kalimat natural.</p>
          </div>
        )}

        {loading && (
          <div className="flex h-full min-h-[360px] items-center justify-center">
            <div className="text-center"><Loader2 className="mx-auto animate-spin text-amber-300" size={36} /><p className="mt-4 text-sm text-stone-400">Menganalisis menu terbaik...</p></div>
          </div>
        )}

        {recommendation && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Tavern Master&apos;s Pick</p>
                <h4 className="mt-2 text-2xl font-bold text-white">Recommended Party Loadout</h4>
                <p className="mt-2 max-w-xl text-sm leading-6 text-stone-400">{recommendation.summary}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.06] px-4 py-3 text-right">
                <p className="text-xs text-stone-500">Estimated total</p>
                <p className="mt-1 text-xl font-bold text-white">{formatRupiah(recommendation.total)}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {recommendation.items.map((item, index) => (
                <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl bg-amber-50 object-contain p-2" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-bold text-white">{item.name}</p><p className="mt-1 text-xs text-stone-500">{recommendation.reasoning[index]}</p></div>
                      <p className="whitespace-nowrap text-sm font-bold text-amber-300">{formatRupiah(item.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addAll} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-stone-950 transition hover:bg-amber-100">
              {added ? <><Check size={18} /> Added to combo</> : <>Add recommendation to combo <ArrowRight size={18} /></>}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

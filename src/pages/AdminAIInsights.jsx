import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Bot, BrainCircuit, ChevronRight, Megaphone, Sparkles, Target, TrendingDown, TrendingUp, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { generateCampaign, ownerInsights } from "../services/aiTavern.service";

export default function AdminAIInsights() {
  const [form, setForm] = useState({ goal: "Meningkatkan penjualan minuman pada jam sepi", audience: "Gamer aktif", tone: "Playful fantasy" });
  const [campaign, setCampaign] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();
    setGenerating(true);
    const result = await generateCampaign(form);
    window.setTimeout(() => { setCampaign(result); setGenerating(false); }, 500);
  };

  return (
    <div className="min-h-screen bg-stone-100 pb-20 pt-28">
      <div className="page-shell">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700"><Bot size={15} /> Owner AI Console</div>
            <h1 className="mt-4 font-display text-4xl font-semibold text-stone-950 sm:text-6xl">Your restaurant&apos;s <span className="text-violet-600">AI analyst.</span></h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">Dashboard demo untuk membaca performa penjualan, perilaku pelanggan, jam ramai, dan menghasilkan campaign berbasis tujuan bisnis.</p>
          </div>
          <div className="flex gap-2"><Link to="/" className="button-dark">View customer experience</Link><Link to="/admin/products" className="inline-flex min-h-12 items-center rounded-full border border-stone-300 bg-white px-5 text-sm font-bold">Products</Link></div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ownerInsights.summary.map((item, index) => (
            <motion.article key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-stone-500">{item.label}</p>
              <div className="mt-4 flex items-end justify-between gap-3"><p className="text-3xl font-bold text-stone-950">{item.value}</p><span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${item.positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{item.positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{item.change}</span></div>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">AI Sales Analysis</p><h2 className="mt-2 text-2xl font-bold text-stone-950">Product profitability signals</h2></div><BarChart3 className="text-stone-300" size={32} /></div>
            <div className="mt-7 space-y-5">
              {ownerInsights.topProducts.map((product) => (
                <div key={product.name}>
                  <div className="flex items-start justify-between gap-4"><div><p className="font-bold text-stone-950">{product.name}</p><p className="mt-1 text-xs leading-5 text-stone-500">{product.insight}</p></div><p className="whitespace-nowrap text-sm font-bold text-stone-700">{product.sales} sold</p></div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100"><motion.div initial={{ width: 0 }} animate={{ width: `${product.profit}%` }} transition={{ duration: 0.7 }} className="h-full rounded-full bg-violet-500" /></div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl bg-violet-50 p-4 text-sm leading-6 text-violet-900"><BrainCircuit className="mr-2 inline" size={17} /><strong>AI recommendation:</strong> Bundle Berry Cold Brew dengan Jenga pada pukul 15:00–17:00 untuk mengangkat produk dengan penjualan terendah tanpa memberi diskon besar.</div>
          </section>

          <section className="rounded-[2rem] bg-stone-950 p-5 text-white sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Peak hour forecast</p><h2 className="mt-2 text-2xl font-bold">When will it get busy?</h2><p className="mt-2 text-sm text-stone-400">Prediksi kunjungan relatif untuk hari ini.</p>
            <div className="mt-8 flex h-56 items-end gap-3 border-b border-white/10 pb-1">
              {ownerInsights.busyHours.map((item) => <div key={item.hour} className="flex h-full flex-1 flex-col justify-end"><motion.div initial={{ height: 0 }} animate={{ height: `${item.value}%` }} transition={{ duration: 0.7 }} className="min-h-3 rounded-t-xl bg-gradient-to-t from-violet-600 to-amber-300" /><p className="mt-2 text-center text-xs text-stone-500">{item.hour}:00</p></div>)}
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-sm font-bold text-white">Expected peak: 19:30–21:00</p><p className="mt-1 text-xs leading-5 text-stone-400">Siapkan tambahan staf floor dan prioritaskan reservasi meja T05–T08.</p></div>
          </section>
        </div>

        <section className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><UsersRound size={21} /></span><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">AI Customer Insight</p><h2 className="mt-1 text-2xl font-bold text-stone-950">Customer segments & next action</h2></div></div>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {ownerInsights.customerSegments.map((segment) => <article key={segment.name} className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5"><div className="flex items-center justify-between"><p className="font-bold text-stone-950">{segment.name}</p><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-violet-700">{segment.share}%</span></div><p className="mt-4 min-h-16 text-sm leading-6 text-stone-500">{segment.description}</p><div className="mt-4 rounded-xl bg-white p-3 text-xs leading-5 text-stone-700"><Target className="mr-1.5 inline text-violet-500" size={14} />{segment.strategy}</div></article>)}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <form onSubmit={handleGenerate} className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            <Megaphone className="text-violet-600" size={34} /><p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">AI Campaign Generator</p><h2 className="mt-2 text-3xl font-bold text-stone-950">Describe the business goal.</h2><p className="mt-2 text-sm leading-6 text-stone-500">AI akan membuat promo, quest, reward, dan notifikasi sebagai satu campaign utuh.</p>
            <div className="mt-6 space-y-4"><label><span className="form-label">Campaign goal</span><textarea value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })} className="form-control min-h-24 resize-none" /></label><label><span className="form-label">Target segment</span><select value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} className="form-control"><option>Gamer aktif</option><option>Pemburu diskon</option><option>Keluarga</option><option>Pelanggan loyal</option></select></label><label><span className="form-label">Communication style</span><select value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })} className="form-control"><option>Playful fantasy</option><option>Warm & family friendly</option><option>Premium</option><option>Urgent</option></select></label></div>
            <button className="button-dark mt-5 w-full justify-center"><Sparkles size={17} />{generating ? "Generating campaign..." : "Generate complete campaign"}</button>
          </form>

          <div className="rounded-[2rem] bg-gradient-to-br from-violet-700 to-stone-950 p-5 text-white sm:p-7">
            {!campaign ? <div className="flex min-h-[530px] flex-col items-center justify-center text-center"><span className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/10"><Megaphone className="text-amber-300" size={36} /></span><h3 className="mt-5 text-3xl font-bold">Campaign blueprint appears here.</h3><p className="mt-2 max-w-md text-sm leading-6 text-violet-200">Masukkan tujuan bisnis untuk membuat campaign yang siap diterapkan.</p></div> : <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Generated campaign</p><h3 className="mt-3 text-4xl font-bold">{campaign.name}</h3><p className="mt-3 text-sm leading-6 text-violet-100">{campaign.rationale}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{[["Promo", campaign.promo], ["Quest", campaign.quest], ["Reward", campaign.reward], ["Notification", campaign.notification]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"><p className="text-xs font-bold uppercase tracking-wider text-amber-300">{label}</p><p className="mt-2 text-sm leading-6 text-white">{value}</p></div>)}</div><div className="mt-5 rounded-2xl bg-white p-4 text-stone-950"><p className="text-sm font-bold">Recommended channels</p><div className="mt-3 flex flex-wrap gap-2">{campaign.channels.map((channel) => <span key={channel} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-bold">{channel}</span>)}</div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-950 py-3 text-sm font-bold text-white">Save as draft <ChevronRight size={16} /></button></div></motion.div>}
          </div>
        </section>
      </div>
    </div>
  );
}

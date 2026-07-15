import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { menuItems } from "../data/cafeData";
import { formatRupiah } from "../utils/formatRupiah";
import SectionHeading from "./ui/SectionHeading";

const categoryOrder = ["coffee", "main", "snack", "dessert"];

export default function ComboBuilder({ combo, onAdd, onDecrease, onRemove, onClear }) {
  const subtotal = useMemo(() => combo.reduce((total, item) => total + item.price * item.quantity, 0), [combo]);
  const uniqueCategories = new Set(combo.map((item) => item.category)).size;
  const discountRate = uniqueCategories >= 3 ? 0.1 : 0;
  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount;

  return (
    <section id="combo" className="section-space overflow-hidden bg-stone-950 text-white">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Build your own combo"
          title="Your cravings, your combination."
          description="Mix drinks, mains, snacks, and desserts. Select items from the menu or use the quick picks below. Complete three categories to unlock a 10% combo discount."
          inverse
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryOrder.map((category) => {
              const picks = menuItems.filter((item) => item.category === category).slice(0, 3);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold capitalize">{category}</h3>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-stone-300">Quick picks</span>
                  </div>
                  <div className="space-y-2.5">
                    {picks.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onAdd(item)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 text-left transition hover:border-amber-300/40 hover:bg-white/10"
                      >
                        <img src={item.image} alt="" className="h-12 w-12 rounded-xl bg-amber-50 object-contain p-1.5" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{item.name}</span>
                          <span className="mt-0.5 block text-xs text-stone-400">{formatRupiah(item.price)}</span>
                        </span>
                        <Plus size={18} className="text-amber-300" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] bg-amber-50 p-5 text-stone-950 shadow-2xl shadow-black/20 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Combo tray</p>
                  <h3 className="mt-1 text-2xl font-bold">Your selection</h3>
                </div>
                <ShoppingBag className="text-amber-700" />
              </div>

              {uniqueCategories >= 3 && (
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-100 px-3 py-2.5 text-sm font-semibold text-emerald-800">
                  <Sparkles size={16} /> 10% combo discount unlocked
                </div>
              )}

              <div className="mt-5 min-h-40 space-y-3">
                <AnimatePresence initial={false}>
                  {combo.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-dashed border-stone-300 p-8 text-center">
                      <p className="text-sm font-semibold text-stone-700">Your combo is empty.</p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">Add items from the menu or quick picks.</p>
                    </motion.div>
                  ) : (
                    combo.map((item) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 18 }}
                        className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <img src={item.image} alt="" className="h-11 w-11 rounded-xl bg-amber-50 object-contain p-1" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{item.name}</p>
                          <p className="text-xs text-stone-500">{formatRupiah(item.price * item.quantity)}</p>
                        </div>
                        <div className="flex items-center rounded-full border border-stone-200 bg-stone-50">
                          <button onClick={() => onDecrease(item.id)} className="p-2 text-stone-500 hover:text-stone-950"><Minus size={13} /></button>
                          <span className="min-w-5 text-center text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => onAdd(item)} className="p-2 text-stone-500 hover:text-stone-950"><Plus size={13} /></button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="p-1.5 text-stone-400 hover:text-red-600" aria-label={`Remove ${item.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5 space-y-2 border-t border-stone-200 pt-5 text-sm">
                <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
                <div className="flex justify-between text-emerald-700"><span>Combo discount</span><span>-{formatRupiah(discount)}</span></div>
                <div className="flex justify-between pt-2 text-xl font-bold"><span>Total</span><span>{formatRupiah(total)}</span></div>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
                <button onClick={() => document.getElementById("reservation")?.scrollIntoView({ behavior: "smooth" })} disabled={!combo.length} className="button-primary justify-center disabled:cursor-not-allowed disabled:opacity-40">
                  Use this combo
                </button>
                <button onClick={onClear} disabled={!combo.length} className="rounded-full border border-stone-300 px-4 text-sm font-bold disabled:opacity-40">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { menuItems } from "../data/cafeData";
import { addLoyaltyXp } from "../services/loyalty.service";
import { formatRupiah } from "../utils/formatRupiah";
import SectionHeading from "./ui/SectionHeading";

const categoryOrder = ["coffee", "main", "snack", "dessert"];

export default function ComboBuilder({
  combo,
  onAdd,
  onDecrease,
  onRemove,
  onClear,
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [order, setOrder] = useState({
    name: "",
    fulfillment: "dine-in",
    table: "",
    payment: "cashier",
    notes: "",
  });
  const [confirmation, setConfirmation] = useState(null);
  const subtotal = useMemo(
    () => combo.reduce((total, item) => total + item.price * item.quantity, 0),
    [combo],
  );
  const uniqueCategories = new Set(combo.map((item) => item.category)).size;
  const discountRate = uniqueCategories >= 3 ? 0.1 : 0;
  const discount = Math.round(subtotal * discountRate);
  const total = subtotal - discount;

  const submitOrder = (event) => {
    event.preventDefault();
    const orderId = `CL-${Date.now().toString().slice(-6)}`;
    const earnedXp = Math.max(20, Math.floor(total / 5000));
    addLoyaltyXp(earnedXp);
    setConfirmation({ ...order, orderId, total, earnedXp });
    setCheckoutOpen(false);
  };

  return (
    <section
      id="combo"
      className="section-space overflow-hidden bg-stone-950 text-white"
    >
      <div className="page-shell">
        <SectionHeading
          eyebrow="Build your own combo"
          title="Your cravings, your combination."
          description="Mix drinks, mains, snacks, and desserts. Complete three categories to unlock a 10% combo discount, then order directly or attach the combo to a reservation."
          inverse
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryOrder.map((category) => {
              const picks = menuItems
                .filter((item) => item.category === category)
                .slice(0, 3);
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
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-stone-300">
                      Quick picks
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {picks.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => onAdd(item)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 text-left transition hover:border-amber-300/40 hover:bg-white/10"
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="h-12 w-12 rounded-xl bg-amber-50 object-contain p-1.5"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">
                            {item.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-stone-400">
                            {formatRupiah(item.price)}
                          </span>
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
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                    Combo tray
                  </p>
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
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-dashed border-stone-300 p-8 text-center"
                    >
                      <p className="text-sm font-semibold text-stone-700">
                        Your combo is empty.
                      </p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">
                        Add items from the menu, AI advisor, or quick picks.
                      </p>
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
                        <img
                          src={item.image}
                          alt=""
                          className="h-11 w-11 rounded-xl bg-amber-50 object-contain p-1"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-500">
                            {formatRupiah(item.price * item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center rounded-full border border-stone-200 bg-stone-50">
                          <button
                            onClick={() => onDecrease(item.id)}
                            className="p-2 text-stone-500 hover:text-stone-950"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="min-w-5 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onAdd(item)}
                            className="p-2 text-stone-500 hover:text-stone-950"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5 space-y-2 border-t border-stone-200 pt-5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Combo discount</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
                <div className="flex justify-between pt-2 text-xl font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutOpen(true)}
                disabled={!combo.length}
                className="button-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CreditCard size={17} /> Order this combo
              </button>
              <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                <button
                  onClick={() =>
                    document
                      .getElementById("reservation")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  disabled={!combo.length}
                  className="min-h-11 rounded-full border border-stone-300 px-4 text-sm font-bold disabled:opacity-40"
                >
                  Attach to reservation
                </button>
                <button
                  onClick={onClear}
                  disabled={!combo.length}
                  className="rounded-full border border-stone-300 px-4 text-sm font-bold disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/75 p-4 backdrop-blur-sm"
          >
            <motion.form
              onSubmit={submitOrder}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-6 text-stone-950 shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                className="absolute right-5 top-5 rounded-full bg-stone-100 p-2 text-stone-500"
              >
                <X size={18} />
              </button>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Contactless order
              </p>
              <h3 className="mt-2 text-3xl font-bold">Complete your order.</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Prototype checkout untuk dine-in atau takeaway. Pembayaran asli
                dapat dihubungkan ke payment gateway backend.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="form-label">Customer name</span>
                  <input
                    required
                    value={order.name}
                    onChange={(event) =>
                      setOrder({ ...order, name: event.target.value })
                    }
                    className="form-control"
                    placeholder="Your name"
                  />
                </label>
                <label>
                  <span className="form-label">Order type</span>
                  <select
                    value={order.fulfillment}
                    onChange={(event) =>
                      setOrder({ ...order, fulfillment: event.target.value })
                    }
                    className="form-control"
                  >
                    <option value="dine-in">Dine in</option>
                    <option value="takeaway">Takeaway</option>
                  </select>
                </label>
                <label>
                  <span className="form-label">Table / pickup note</span>
                  <input
                    required
                    value={order.table}
                    onChange={(event) =>
                      setOrder({ ...order, table: event.target.value })
                    }
                    className="form-control"
                    placeholder={
                      order.fulfillment === "dine-in"
                        ? "Example: T05"
                        : "Pickup name"
                    }
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="form-label">Payment method</span>
                  <select
                    value={order.payment}
                    onChange={(event) =>
                      setOrder({ ...order, payment: event.target.value })
                    }
                    className="form-control"
                  >
                    <option value="cashier">Pay at cashier</option>
                    <option value="qris">QRIS demo</option>
                    <option value="card">Card demo</option>
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="form-label">Order notes</span>
                  <textarea
                    value={order.notes}
                    onChange={(event) =>
                      setOrder({ ...order, notes: event.target.value })
                    }
                    className="form-control min-h-20 resize-none"
                    placeholder="Less sugar, no ice, allergy note..."
                  />
                </label>
              </div>

              <div className="mt-6 rounded-2xl bg-stone-50 p-4 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>
                    {combo.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    item(s)
                  </span>
                  <span>Discount {formatRupiah(discount)}</span>
                </div>
                <div className="mt-2 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>
              <button className="button-dark mt-5 w-full justify-center">
                <CreditCard size={17} /> Place demo order
              </button>
            </motion.form>
          </motion.div>
        )}

        {confirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[115] flex items-center justify-center bg-stone-950/75 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md rounded-[2rem] bg-white p-7 text-center text-stone-950 shadow-2xl"
            >
              <CheckCircle2 className="mx-auto text-emerald-500" size={64} />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                Order received
              </p>
              <h3 className="mt-2 text-3xl font-bold">
                Thank you, {confirmation.name}!
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">
                Order <strong>{confirmation.orderId}</strong> has been added to
                the kitchen demo queue.
              </p>
              <div className="mt-5 rounded-2xl bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-900">
                  +{confirmation.earnedXp} Tavern Passport XP
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  Loyalty progress updated automatically.
                </p>
              </div>
              <div className="mt-4 flex justify-between rounded-2xl bg-stone-50 p-4 text-sm">
                <span>Total</span>
                <strong>{formatRupiah(confirmation.total)}</strong>
              </div>
              <button
                onClick={() => {
                  setConfirmation(null);
                  onClear();
                }}
                className="button-dark mt-5 w-full justify-center"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

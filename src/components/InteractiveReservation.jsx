import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Users, X } from "lucide-react";
import { tables } from "../data/cafeData";
import SectionHeading from "./ui/SectionHeading";

const times = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "20:30"];
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];

function getUnavailableTables(date, time) {
  if (!date || !time) return [];
  const seed = `${date}-${time}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return tables.filter((_, index) => (seed + index * 7) % 5 === 0).map((table) => table.id);
}

export default function InteractiveReservation({ combo, selectedActivities }) {
  const [form, setForm] = useState({ name: "", phone: "", date: localToday, time: "19:00", guests: 2, notes: "" });
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  const unavailable = useMemo(() => getUnavailableTables(form.date, form.time), [form.date, form.time]);
  const eligibleTables = useMemo(() => tables.filter((table) => table.seats >= Number(form.guests)), [form.guests]);

  const selectTable = (table) => {
    if (unavailable.includes(table.id) || table.seats < Number(form.guests)) return;
    setSelectedTableId(table.id);
  };

  const submitReservation = (event) => {
    event.preventDefault();
    const selectedTable = tables.find((table) => table.id === selectedTableId);
    if (!selectedTable) return;
    setConfirmation({ ...form, table: selectedTable });
  };

  return (
    <section id="reservation" className="section-space bg-white">
      <div className="page-shell">
        <SectionHeading
          eyebrow="Interactive reservation"
          title="Choose the exact table for your visit."
          description="Set the date, time, and party size to see real-time simulated availability. Then select a table directly from the cafe floor map."
        />

        <form onSubmit={submitReservation} className="mt-10 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-5 sm:p-7">
            <h3 className="text-xl font-bold text-stone-950">Reservation details</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <label>
                <span className="form-label">Full name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-control" placeholder="Your name" />
              </label>
              <label>
                <span className="form-label">Phone number</span>
                <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-control" placeholder="08xxxxxxxxxx" />
              </label>
              <label>
                <span className="form-label">Visit date</span>
                <input required type="date" min={localToday} value={form.date} onChange={(e) => { setForm({ ...form, date: e.target.value }); setSelectedTableId(null); }} className="form-control" />
              </label>
              <label>
                <span className="form-label">Guests</span>
                <select value={form.guests} onChange={(e) => { setForm({ ...form, guests: Number(e.target.value) }); setSelectedTableId(null); }} className="form-control">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}
                </select>
              </label>
            </div>

            <div className="mt-5">
              <span className="form-label">Available time</span>
              <div className="grid grid-cols-4 gap-2 xl:grid-cols-2">
                {times.map((time) => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => { setForm({ ...form, time }); setSelectedTableId(null); }}
                    className={`rounded-xl px-2 py-2.5 text-sm font-bold transition ${form.time === time ? "bg-stone-950 text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-stone-400"}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="form-label">Special request</span>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-control min-h-24 resize-none" placeholder="Birthday setup, high chair, accessibility needs..." />
            </label>

            <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 text-sm">
              <p className="font-bold text-stone-950">Attached to this visit</p>
              <p className="mt-1 text-stone-500">{combo.length} combo item(s) · {selectedActivities.length} game(s)</p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-stone-950 p-5 text-white sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Cafe floor map</p>
                <h3 className="mt-1 text-2xl font-bold">Select your preferred table</h3>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Available</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-red-400" /> Reserved</span>
                <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber-300" /> Selected</span>
              </div>
            </div>

            <div className="relative mt-6 min-h-[510px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_35%)] bg-stone-900">
              <div className="absolute left-4 right-4 top-4 flex h-10 items-center justify-center rounded-xl border border-dashed border-white/15 text-xs uppercase tracking-[0.25em] text-stone-500">Window view</div>
              <div className="absolute bottom-4 left-4 rounded-xl bg-amber-300 px-4 py-2 text-xs font-bold text-stone-950">ENTRANCE</div>
              <div className="absolute bottom-4 right-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-stone-400">BAR & KITCHEN</div>

              {tables.map((table) => {
                const isUnavailable = unavailable.includes(table.id);
                const tooSmall = table.seats < Number(form.guests);
                const selected = selectedTableId === table.id;
                return (
                  <motion.button
                    type="button"
                    key={table.id}
                    whileHover={!isUnavailable && !tooSmall ? { scale: 1.06 } : undefined}
                    whileTap={!isUnavailable && !tooSmall ? { scale: 0.96 } : undefined}
                    onClick={() => selectTable(table)}
                    disabled={isUnavailable || tooSmall}
                    style={{ left: `${table.x}%`, top: `${table.y}%` }}
                    className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border text-center shadow-lg transition ${
                      table.seats >= 6 ? "h-24 w-32 rounded-[2rem]" : table.seats >= 4 ? "h-24 w-24 rounded-3xl" : "h-20 w-20 rounded-full"
                    } ${
                      selected
                        ? "border-amber-200 bg-amber-300 text-stone-950 ring-4 ring-amber-300/20"
                        : isUnavailable
                          ? "cursor-not-allowed border-red-500/20 bg-red-400/15 text-red-200 opacity-65"
                          : tooSmall
                            ? "cursor-not-allowed border-white/5 bg-white/[0.03] text-stone-600"
                            : "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20"
                    }`}
                  >
                    <span className="text-sm font-bold">{table.id}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px]"><Users size={11} /> {table.seats}</span>
                    <span className="mt-0.5 text-[9px] uppercase tracking-wide opacity-70">{isUnavailable ? "Reserved" : tooSmall ? "Too small" : table.zone}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-stone-400">Selected table</p>
                <p className="mt-1 font-bold">
                  {selectedTableId ? tables.find((table) => table.id === selectedTableId)?.label : `${eligibleTables.filter((table) => !unavailable.includes(table.id)).length} suitable tables available`}
                </p>
              </div>
              <button type="submit" disabled={!selectedTableId} className="button-primary justify-center disabled:cursor-not-allowed disabled:opacity-40">
                Confirm reservation
              </button>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {confirmation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/70 p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
              <button onClick={() => setConfirmation(null)} className="absolute right-5 top-5 rounded-full bg-stone-100 p-2 text-stone-500 hover:text-stone-950"><X size={18} /></button>
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Reservation confirmed</p>
              <h3 className="mt-2 text-3xl font-bold text-stone-950">See you soon, {confirmation.name}!</h3>
              <p className="mt-3 leading-7 text-stone-600">Your selected table and activities have been added to this reservation demo.</p>
              <div className="mt-6 grid gap-3 rounded-2xl bg-stone-50 p-5 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2"><CalendarDays size={16} /> {confirmation.date}</p>
                <p className="flex items-center gap-2"><Clock3 size={16} /> {confirmation.time}</p>
                <p className="flex items-center gap-2"><Users size={16} /> {confirmation.guests} guest(s)</p>
                <p className="flex items-center gap-2"><MapPin size={16} /> {confirmation.table.label}</p>
              </div>
              <button onClick={() => setConfirmation(null)} className="button-dark mt-6 w-full justify-center">Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Bot, CalendarDays, Coffee, Sparkles } from "lucide-react";
import QRMenuAccess from "./QRMenuAccess";

const stats = [
  ["4.9/5", "Loved by our guests"],
  ["10:00–22:00", "Open every day"],
  ["Free", "Tabletop games"],
];

export default function HeroSection({ onReserve }) {
  const scrollToMenu = () =>
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  const scrollToAi = () =>
    document
      .getElementById("ai-tavern")
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative isolate min-h-screen overflow-hidden bg-stone-950 text-white"
    >
      <img
        src="/cafe1.jpg"
        alt="Warm Cafe Lab interior"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-900/25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(251,191,36,0.18),transparent_30%)]" />

      <div className="page-shell relative flex min-h-screen items-center pb-20 pt-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-xl"
          >
            <Sparkles size={16} className="text-amber-300" />
            Now powered by Arka, your AI Tavern Master
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.75 }}
            className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-8xl"
          >
            Sip, play, and
            <span className="block text-amber-300">stay a little longer.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.65 }}
            className="mt-7 max-w-2xl text-base leading-8 text-stone-200 sm:text-xl"
          >
            Choose your table, build a personal combo, play tabletop games, and
            let an AI Tavern Master recommend menus, generate quests, host
            trivia, and turn every visit into a story.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.6 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <button onClick={onReserve} className="button-primary">
              <CalendarDays size={18} /> Reserve a table
            </button>
            <button onClick={scrollToAi} className="button-secondary-dark">
              <Bot size={18} /> Meet AI Tavern Master
            </button>
            <QRMenuAccess />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-12 grid max-w-2xl grid-cols-1 divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {stats.map(([value, label]) => (
              <div key={label} className="px-0 py-4 first:pl-0 sm:px-5">
                <p className="text-lg font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-stone-400">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <button
        onClick={scrollToMenu}
        aria-label="Scroll to menu"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 animate-bounce rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur md:block"
      >
        <ArrowDown size={18} />
      </button>
    </section>
  );
}

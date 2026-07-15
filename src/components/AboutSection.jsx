import React from "react";
import { motion } from "framer-motion";
import { Coffee, Heart, Leaf, Users } from "lucide-react";
import { cafeHighlights } from "../data/cafeData";
import SectionHeading from "./ui/SectionHeading";

const values = [
  { icon: Coffee, title: "Thoughtful menu", text: "Comforting cafe favorites, local ingredients, and something for every mood." },
  { icon: Users, title: "Room to connect", text: "Tables designed for solo focus, friendly conversations, and community gatherings." },
  { icon: Leaf, title: "Calm by design", text: "A warm, green, and airy atmosphere that helps every guest slow down." },
  { icon: Heart, title: "Made with care", text: "Friendly service and small details that make each visit feel personal." },
];

export default function AboutSection({ standalone = false }) {
  return (
    <section id="about" className={`${standalone ? "pt-32" : ""} section-space bg-stone-50`}>
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <motion.img
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src="/cafe2.jpg"
              alt="Cafe Lab seating area"
              className="h-[520px] w-full rounded-[2rem] object-cover shadow-2xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute -bottom-5 right-4 max-w-xs rounded-[1.5rem] border border-white/20 bg-stone-950 p-5 text-white shadow-xl sm:right-8"
            >
              <p className="text-3xl font-display font-semibold text-amber-300">Since 2025</p>
              <p className="mt-2 text-sm leading-6 text-stone-300">A neighborhood cafe built for meaningful pauses, playful moments, and good food.</p>
            </motion.div>
          </div>

          <div className="lg:pl-8">
            <SectionHeading
              eyebrow="About Cafe Lab"
              title="A cozy third place between work and home."
              description="Cafe Lab started with one simple idea: a cafe should give you more than a seat and a drink. It should give you room to reconnect, recharge, create, and play."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {values.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-stone-200 bg-white p-5">
                  <Icon className="text-amber-700" size={22} />
                  <h3 className="mt-4 font-bold text-stone-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] bg-stone-200 md:grid-cols-4">
          {cafeHighlights.map((item) => (
            <div key={item.label} className="bg-white px-5 py-7 text-center">
              <p className="font-display text-3xl font-semibold text-stone-950 sm:text-4xl">{item.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-stone-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

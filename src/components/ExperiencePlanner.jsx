import React from "react";
import { motion } from "framer-motion";
import { Check, Clock3, Gamepad2, Users } from "lucide-react";
import { activities } from "../data/cafeData";
import SectionHeading from "./ui/SectionHeading";

export default function ExperiencePlanner({ selectedActivities, onToggle }) {
  const totalDuration = selectedActivities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <section id="experience" className="section-space bg-amber-50">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeading
            eyebrow="Experience planner"
            title="Add a little play to your coffee break."
            description="Choose complimentary games for your table. We will prepare them before you arrive, so your group can start playing right away."
          />
          <div className="rounded-[1.75rem] border border-amber-200 bg-white/70 p-5 backdrop-blur sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Your activity plan</p>
              <p className="mt-1 text-lg font-bold text-stone-950">
                {selectedActivities.length ? `${selectedActivities.length} games selected` : "No game selected yet"}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-stone-600 sm:mt-0">
              <Clock3 size={17} /> Approx. {totalDuration || 0} minutes
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity, index) => {
            const selected = selectedActivities.some((item) => item.id === activity.id);
            return (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                onClick={() => onToggle(activity)}
                className={`group relative overflow-hidden rounded-[1.75rem] border p-5 text-left transition ${
                  selected
                    ? "border-stone-950 bg-stone-950 text-white shadow-xl"
                    : "border-amber-200 bg-white text-stone-950 hover:border-amber-400 hover:shadow-lg"
                }`}
              >
                {activity.image && (
                  <img src={activity.image} alt="" className="absolute -right-5 -top-5 h-28 w-28 object-contain opacity-15 transition group-hover:rotate-6 group-hover:scale-110" />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{activity.icon}</span>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${selected ? "border-amber-300 bg-amber-300 text-stone-950" : "border-stone-200"}`}>
                      {selected ? <Check size={17} /> : <Gamepad2 size={16} />}
                    </span>
                  </div>
                  <p className={`mt-5 text-xs font-bold uppercase tracking-widest ${selected ? "text-amber-300" : "text-amber-700"}`}>{activity.type}</p>
                  <h3 className="mt-1 text-xl font-bold">{activity.name}</h3>
                  <p className={`mt-2 min-h-[72px] text-sm leading-6 ${selected ? "text-stone-300" : "text-stone-600"}`}>{activity.description}</p>
                  <div className={`mt-5 flex flex-wrap gap-3 border-t pt-4 text-xs font-semibold ${selected ? "border-white/10 text-stone-300" : "border-stone-100 text-stone-500"}`}>
                    <span className="flex items-center gap-1.5"><Users size={14} /> {activity.players}</span>
                    <span className="flex items-center gap-1.5"><Clock3 size={14} /> {activity.duration} min</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

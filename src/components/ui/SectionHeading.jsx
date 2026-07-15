import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, description, align = "left", inverse = false }) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.26em] ${inverse ? "text-amber-300" : "text-amber-700"}`}>
        {eyebrow}
      </p>
      <h2 className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl ${inverse ? "text-white" : "text-stone-950"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-8 sm:text-lg ${inverse ? "text-stone-300" : "text-stone-600"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}

import React from "react";
import { Coffee } from "lucide-react";

export default function Footer() {
  const goTo = (id) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-stone-200 bg-white py-8">
      <div className="page-shell flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <button onClick={() => goTo("home")} className="inline-flex items-center justify-center gap-2 font-display text-xl font-semibold text-stone-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-950 text-amber-300"><Coffee size={18} /></span>
          Cafe Lab
        </button>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-stone-500">
          {["menu", "combo", "experience", "reservation", "about", "contact"].map((item) => (
            <button key={item} onClick={() => goTo(item)} className="capitalize hover:text-stone-950">{item}</button>
          ))}
        </div>
        <p className="text-xs text-stone-400">© {new Date().getFullYear()} Cafe Lab. Experience demo.</p>
      </div>
    </footer>
  );
}

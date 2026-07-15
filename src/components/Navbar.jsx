import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Coffee, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const links = [
  { id: "menu", label: "Menu" },
  { id: "combo", label: "Build a Combo" },
  { id: "experience", label: "Activities" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return undefined;
    const ids = ["home", ...links.map((link) => link.id), "reservation"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -55%", threshold: [0.05, 0.25, 0.5] },
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const goToSection = (id) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[80] px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        animate={{
          backgroundColor: scrolled || open ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.08)",
          color: scrolled || open ? "#1c1917" : "#ffffff",
          borderColor: scrolled || open ? "rgba(231,229,228,1)" : "rgba(255,255,255,0.14)",
        }}
        className="mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-xl sm:px-5"
      >
        <button onClick={() => goToSection("home")} className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${scrolled || open ? "bg-stone-950 text-amber-300" : "bg-white text-stone-950"}`}>
            <Coffee size={18} />
          </span>
          <span>Cafe Lab</span>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => goToSection(link.id)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${activeSection === link.id ? (scrolled ? "bg-stone-100 text-stone-950" : "bg-white/15 text-white") : "opacity-75 hover:opacity-100"}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => goToSection("reservation")} className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold sm:flex ${scrolled || open ? "bg-stone-950 text-white" : "bg-amber-300 text-stone-950"}`}>
            <CalendarDays size={16} /> Reserve
          </button>
          <button onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" className={`rounded-full p-2.5 lg:hidden ${scrolled || open ? "bg-stone-100" : "bg-white/10"}`}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="mx-auto mt-2 max-w-7xl rounded-[1.75rem] border border-stone-200 bg-white p-3 text-stone-950 shadow-2xl lg:hidden"
          >
            {[...links, { id: "reservation", label: "Reserve a Table" }].map((link) => (
              <button key={link.id} onClick={() => goToSection(link.id)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left font-semibold hover:bg-stone-100">
                {link.label}<span className="text-stone-400">→</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Clock3, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";

const info = [
  { icon: MapPin, label: "Address", value: "Jl. Pluit Raya No. 29, Penjaringan, Jakarta Utara" },
  { icon: Clock3, label: "Opening hours", value: "Monday–Sunday · 10:00–22:00 WIB" },
  { icon: Phone, label: "Phone", value: "+62 857 9228 2059", href: "tel:+6285792282059" },
  { icon: Mail, label: "Email", value: "cafelabjkt@gmail.com", href: "mailto:cafelabjkt@gmail.com" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="section-space bg-amber-100/60">
      <div className="page-shell">
        <div className="grid overflow-hidden rounded-[2.25rem] bg-stone-950 text-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-10 lg:p-14">
            <SectionHeading
              eyebrow="Contact & info"
              title="Let us help plan your next cafe moment."
              description="Questions about group bookings, celebrations, dietary needs, or available games? Reach out before your visit."
              inverse
            />

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {info.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-amber-300"><Icon size={18} /></span>
                    <span>
                      <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">{label}</span>
                      <span className="mt-1 block text-sm leading-6 text-stone-200">{value}</span>
                    </span>
                  </>
                );
                return href ? (
                  <a key={label} href={href} className="flex gap-3 rounded-2xl border border-white/10 p-4 transition hover:bg-white/[0.06]">{content}</a>
                ) : (
                  <div key={label} className="flex gap-3 rounded-2xl border border-white/10 p-4">{content}</div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="https://wa.me/6285792282059" target="_blank" rel="noreferrer" className="button-primary">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
              <a href="https://www.instagram.com/cafelab_jkt" target="_blank" rel="noreferrer" className="button-secondary-dark">
                <Instagram size={18} /> @cafelab_jkt
              </a>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden">
            <img src="/cafe3.jpg" alt="Cafe Lab facade" className="absolute inset-0 h-full w-full object-cover opacity-65" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/15 bg-black/30 p-5 backdrop-blur-xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Visit us</p>
              <h3 className="mt-2 text-2xl font-bold">Easy to find. Hard to leave.</h3>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jl.+Pluit+Raya+No.+29+Jakarta+Utara"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-amber-300"
              >
                <MapPin size={16} /> Open directions
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

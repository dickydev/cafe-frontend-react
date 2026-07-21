import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNpcReply } from "../../services/aiTavern.service";

export default function TavernAssistantBubble() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", text: "Salam, traveler. Ada yang bisa Arka bantu?" }]);

  if (location.pathname.startsWith("/admin") || location.pathname === "/owner-ai-preview" || location.pathname === "/login") return null;

  const submit = async (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setMessages((current) => [...current, { role: "user", text: value }]);
    setInput("");
    const response = await getNpcReply(value);
    setMessages((current) => [...current, { role: "assistant", text: response.reply }]);
  };

  const openFullExperience = () => {
    setOpen(false);
    if (location.pathname !== "/") navigate("/#ai-tavern");
    else document.getElementById("ai-tavern")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-4 z-[90] sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 18, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} className="mb-3 flex h-[480px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-2xl shadow-stone-950/25">
            <div className="flex items-center justify-between bg-stone-950 p-4 text-white">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-stone-950"><Bot size={19} /></span><div><p className="font-bold">Arka AI</p><p className="text-xs text-emerald-400">● Tavern Master online</p></div></div>
              <button onClick={() => setOpen(false)} className="rounded-full bg-white/10 p-2"><X size={17} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
              {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.role === "user" ? "rounded-br-sm bg-violet-500 text-white" : "rounded-bl-sm border border-stone-200 bg-white text-stone-700"}`}>{message.text}</p></div>)}
            </div>
            <div className="border-t border-stone-200 p-3">
              <button onClick={openFullExperience} className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 py-2 text-xs font-bold text-amber-800"><Sparkles size={14} /> Open full AI Tavern</button>
              <form onSubmit={submit} className="flex gap-2"><input value={input} onChange={(event) => setInput(event.target.value)} className="min-h-11 flex-1 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-violet-400" placeholder="Ask Arka..." /><button className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-950 text-white"><Send size={17} /></button></form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setOpen((value) => !value)} className="ml-auto flex h-14 items-center gap-2 rounded-full bg-stone-950 px-4 text-sm font-bold text-white shadow-xl shadow-stone-950/25 ring-4 ring-white"><MessageCircle size={20} className="text-amber-300" /><span className="hidden sm:inline">Ask Arka AI</span></motion.button>
    </div>
  );
}

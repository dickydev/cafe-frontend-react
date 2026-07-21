import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import { getNpcReply } from "../../services/aiTavern.service";
import { addLoyaltyXp, getLoyaltyXp, loyaltyEventName } from "../../services/loyalty.service";

const initialMessages = [
  { id: 1, role: "assistant", text: "Selamat datang, traveler. Aku Arka, Tavern Master Cafe Lab. Tanyakan menu, game, quest, atau rahasia tavern ini." },
];

export default function NpcChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [xp, setXp] = useState(getLoyaltyXp);
  const endRef = useRef(null);
  const level = Math.floor(xp / 50) + 1;
  const levelProgress = xp % 50;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const update = (event) => setXp(event.detail?.xp ?? getLoyaltyXp());
    window.addEventListener(loyaltyEventName, update);
    return () => window.removeEventListener(loyaltyEventName, update);
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: Date.now(), role: "user", text }]);
    setInput("");
    const response = await getNpcReply(text);
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: response.reply }]);
      addLoyaltyXp(response.xp);
    }, 350);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
      <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-violet-500/15 to-amber-300/10 p-6">
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-amber-300/20 bg-stone-950 shadow-2xl shadow-violet-950/40">
          <div className="absolute inset-3 rounded-full border border-dashed border-white/10" />
          <Bot className="text-amber-300" size={72} />
          <Sparkles className="absolute right-5 top-7 text-violet-300" size={24} />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-300">AI NPC</p>
          <h4 className="mt-2 text-3xl font-bold text-white">Arka the Tavern Master</h4>
          <p className="mt-2 text-sm leading-6 text-stone-400">Hubungan naik saat kamu berbicara dan menyelesaikan quest. Level baru membuka dialog dan reward khusus.</p>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-sm"><span className="font-bold text-white">Relationship Level {level}</span><span className="text-amber-300">{xp} XP</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${(levelProgress / 50) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-violet-400 to-amber-300" /></div>
          <p className="mt-2 text-xs text-stone-500">{50 - levelProgress} XP menuju level berikutnya</p>
        </div>
      </div>

      <div className="flex min-h-[520px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-stone-900/80">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="font-bold text-white">Conversation chamber</p>
          <p className="text-xs text-emerald-400">● Arka is online</p>
        </div>
        <div className="hide-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${message.role === "assistant" ? "bg-amber-300 text-stone-950" : "bg-violet-500 text-white"}`}>
                {message.role === "assistant" ? <Bot size={17} /> : <UserRound size={17} />}
              </span>
              <p className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "rounded-tl-sm bg-white/[0.07] text-stone-200" : "rounded-tr-sm bg-violet-500 text-white"}`}>{message.text}</p>
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {["Rekomendasikan menu", "Game apa yang cocok?", "Apa quest hari ini?"].map((item) => <button key={item} onClick={() => setInput(item)} className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 text-xs text-stone-400 hover:text-white">{item}</button>)}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Talk to Arka..." className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-stone-950 px-4 text-sm text-white outline-none focus:border-violet-400" />
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500 text-white hover:bg-violet-400"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}

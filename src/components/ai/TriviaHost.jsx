import React, { useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import { triviaQuestions } from "../../services/aiTavern.service";
import { addLoyaltyXp } from "../../services/loyalty.service";

const categories = ["teknologi", "anime", "film", "sepakbola", "umum"];

export default function TriviaHost() {
  const [category, setCategory] = useState("teknologi");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const questions = useMemo(() => triviaQuestions[category], [category]);
  const question = questions[index];

  const choose = (answerIndex) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    if (answerIndex === question.answer) setScore((current) => current + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setFinished(true);
      if (score === questions.length && !rewarded) { addLoyaltyXp(30); setRewarded(true); }
    } else { setIndex((current) => current + 1); setSelected(null); }
  };

  const reset = (nextCategory = category) => {
    setCategory(nextCategory); setIndex(0); setSelected(null); setScore(0); setFinished(false); setRewarded(false);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.65fr_1.35fr]">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5">
        <BrainCircuit className="text-amber-300" size={38} />
        <h4 className="mt-4 text-2xl font-bold text-white">AI Trivia Host</h4>
        <p className="mt-2 text-sm leading-6 text-stone-400">Mainkan kuis singkat sambil menunggu pesanan. Skor penuh membuka bonus XP demo.</p>
        <div className="mt-5 space-y-2">
          {categories.map((item) => (
            <button key={item} onClick={() => reset(item)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold capitalize ${category === item ? "bg-amber-300 text-stone-950" : "bg-white/[0.05] text-stone-300 hover:bg-white/10"}`}>{item}<span>→</span></button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-stone-900/80 p-5 sm:p-7">
        {!finished ? (
          <>
            <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Question {index + 1} / {questions.length}</p><p className="text-sm font-bold text-amber-300">Score {score}</p></div>
            <h4 className="mt-6 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">{question.question}</h4>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {question.options.map((option, answerIndex) => {
                const isCorrect = answerIndex === question.answer;
                const isSelected = answerIndex === selected;
                let stateClass = "border-white/10 bg-white/[0.05] text-stone-200 hover:border-violet-400/50 hover:bg-white/[0.08]";
                if (selected !== null && isCorrect) stateClass = "border-emerald-400 bg-emerald-400/15 text-emerald-100";
                else if (isSelected) stateClass = "border-red-400 bg-red-400/15 text-red-100";
                return <button key={option} onClick={() => choose(answerIndex)} className={`flex min-h-20 items-center justify-between rounded-2xl border p-4 text-left text-sm font-semibold transition ${stateClass}`}><span>{option}</span>{selected !== null && isCorrect ? <CheckCircle2 size={18} /> : isSelected ? <XCircle size={18} /> : null}</button>;
              })}
            </div>
            {selected !== null && <button onClick={next} className="mt-6 min-h-12 w-full rounded-2xl bg-white text-sm font-bold text-stone-950 hover:bg-amber-100">{index === questions.length - 1 ? "See result" : "Next question"}</button>}
          </>
        ) : (
          <div className="flex min-h-[390px] flex-col items-center justify-center text-center">
            <Trophy className="text-amber-300" size={72} />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Trivia complete</p>
            <h4 className="mt-2 text-4xl font-bold text-white">{score}/{questions.length} correct</h4>
            <p className="mt-3 text-stone-400">{score === questions.length ? "Perfect! Kamu mendapatkan bonus 30 XP." : "Coba kategori lain untuk mengasah pengetahuan party-mu."}</p>
            <button onClick={() => reset()} className="mt-6 flex min-h-12 items-center gap-2 rounded-2xl bg-amber-300 px-6 text-sm font-bold text-stone-950"><RotateCcw size={17} /> Play again</button>
          </div>
        )}
      </div>
    </div>
  );
}

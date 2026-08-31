"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, RotateCcw, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { answerWithPlugV, launchedVehicleCount, type SmartAssistantReply } from "@/lib/assistant/smartAssistant";

type Message = { id: string; role: "user" | "assistant"; content: string; reply?: SmartAssistantReply };

const prompts = [
  "Find a family SUV under ₹25 lakh for 50 km daily driving",
  "Compare Tata Nexon EV and Mahindra BE 6",
  "Find CCS2 fast chargers in Hyderabad",
  "Can the Tiago EV cover 180 km starting at 90%?",
];

function RecommendationCards({ reply }: { reply: SmartAssistantReply }) {
  if (!reply.recommendations?.length) return null;
  return <div className="mt-4 grid gap-3 sm:grid-cols-3">{reply.recommendations.map(({ vehicle, score, reasons }) => <Link key={vehicle.slug} href={`/vehicles/${vehicle.slug}`} className="rounded-xl border border-white/10 bg-slate-950/70 p-3 transition hover:border-sky-300/30">
    <p className="text-sm font-semibold text-white">{vehicle.brand} {vehicle.name}</p>
    <p className="mt-1 text-xs text-sky-200">PlugV fit {score}</p>
    <p className="mt-2 text-xs leading-5 text-slate-400">{reasons[0]}</p>
  </Link>)}</div>;
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageSequence = useRef(0);

  function submit(text = input) {
    const value = text.trim();
    if (!value) return;
    const reply = answerWithPlugV(value);
    messageSequence.current += 1;
    const stamp = String(messageSequence.current);
    setMessages((current) => [...current, { id: `${stamp}-user`, role: "user", content: value }, { id: `${stamp}-assistant`, role: "assistant", content: reply.text, reply }]);
    setInput("");
  }

  return <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
    <SiteHeader />
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.17),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.13),transparent_30%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200"><Sparkles className="h-4 w-4" />PlugV Smart Assistant</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Ask once. Get a clear EV next step.</h1>
            <p className="mt-5 text-base leading-8 text-slate-300">A private, no-billing decision assistant powered by PlugV’s current EV catalogue, practical-range profiles and reviewed ownership guides.</p>
            <div className="mt-8 space-y-3">{prompts.map((prompt) => <button key={prompt} onClick={() => submit(prompt)} className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm leading-6 text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-300/10">{prompt}<ArrowRight className="h-4 w-4 shrink-0 text-sky-300 transition group-hover:translate-x-0.5" /></button>)}</div>
            <div className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-200"><ShieldCheck className="h-4 w-4" />Rule-based and grounded</div><p className="mt-2 text-xs leading-6 text-slate-400">No external AI model receives your prompt. PlugV uses transparent decision rules and labels practical estimates and unknown live status.</p></div>
          </aside>

          <section className="flex min-h-[650px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-300 text-slate-950"><Bot className="h-5 w-5" /></div><div><p className="font-semibold">PlugV Smart Assistant</p><p className="text-xs text-slate-400">Grounded across {launchedVehicleCount()} launched EVs</p></div></div>{messages.length ? <button onClick={() => setMessages([])} className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Start a new conversation"><RotateCcw className="h-4 w-4" /></button> : null}</header>
            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6" aria-live="polite">
              {!messages.length ? <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10"><Sparkles className="h-7 w-7 text-sky-300" /></div><h2 className="mt-5 text-2xl font-semibold">What EV decision can I help with?</h2><p className="mt-2 max-w-md text-sm leading-7 text-slate-400">Include your city, budget, daily kilometres, EV names or trip distance for a more useful answer.</p></div> : null}
              {messages.map((message) => <article key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" ? <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-300 text-slate-950"><Bot className="h-4 w-4" /></div> : null}
                <div className={`max-w-[90%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-sky-300 text-slate-950" : "border border-white/10 bg-white/[0.05]"}`}><div className="whitespace-pre-wrap text-sm leading-7 sm:text-base">{message.content}</div>{message.reply ? <><RecommendationCards reply={message.reply} /><div className="mt-4 flex flex-wrap gap-2">{message.reply.actions.map((action) => <Link key={`${message.id}-${action.href}-${action.label}`} href={action.href} className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-300/20">{action.label}</Link>)}</div></> : null}</div>
                {message.role === "user" ? <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"><User className="h-4 w-4" /></div> : null}
              </article>)}
            </div>
            <div className="border-t border-white/10 p-4 sm:p-5"><form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex items-end gap-3 rounded-2xl border border-white/10 bg-slate-950/80 p-2 focus-within:border-sky-300/35"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} rows={2} enterKeyHint="send" placeholder="Ask about an EV, route, charger or ownership decision…" className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-slate-500" /><button type="submit" disabled={!input.trim()} className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-300 text-slate-950 transition hover:bg-sky-200 disabled:opacity-40" aria-label="Send message"><Send className="h-4 w-4" /></button></form><p className="mt-2 text-center text-[11px] leading-5 text-slate-500">PlugV provides decision support—not a quotation. Confirm critical specifications, prices and live charger status with the manufacturer or operator.</p></div>
          </section>
        </div>
      </div>
    </section>
    <SiteFooter />
  </main>;
}

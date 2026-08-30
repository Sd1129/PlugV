"use client";

import { useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart } from "ai";
import { ArrowRight, Bot, LoaderCircle, RotateCcw, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import type { PlugVAgentMessage } from "@/lib/ai/plugv-agent";

const prompts = [
  "Find a family SUV under ₹25 lakh for 50 km daily driving",
  "Compare Tata Nexon EV and Mahindra BE 6 for highway travel",
  "Find CCS2 fast chargers in Hyderabad and tell me what status is actually known",
  "Can the Tiago EV Long Range cover a 180 km trip starting at 90%?",
];

const toolLabels: Record<string, string> = {
  recommendVehicles: "Searching Indian EVs",
  compareVehicles: "Comparing vehicles and variants",
  findChargers: "Checking PlugV charging data",
  estimateTripReadiness: "Calculating trip readiness",
  searchKnowledge: "Reading reviewed PlugV guides",
};

function MessageContent({ message }: { message: PlugVAgentMessage }) {
  return <div className="space-y-3">{message.parts.map((part, index) => {
    if (part.type === "text") return <div key={index} className="whitespace-pre-wrap text-sm leading-7 text-slate-200 sm:text-base">{part.text}</div>;
    if (isToolUIPart(part)) {
      const complete = part.state === "output-available";
      const toolName = part.type.startsWith("tool-") ? part.type.slice(5) : "";
      return <div key={part.toolCallId} className="flex items-center gap-2 rounded-xl border border-sky-300/10 bg-sky-300/[0.06] px-3 py-2 text-xs font-semibold text-sky-100/80">
        {complete ? <ShieldCheck className="h-4 w-4 text-emerald-300" /> : <LoaderCircle className="h-4 w-4 animate-spin" />}
        {toolLabels[toolName] ?? "Checking PlugV data"}{complete ? " — complete" : "…"}
      </div>;
    }
    return null;
  })}</div>;
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, setMessages, stop } = useChat<PlugVAgentMessage>({
    transport: new DefaultChatTransport({ api: "/api/assistant" }),
  });
  const busy = status === "submitted" || status === "streaming";

  function submit(text = input) {
    const value = text.trim();
    if (!value || busy) return;
    sendMessage({ text: value });
    setInput("");
  }

  return <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
    <SiteHeader />
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.17),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.13),transparent_30%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200"><Sparkles className="h-4 w-4" />PlugV Copilot</div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Ask once. Let PlugV do the research.</h1>
            <p className="mt-5 text-base leading-8 text-slate-300">A grounded EV agent that can search vehicles, compare variants, check chargers, estimate trip readiness and read PlugV owner guides in one conversation.</p>

            <div className="mt-8 space-y-3">
              {prompts.map((prompt) => <button key={prompt} onClick={() => submit(prompt)} disabled={busy} className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm leading-6 text-slate-200 transition hover:border-sky-300/30 hover:bg-sky-300/10 disabled:opacity-50">{prompt}<ArrowRight className="h-4 w-4 shrink-0 text-sky-300 transition group-hover:translate-x-0.5" /></button>)}
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200"><ShieldCheck className="h-4 w-4" />Grounded, not guessing</div>
              <p className="mt-2 text-xs leading-6 text-slate-400">PlugV labels planning estimates and unknown charger availability. Always confirm price, stock and live operator status before acting.</p>
            </div>
          </aside>

          <section className="flex min-h-[650px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-300 text-slate-950"><Bot className="h-5 w-5" /></div><div><p className="font-semibold">PlugV Copilot</p><p className="text-xs text-slate-400">EV decisions and ownership intelligence</p></div></div>
              {messages.length ? <button onClick={() => setMessages([])} className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Start a new conversation"><RotateCcw className="h-4 w-4" /></button> : null}
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6" aria-live="polite">
              {!messages.length ? <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10"><Sparkles className="h-7 w-7 text-sky-300" /></div><h2 className="mt-5 text-2xl font-semibold">What EV decision can I help with?</h2><p className="mt-2 max-w-md text-sm leading-7 text-slate-400">Include your city, budget, daily kilometres, home-charging access or travel route for a more useful answer.</p></div> : null}
              {messages.map((message) => <article key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role !== "user" ? <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-300 text-slate-950"><Bot className="h-4 w-4" /></div> : null}
                <div className={`max-w-[88%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-sky-300 text-slate-950" : "border border-white/10 bg-white/[0.05]"}`}><MessageContent message={message} /></div>
                {message.role === "user" ? <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"><User className="h-4 w-4" /></div> : null}
              </article>)}
              {status === "submitted" ? <div className="flex items-center gap-3 text-sm text-slate-400"><LoaderCircle className="h-4 w-4 animate-spin text-sky-300" />Planning which PlugV tools to use…</div> : null}
              {error ? <div className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4 text-sm leading-6 text-rose-100">PlugV Copilot is temporarily unavailable. You can still use <Link className="underline" href="/vehicles">Explore EVs</Link>, <Link className="underline" href="/compare">Compare</Link>, <Link className="underline" href="/charging">Charging</Link> and <Link className="underline" href="/travel">Travel</Link>.</div> : null}
            </div>

            <div className="border-t border-white/10 p-4 sm:p-5">
              <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="flex items-end gap-3 rounded-2xl border border-white/10 bg-slate-950/80 p-2 focus-within:border-sky-300/35">
                <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }} rows={2} enterKeyHint="send" placeholder="Ask about an EV, route, charger or ownership decision…" className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white outline-none placeholder:text-slate-500" />
                {busy ? <button type="button" onClick={stop} className="flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-200">Stop</button> : <button type="submit" disabled={!input.trim()} className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-300 text-slate-950 transition hover:bg-sky-200 disabled:opacity-40" aria-label="Send message"><Send className="h-4 w-4" /></button>}
              </form>
              <p className="mt-2 text-center text-[11px] leading-5 text-slate-500">AI can make mistakes. PlugV shows available evidence and labels estimates; verify critical details with the manufacturer or operator.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
    <SiteFooter />
  </main>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle, Sparkles, X } from "lucide-react";
import { useState } from "react";

const quickQuestions = [
  "Find the right EV for my budget",
  "Which EV suits my daily travel?",
];

export default function FloatingAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/assistant") return null;

  return (
    <aside className="fixed bottom-4 right-4 z-[70] flex flex-col items-end sm:bottom-6 sm:right-6">
      {open ? (
        <div id="plugv-assistant-popup" className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[1.75rem] border border-sky-300/20 bg-slate-950/95 shadow-[0_24px_80px_-20px_rgba(14,165,233,0.55)] backdrop-blur-xl">
          <div className="relative border-b border-white/10 bg-gradient-to-br from-sky-400/20 to-blue-500/5 p-5">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Close EV Assistant">
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-300 text-slate-950 shadow-lg shadow-sky-400/20"><Sparkles className="h-5 w-5" /></div>
            <p className="mt-4 text-lg font-semibold text-white">Not sure which EV is right?</p>
            <p className="mt-1.5 pr-5 text-sm leading-6 text-slate-300">Tell PlugV your budget and needs. Get clear, India-focused recommendations.</p>
          </div>
          <div className="p-4">
            <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">You can ask</p>
            <div className="mt-2 space-y-2">
              {quickQuestions.map((question) => (
                <Link key={question} href="/assistant" className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200 transition hover:border-sky-300/25 hover:bg-sky-300/10">
                  <span>{question}</span><ArrowRight className="h-4 w-4 shrink-0 text-sky-300" />
                </Link>
              ))}
            </div>
            <Link href="/assistant" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-sky-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-sky-200">Ask the EV Assistant<ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      ) : null}
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="plugv-assistant-popup" aria-label="Ask PlugV" className="group flex h-12 w-12 items-center justify-center gap-3 rounded-full border border-sky-200/30 bg-sky-300 p-0 text-sm font-semibold text-slate-950 shadow-[0_16px_45px_-14px_rgba(56,189,248,0.9)] transition hover:-translate-y-0.5 hover:bg-sky-200 sm:h-14 sm:w-auto sm:px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sky-300"><MessageCircle className="h-4 w-4" /></span>
        <span className="hidden sm:inline">Ask PlugV</span>
      </button>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { searchIndex, type SearchItem } from "@/lib/search/searchIndex";

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function matchScore(item: SearchItem, query: string) {
  const q = normalize(query);
  if (!q) return 0;

  const haystack = [item.title, item.subtitle, ...item.keywords].join(" ").toLowerCase();

  if (item.title.toLowerCase() === q) return 100;
  if (item.title.toLowerCase().includes(q)) return 80;
  if (haystack.includes(q)) return 60;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  const hits = tokens.filter((token) => haystack.includes(token)).length;
  return Math.round((hits / tokens.length) * 50);
}

export default function UniversalSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];

    return [...searchIndex]
      .map((item) => ({ item, score: matchScore(item, q) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [query]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur">
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3">
        <Search className="h-4 w-4 text-sky-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search listed EVs and PlugV pages"
          placeholder="Try Nexon, Tata, or Compare"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
        <Sparkles className="h-4 w-4 text-slate-500" />
      </label>

      <div className="mt-3 flex flex-wrap gap-2" aria-label="Example searches">{["Nexon", "Tata", "Compare"].map(example => <button type="button" key={example} onClick={() => setQuery(example)} className="rounded-full border border-white/20 px-3 py-2 text-sm text-sky-200 hover:bg-white/10">{example}</button>)}</div>
      <p role="status" className="mt-3 text-sm text-slate-300">{query.trim() ? `${results.length} matching results shown` : "Enter a keyword or choose an example."}</p>
      {query.trim() ? (
        <div className="mt-4 grid gap-3">
          {results.length > 0 ? (
            results.map(({ item }) => (
              <Link
                key={`${item.category}-${item.id}`}
                href={item.href}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition hover:bg-white/10"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:text-sky-300" />
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-slate-400">
              No matches found. Try a shorter model or brand name. For a city or station, use the charging finder.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
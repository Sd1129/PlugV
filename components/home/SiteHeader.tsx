"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowRight, BookOpen, ChevronDown, Gauge, Menu, X } from "lucide-react";

import { vehicles } from "@/data/vehicles";

const NAV_LINKS = [
  { href: "/vehicles", label: "Explore EVs" },
  { href: "/compare", label: "Compare" },
  { href: "/charging", label: "Charging" },
  { href: "/travel", label: "Travel" },
  { href: "/upcoming", label: "Upcoming" },
];

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    return vehicles
      .filter((vehicle) => {
        return (
          vehicle.name.toLowerCase().includes(q) ||
          vehicle.brand.toLowerCase().includes(q) ||
          vehicle.type.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToVehicle(vehicle: (typeof vehicles)[number]) {
    setQuery("");
    setOpen(false);
    router.push(`/vehicles/${vehicle.slug}`);
  }

  function submitSearch() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/vehicles?query=${encodeURIComponent(q)}`);
  }

function isActiveLink(href: string) {
    if (href === "/vehicles") return pathname === "/vehicles" || pathname.startsWith("/vehicles/");
    if (href === "/knowledge") return pathname === "/knowledge" || pathname.startsWith("/knowledge/");
    return pathname === href;
  }

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-slate-950/95 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/logo-icon.svg" alt="" width={44} height={44} className="h-11 w-11 rounded-xl shadow-lg shadow-sky-950/30" priority />

          <div>
            <p className="text-xl font-semibold tracking-[-0.035em] text-white">Plug<span className="text-sky-300">V</span></p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              India&apos;s EV platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
  {NAV_LINKS.map((link) => {
    const active = isActiveLink(link.href);

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={[
          "rounded-full px-3 py-1.5 text-sm transition",
          active
            ? "bg-sky-400/10 text-sky-400 font-semibold ring-1 ring-sky-400/20"
            : "font-medium text-slate-300 hover:text-white hover:bg-white/5",
        ].join(" ")}
      >
        {link.label}
      </Link>
    );
  })}

  <div className="group relative">
    <Link
      href="/my-ev"
      aria-current={pathname === "/my-ev" ? "page" : undefined}
      className={[
        "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition",
        pathname === "/my-ev" || pathname.startsWith("/knowledge")
          ? "bg-sky-400/10 font-semibold text-sky-400 ring-1 ring-sky-400/20"
          : "font-medium text-slate-300 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      My EV
      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
    </Link>

    <div className="invisible absolute right-0 top-full z-50 w-64 translate-y-2 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
      <div className="rounded-2xl border border-white/10 bg-slate-950/98 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <Link
          href="/my-ev"
          className="flex items-start gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white focus:outline-none"
        >
          <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
          <span>
            <span className="block text-sm font-semibold">My EV Dashboard</span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-500">Ownership tools, trips and reminders</span>
          </span>
        </Link>
        <Link
          href="/knowledge"
          className="flex items-start gap-3 rounded-xl px-3 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white focus:outline-none"
        >
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
          <span>
            <span className="block text-sm font-semibold">Knowledge Hub</span>
            <span className="mt-0.5 block text-xs leading-5 text-slate-500">EV guides, facts and calculators</span>
          </span>
        </Link>
      </div>
    </div>
  </div>
</nav>

        <div ref={wrapRef} className="relative hidden w-full max-w-[360px] lg:block">
          <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 shadow-lg shadow-black/10 backdrop-blur">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitSearch();
                }
              }}
              placeholder="Search EVs, brands..."
              aria-label="Search EVs"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          {open && query.trim().length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-50 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/80">
                  Suggestions
                </p>
              </div>

              {suggestions.length > 0 ? (
                <div className="max-h-80 overflow-auto p-2">
                  {suggestions.map((vehicle) => (
                    <button
                      key={vehicle.slug}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToVehicle(vehicle)}
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {vehicle.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {vehicle.brand} • {vehicle.type}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-5 text-sm text-slate-400">
                  No matching vehicles found.
                </div>
              )}

              <div className="border-t border-white/10 p-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={submitSearch}
                  className="flex w-full items-center justify-center rounded-2xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Search all results
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <button type="button" onClick={() => setMobileOpen((current) => !current)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>

      {mobileOpen ? (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/10 bg-slate-950/98 px-4 py-4 shadow-2xl lg:hidden">
          <div className="mx-auto w-full max-w-7xl">
            <form
              className="mb-4 flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                setMobileOpen(false);
                submitSearch();
              }}
            >
              <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="sr-only">Search EVs and brands</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search EVs or brands"
                  className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                />
              </label>
              <button
                type="submit"
                disabled={!query.trim()}
                className="min-h-12 rounded-2xl bg-sky-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Search
              </button>
            </form>

            <nav aria-label="Mobile navigation" className="grid gap-2">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold ${active ? "bg-sky-400/10 text-sky-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-1 border-t border-white/10 pt-3">
                <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">My EV</p>
                <Link
                  href="/my-ev"
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === "/my-ev" ? "page" : undefined}
                  className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold ${pathname === "/my-ev" ? "bg-sky-400/10 text-sky-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                >
                  <Gauge className="h-4 w-4 text-sky-300" />
                  My EV Dashboard
                </Link>
                <Link
                  href="/knowledge"
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname.startsWith("/knowledge") ? "page" : undefined}
                  className={`mt-1 flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold ${pathname.startsWith("/knowledge") ? "bg-sky-400/10 text-sky-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
                >
                  <BookOpen className="h-4 w-4 text-emerald-300" />
                  Knowledge Hub
                </Link>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
    <div aria-hidden="true" className="h-20 shrink-0" />
    </>
  );
}

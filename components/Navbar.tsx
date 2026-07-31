"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Home, Search, X } from "lucide-react";
import { vehicles } from "@/data/vehicles";
import { upcomingEVs } from "@/data/upcoming";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLDivElement | null>(null);

  const launchedVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.launched).slice(0, 6),
    []
  );

  const upcomingVehicles = useMemo(() => upcomingEVs.slice(0, 6), []);

  const filteredVehicles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return launchedVehicles;

    return launchedVehicles.filter((vehicle) => {
      return (
        vehicle.name.toLowerCase().includes(q) ||
        vehicle.brand.toLowerCase().includes(q) ||
        vehicle.type.toLowerCase().includes(q)
      );
    });
  }, [query, launchedVehicles]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      if (!searchOpen) return;
      const target = event.target as Node | null;
      if (navRef.current && target && !navRef.current.contains(target)) {
        setSearchOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-200 bg-white/90 backdrop-blur-md">
      <div className="bg-emerald-950 px-4 py-2 text-center text-[11px] font-semibold tracking-[0.25em] text-emerald-50">
        DISCOVER LAUNCHED EVS, UPCOMING MODELS, AND CHARGING STATIONS
      </div>

      <div ref={navRef} className="relative">
        <div className="mx-auto grid h-20 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/plugv-logo.png"
              alt="PlugV"
              width={140}
              height={48}
              priority
              className="h-auto w-[120px] object-contain sm:w-[130px] lg:w-[140px]"
            />
          </Link>

          <nav className="hidden items-center justify-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <Dropdown
              label="Vehicles"
              links={launchedVehicles.map((vehicle) => ({
                label: vehicle.name,
                href: `/vehicles/${vehicle.slug}`,
              }))}
            />

            <Dropdown
              label="Upcoming EVs"
              links={upcomingVehicles.map((vehicle) => ({
                label: vehicle.name,
                href: "/upcoming",
              }))}
            />

            <Link href="/compare" className="transition hover:text-emerald-700">
              PlugV Compare
            </Link>

            <Link href="/charging" className="transition hover:text-emerald-700">
              Charging Stations
            </Link>

            <Link href="/about" className="transition hover:text-emerald-700">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:bg-emerald-50"
              aria-label="Home"
              title="Home"
            >
              <Home className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white transition hover:bg-emerald-800"
              aria-label="Search vehicles"
              title="Search vehicles"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-t border-emerald-100 bg-white shadow-2xl">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-emerald-100 bg-slate-50 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Search Vehicles
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by vehicle name, brand, or type..."
                      className="w-full bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="mt-4 max-h-72 space-y-2 overflow-auto pr-1">
                    {filteredVehicles.map((vehicle) => (
                      <Link
                        key={vehicle.slug}
                        href={`/vehicles/${vehicle.slug}`}
                        className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-3 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                        }}
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-950">
                            {vehicle.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {vehicle.brand} • {vehicle.type}
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-emerald-700">
                          {vehicle.price}
                        </div>
                      </Link>
                    ))}

                    {filteredVehicles.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
                        No launched EVs match your search.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                  <PanelCard
                    title="Quick Links"
                    items={[
                      { label: "Home", href: "/" },
                      { label: "Compare", href: "/compare" },
                      { label: "Charging Stations", href: "/charging" },
                      { label: "Upcoming EVs", href: "/upcoming" },
                    ]}
                  />

                  <PanelCard
                    title="Popular EVs"
                    items={launchedVehicles.slice(0, 4).map((vehicle) => ({
                      label: vehicle.name,
                      href: `/vehicles/${vehicle.slug}`,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Dropdown({
  label,
  links,
}: {
  label: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 transition hover:text-emerald-700">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      <div className="invisible absolute left-0 mt-4 w-72 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function PanelCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="rounded-[28px] border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
        {title}
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block rounded-2xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
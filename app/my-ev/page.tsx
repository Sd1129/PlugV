"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bell, Bookmark, Calculator, CalendarClock, Car, ChevronRight, HeartPulse, MapPin, Phone, Plus, ShieldCheck, Trash2, Zap } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import DataTrustNotice from "@/components/trust/DataTrustNotice";

type Reminder = { id: string; type: "Service" | "Insurance"; title: string; date: string };
type SavedItem = { id: string; type: "Trip" | "Charger"; title: string; detail: string };
type AlertKey = "recalls" | "software" | "chargers" | "network";

const STORAGE = { reminders: "plugv-owner-reminders", saved: "plugv-owner-saved", alerts: "plugv-owner-alerts" };
const defaultAlerts: Record<AlertKey, boolean> = { recalls: true, software: true, chargers: true, network: false };

function readLocal<T>(key: string, fallback: T): T {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}

export default function MyEvPage() {
  const [ready, setReady] = useState(false);
  const [battery, setBattery] = useState(50);
  const [startCharge, setStartCharge] = useState(20);
  const [targetCharge, setTargetCharge] = useState(80);
  const [tariff, setTariff] = useState(8);
  const [loss, setLoss] = useState(10);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [reminderType, setReminderType] = useState<Reminder["type"]>("Service");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [savedType, setSavedType] = useState<SavedItem["type"]>("Trip");
  const [savedTitle, setSavedTitle] = useState("");
  const [savedDetail, setSavedDetail] = useState("");

  useEffect(() => {
    setReminders(readLocal(STORAGE.reminders, []));
    setSaved(readLocal(STORAGE.saved, []));
    setAlerts(readLocal(STORAGE.alerts, defaultAlerts));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.reminders, JSON.stringify(reminders)); }, [ready, reminders]);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.saved, JSON.stringify(saved)); }, [ready, saved]);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.alerts, JSON.stringify(alerts)); }, [ready, alerts]);

  const calculation = useMemo(() => {
    const usablePercent = Math.max(0, targetCharge - startCharge) / 100;
    const batteryEnergy = battery * usablePercent;
    const gridEnergy = batteryEnergy / Math.max(0.5, 1 - loss / 100);
    return { batteryEnergy, gridEnergy, cost: gridEnergy * tariff };
  }, [battery, loss, startCharge, targetCharge, tariff]);

  function addReminder(event: FormEvent) {
    event.preventDefault();
    if (!reminderTitle.trim() || !reminderDate) return;
    setReminders((items) => [...items, { id: crypto.randomUUID(), type: reminderType, title: reminderTitle.trim(), date: reminderDate }].sort((a, b) => a.date.localeCompare(b.date)));
    setReminderTitle(""); setReminderDate("");
  }
  function addSaved(event: FormEvent) {
    event.preventDefault();
    if (!savedTitle.trim()) return;
    setSaved((items) => [{ id: crypto.randomUUID(), type: savedType, title: savedTitle.trim(), detail: savedDetail.trim() }, ...items]);
    setSavedTitle(""); setSavedDetail("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <DataTrustNotice message="Your My EV information stays in this browser in this first release. PlugV does not upload it to an account." />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_85%_60%,rgba(16,185,129,0.14),transparent_32%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200"><Car className="h-4 w-4" />PlugV Owner Hub</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">Everything you need to own your EV with confidence.</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">Plan charging costs, remember important dates, keep trusted routes close and find the right help when a journey does not go to plan.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#charging-cost" className="rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-950">Calculate charging cost</a><Link href="/travel" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold">Plan a trip</Link></div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <section id="charging-cost" className="overflow-hidden rounded-[2rem] border border-sky-300/15 bg-white/[0.045]">
          <OwnerSectionHeader icon={Calculator} eyebrow="Charging cost calculator" title="Know what the next charge may cost" copy="Adjust the battery, charge level, tariff and charging loss. The result is a planning estimate." />
          <div className="grid gap-6 border-t border-white/10 p-5 sm:p-7 lg:grid-cols-[1fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField label="Battery capacity" value={battery} onChange={setBattery} suffix="kWh" min={5} max={200} />
              <NumberField label="Electricity tariff" value={tariff} onChange={setTariff} suffix="₹/kWh" min={0} max={100} step={0.5} />
              <NumberField label="Starting charge" value={startCharge} onChange={setStartCharge} suffix="%" min={0} max={100} />
              <NumberField label="Target charge" value={targetCharge} onChange={setTargetCharge} suffix="%" min={0} max={100} />
              <NumberField label="Estimated charging loss" value={loss} onChange={setLoss} suffix="%" min={0} max={30} />
            </div>
            <div className="rounded-[1.5rem] border border-sky-300/15 bg-sky-400/[0.08] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Estimated session cost</p>
              <p className="mt-3 text-5xl font-semibold">₹{calculation.cost.toFixed(0)}</p>
              <div className="mt-6 grid grid-cols-2 gap-3"><Metric label="Into battery" value={`${calculation.batteryEnergy.toFixed(1)} kWh`} /><Metric label="From grid" value={`${calculation.gridEnergy.toFixed(1)} kWh`} /></div>
              {targetCharge <= startCharge ? <p className="mt-4 text-xs text-amber-200">Target charge must be higher than starting charge.</p> : null}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={CalendarClock} eyebrow="Reminders" title="Service and insurance dates" copy="Saved privately in this browser. Browser notifications are not enabled yet." />
            <form onSubmit={addReminder} className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              <select value={reminderType} onChange={(e) => setReminderType(e.target.value as Reminder["type"])} className="field"><option>Service</option><option>Insurance</option></select>
              <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="field" aria-label="Reminder date" />
              <input value={reminderTitle} onChange={(e) => setReminderTitle(e.target.value)} placeholder="e.g. Annual service" className="field sm:col-span-2" />
              <button className="action sm:col-span-2"><Plus className="h-4 w-4" />Add reminder</button>
            </form>
            <ItemList empty="No reminders saved yet." items={reminders.map((item) => ({ id: item.id, title: item.title, meta: `${item.type} · ${new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` }))} onDelete={(id) => setReminders((items) => items.filter((item) => item.id !== id))} />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={Bookmark} eyebrow="Saved" title="Trips and trusted chargers" copy="Keep frequently used routes and charging locations easy to find." />
            <form onSubmit={addSaved} className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              <select value={savedType} onChange={(e) => setSavedType(e.target.value as SavedItem["type"])} className="field"><option>Trip</option><option>Charger</option></select>
              <input value={savedTitle} onChange={(e) => setSavedTitle(e.target.value)} placeholder={savedType === "Trip" ? "Bengaluru to Mysuru" : "Favourite charger"} className="field" />
              <input value={savedDetail} onChange={(e) => setSavedDetail(e.target.value)} placeholder="Location, operator, connector or note" className="field sm:col-span-2" />
              <button className="action sm:col-span-2"><Plus className="h-4 w-4" />Save {savedType.toLowerCase()}</button>
            </form>
            <ItemList empty="No trips or chargers saved yet." items={saved.map((item) => ({ id: item.id, title: item.title, meta: `${item.type}${item.detail ? ` · ${item.detail}` : ""}` }))} onDelete={(id) => setSaved((items) => items.filter((item) => item.id !== id))} />
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={Bell} eyebrow="Owner alerts" title="Choose what matters to you" copy="Preferences are ready; live manufacturer and charging-network alert delivery will be added after official feeds are connected." />
            <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              {([{ key: "recalls", label: "Safety recalls", detail: "Manufacturer-issued safety campaigns" }, { key: "software", label: "Software updates", detail: "Official vehicle update notices" }, { key: "chargers", label: "New nearby chargers", detail: "Verified network additions" }, { key: "network", label: "Charging-network changes", detail: "Tariff or access updates" }] as const).map((item) => <label key={item.key} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4"><span><span className="block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span></span><input type="checkbox" checked={alerts[item.key]} onChange={() => setAlerts((value) => ({ ...value, [item.key]: !value[item.key] }))} className="h-5 w-5 accent-sky-400" /></label>)}
            </div>
          </section>

          <section className="rounded-[2rem] border border-red-300/15 bg-red-400/[0.045]">
            <OwnerSectionHeader icon={HeartPulse} eyebrow="Emergency assistance" title="Help when it matters" copy="PlugV provides verified public contact shortcuts; it does not operate emergency or roadside services." />
            <div className="space-y-3 border-t border-white/10 p-5">
              <EmergencyLink number="112" title="Pan-India emergency" detail="Police, fire, medical and rescue emergencies" href="https://112.gov.in/" />
              <EmergencyLink number="1033" title="National Highway helpline" detail="Incident and road assistance on National Highways" href="https://nhai.gov.in/" />
              <Link href="/charging" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 p-4 hover:bg-white/[0.06]"><span className="flex items-center gap-3"><MapPin className="h-5 w-5 text-sky-300" /><span><span className="block text-sm font-semibold">Find a nearby charger</span><span className="mt-1 block text-xs text-slate-500">Open PlugV charging search</span></span></span><ChevronRight className="h-4 w-4 text-slate-500" /></Link>
              <p className="pt-2 text-xs leading-5 text-slate-500">For vehicle-specific towing or battery assistance, use the roadside-assistance number in your manufacturer app, owner manual or insurance policy.</p>
            </div>
          </section>
        </div>
      </div>
      <SiteFooter />
      <style jsx global>{`.field{min-height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(2,6,23,.72);padding:0 14px;color:white;outline:none}.field:focus{border-color:rgba(125,211,252,.45)}.action{min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;background:#7dd3fc;color:#082f49;font-size:14px;font-weight:700}.action:hover{background:#bae6fd}`}</style>
    </main>
  );
}

function OwnerSectionHeader({ icon: Icon, eyebrow, title, copy }: { icon: typeof Zap; eyebrow: string; title: string; copy: string }) { return <div className="flex gap-4 p-5 sm:p-7"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300"><Icon className="h-5 w-5" /></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">{eyebrow}</p><h2 className="mt-1 text-xl font-semibold sm:text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></div></div>; }
function NumberField({ label, value, onChange, suffix, min, max, step = 1 }: { label: string; value: number; onChange: (value: number) => void; suffix: string; min: number; max: number; step?: number }) { return <label><span className="text-xs font-semibold text-slate-300">{label}</span><span className="mt-2 flex min-h-12 items-center rounded-2xl border border-white/10 bg-slate-950/60 px-4"><input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step} className="w-full bg-transparent text-base font-semibold outline-none" /><span className="text-xs text-slate-500">{suffix}</span></span></label>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p><p className="mt-2 text-lg font-semibold">{value}</p></div>; }
function ItemList({ items, empty, onDelete }: { items: { id: string; title: string; meta: string }[]; empty: string; onDelete: (id: string) => void }) { return <div className="border-t border-white/10 p-5">{items.length ? <div className="space-y-2">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3"><div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.meta}</p></div><button type="button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-red-400/10 hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div>)}</div> : <p className="py-4 text-center text-sm text-slate-500">{empty}</p>}</div>; }
function EmergencyLink({ number, title, detail, href }: { number: string; title: string; detail: string; href: string }) { return <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4"><div><p className="text-sm font-semibold">{title}</p><a href={href} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-slate-500 hover:text-slate-300">{detail} · Official source</a></div><a href={`tel:${number}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-red-300 px-4 text-sm font-bold text-red-950"><Phone className="h-4 w-4" />{number}</a></div>; }

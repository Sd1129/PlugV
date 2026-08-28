"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bell, Bookmark, Calculator, CalendarClock, Car, CheckCircle2, ChevronRight, ClipboardCheck, Gauge, HeartPulse, History, MapPin, Navigation, Phone, Plus, ShieldCheck, Trash2, WalletCards, Zap } from "lucide-react";
import SiteHeader from "@/components/home/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import DataTrustNotice from "@/components/trust/DataTrustNotice";
import { vehicles } from "@/data/vehicles";
import { getVehicleTripProfile } from "@/data/vehicle-trip-profiles";
import { createDefaultOwnerProfile, profileCompletion, readOwnerProfile, writeOwnerProfile, type DriveCondition } from "@/lib/owner-profile";

type Reminder = { id: string; type: "Service" | "Insurance" | "Warranty" | "Registration" | "PUC" | "Tyres"; title: string; date: string; notifyDays?: number; createdAt?: string; email?: boolean };
type EmailStatus = { verified: boolean; email?: string; reminders: Reminder[] };
type SavedItem = { id: string; type: "Trip" | "Charger"; title: string; detail: string; href?: string; createdAt?: string; stationId?: string; trustedByOwner?: boolean };
type AlertKey = "recalls" | "software" | "chargers" | "network";
type ChargingLog = { id: string; date: string; location: string; type: "Home" | "Public"; energyKwh: number; cost: number; distanceKm: number };
type ChecklistItem = { id: string; label: string; complete: boolean };

const STORAGE = { reminders: "plugv-owner-reminders", saved: "plugv-owner-saved", alerts: "plugv-owner-alerts", chargingLog: "plugv-owner-charging-log", checklist: "plugv-owner-checklist" };
const defaultAlerts: Record<AlertKey, boolean> = { recalls: true, software: true, chargers: true, network: false };
const defaultProfile = createDefaultOwnerProfile(vehicles[0]?.slug ?? "");
const defaultChecklist: ChecklistItem[] = ["Tyre pressure and tread", "Charging cable and adapters", "Brakes, lights and wipers", "Coolant and washer fluid", "Roadside-assistance contacts"].map((label, index) => ({ id: `check-${index}`, label, complete: false }));

function readLocal<T>(key: string, fallback: T): T {
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}

function maximumRange(value?: string) {
  const ranges = value?.match(/\d+/g)?.map(Number) ?? [];
  return ranges.length ? Math.max(...ranges) : 300;
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
  const [profile, setProfile] = useState(defaultProfile);
  const [chargingLog, setChargingLog] = useState<ChargingLog[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(defaultChecklist);
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logType, setLogType] = useState<ChargingLog["type"]>("Home");
  const [logLocation, setLogLocation] = useState("Home");
  const [logEnergy, setLogEnergy] = useState(20);
  const [logCost, setLogCost] = useState(160);
  const [logDistance, setLogDistance] = useState(120);
  const [reminderType, setReminderType] = useState<Reminder["type"]>("Service");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderNotice, setReminderNotice] = useState(7);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({ verified: false, reminders: [] });
  const [reminderEmail, setReminderEmail] = useState(""); const [emailConsent, setEmailConsent] = useState(false); const [sendByEmail, setSendByEmail] = useState(false); const [emailFeedback, setEmailFeedback] = useState(""); const [emailBusy, setEmailBusy] = useState(false);
  const [reminderFormFeedback, setReminderFormFeedback] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");
  const [savedType, setSavedType] = useState<SavedItem["type"]>("Trip");
  const [savedTitle, setSavedTitle] = useState("");
  const [savedDetail, setSavedDetail] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setReminders(readLocal(STORAGE.reminders, []));
      setSaved(readLocal(STORAGE.saved, []));
      setAlerts(readLocal(STORAGE.alerts, defaultAlerts));
      setProfile(readOwnerProfile(defaultProfile.vehicleSlug));
      setChargingLog(readLocal(STORAGE.chargingLog, []));
      setChecklist(readLocal(STORAGE.checklist, defaultChecklist));
      setNotificationPermission("Notification" in window ? Notification.permission : "unsupported");
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => { fetch("/api/reminders/email", { cache: "no-store" }).then((response) => response.json()).then((data: EmailStatus) => { setEmailStatus(data); setSendByEmail(data.verified); if (data.reminders?.length) setReminders((items) => [...items.filter((item) => !data.reminders.some((remote) => remote.id === item.id)), ...data.reminders].sort((a,b) => a.date.localeCompare(b.date))); }).catch(() => undefined); }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.reminders, JSON.stringify(reminders)); }, [ready, reminders]);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.saved, JSON.stringify(saved)); }, [ready, saved]);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.alerts, JSON.stringify(alerts)); }, [ready, alerts]);
  useEffect(() => { if (ready) writeOwnerProfile(profile); }, [ready, profile]);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.chargingLog, JSON.stringify(chargingLog)); }, [ready, chargingLog]);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE.checklist, JSON.stringify(checklist)); }, [ready, checklist]);
  useEffect(() => {
    if (!ready || notificationPermission !== "granted") return;
    const timeout = window.setTimeout(() => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      reminders.forEach((item) => {
        const due = new Date(`${item.date}T00:00:00`);
        const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
        const notice = item.notifyDays ?? 7;
        const notificationKey = `plugv-reminder-notified-${item.id}-${item.date}`;
        if (days <= notice && days >= 0 && !localStorage.getItem(notificationKey)) {
          new Notification(`PlugV ${item.type} reminder`, { body: days === 0 ? `${item.title} is due today.` : `${item.title} is due in ${days} day${days === 1 ? "" : "s"}.` });
          localStorage.setItem(notificationKey, new Date().toISOString());
        }
      });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [notificationPermission, ready, reminders]);

  const selectedVehicle = vehicles.find((vehicle) => vehicle.slug === profile.vehicleSlug) ?? vehicles[0];
  const selectedTripProfile = getVehicleTripProfile(profile.vehicleSlug);
  const selectedVariant = selectedTripProfile?.variants.find((variant) => variant.name === profile.variantName) ?? selectedTripProfile?.variants.find((variant) => variant.name === selectedTripProfile.defaultVariant) ?? selectedTripProfile?.variants[0];
  const completion = profileCompletion(profile);
  const readiness = useMemo(() => {
    const conditionFactor = profile.condition === "city" ? 0.82 : profile.condition === "highway" ? 0.74 : 0.66;
    const practicalFullRange = selectedVariant?.practicalRangeKm ?? maximumRange(selectedVehicle?.range) * conditionFactor;
    const availableRange = practicalFullRange * Math.max(0, Math.min(100, profile.batteryPercent)) / 100;
    const rangeWithReserve = availableRange * 0.85;
    const margin = rangeWithReserve - Math.max(0, profile.distance);
    const status = margin >= 25 ? "ready" : margin >= 0 ? "tight" : "charge";
    return { practicalFullRange, availableRange, rangeWithReserve, margin, status };
  }, [profile, selectedVariant, selectedVehicle]);

  const monthlyCharging = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const entries = chargingLog.filter((item) => item.date.startsWith(month));
    const cost = entries.reduce((sum, item) => sum + item.cost, 0);
    const energy = entries.reduce((sum, item) => sum + item.energyKwh, 0);
    const distance = entries.reduce((sum, item) => sum + item.distanceKm, 0);
    return { sessions: entries.length, cost, energy, efficiency: energy > 0 ? distance / energy : 0 };
  }, [chargingLog]);

  const reminderSummary = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const dated = reminders.map((item) => ({ ...item, time: new Date(`${item.date}T00:00:00`).getTime() }));
    const overdue = dated.filter((item) => item.time < today.getTime()).length;
    const next = dated.filter((item) => item.time >= today.getTime()).sort((a, b) => a.time - b.time)[0];
    return { overdue, next };
  }, [reminders]);

  const calculation = useMemo(() => {
    const usablePercent = Math.max(0, targetCharge - startCharge) / 100;
    const batteryEnergy = battery * usablePercent;
    const gridEnergy = batteryEnergy / Math.max(0.5, 1 - loss / 100);
    return { batteryEnergy, gridEnergy, cost: gridEnergy * tariff };
  }, [battery, loss, startCharge, targetCharge, tariff]);

  useEffect(() => { if (ready) setTariff(profile.electricityTariff); }, [profile.electricityTariff, ready]);
  useEffect(() => { if (selectedVariant?.batteryCapacityKWh) setBattery(selectedVariant.batteryCapacityKWh); }, [selectedVariant]);

  async function addReminder(event: FormEvent) {
    event.preventDefault();
    if (!reminderTitle.trim() || !reminderDate) { setReminderFormFeedback("Enter a reminder name and choose a due date."); return; }
    setReminderFormFeedback("");
    let reminder: Reminder = { id: crypto.randomUUID(), type: reminderType, title: reminderTitle.trim(), date: reminderDate, notifyDays: reminderNotice, createdAt: new Date().toISOString() };
    const emailEligible = reminderType === "Service" || reminderType === "Insurance";
    if (sendByEmail && emailStatus.verified && emailEligible) { setEmailBusy(true); setEmailFeedback(""); const response = await fetch("/api/reminders/email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(reminder) }); const data = await response.json(); setEmailBusy(false); if (!response.ok) { setEmailFeedback(data.error || "Could not schedule the email reminder."); return; } reminder = { ...reminder, id: data.id, email: true }; setEmailFeedback("Email reminder scheduled."); }
    else if (sendByEmail && !emailEligible) setEmailFeedback("Saved on this device. Email delivery currently supports service and insurance reminders only.");
    setReminders((items) => [...items.filter((item) => item.id !== reminder.id), reminder].sort((a,b) => a.date.localeCompare(b.date)));
    setReminderTitle(""); setReminderDate("");
  }
  async function requestEmailVerification(event: FormEvent) { event.preventDefault(); setEmailBusy(true); setEmailFeedback(""); const response = await fetch("/api/reminders/email/request-verification", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: reminderEmail, consent: emailConsent }) }); const data = await response.json(); setEmailBusy(false); setEmailFeedback(response.ok ? "Verification email sent. Open it within 30 minutes to confirm." : data.error || "Could not send the verification email."); }
  async function deleteReminder(id: string) { const item = reminders.find((reminder) => reminder.id === id); if (item?.email) await fetch(`/api/reminders/email?id=${encodeURIComponent(id)}`, { method: "DELETE" }); setReminders((items) => items.filter((reminder) => reminder.id !== id)); }

  async function enableNotifications() {
    if (!("Notification" in window)) { setNotificationPermission("unsupported"); return; }
    setNotificationPermission(await Notification.requestPermission());
  }

  function downloadReminder(item: Reminder) {
    const compactDate = item.date.replaceAll("-", "");
    const nextDay = new Date(`${item.date}T00:00:00`); nextDay.setDate(nextDay.getDate() + 1);
    const endDate = nextDay.toISOString().slice(0, 10).replaceAll("-", "");
    const safeTitle = `${item.type}: ${item.title}`.replace(/[\\,;]/g, " ");
    const calendar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PlugV//My EV Reminders//EN", "BEGIN:VEVENT", `UID:${item.id}@plugv.in`, `DTSTART;VALUE=DATE:${compactDate}`, `DTEND;VALUE=DATE:${endDate}`, `SUMMARY:${safeTitle}`, `DESCRIPTION:Saved in PlugV My EV. Confirm the appointment or renewal directly with your service centre or insurer.`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `plugv-${item.type.toLowerCase()}-${item.date}.ics`; anchor.click(); URL.revokeObjectURL(url);
  }
  function addSaved(event: FormEvent) {
    event.preventDefault();
    if (!savedTitle.trim()) return;
    setSaved((items) => [{ id: crypto.randomUUID(), type: savedType, title: savedTitle.trim(), detail: savedDetail.trim() }, ...items]);
    setSavedTitle(""); setSavedDetail("");
  }
  function addChargingLog(event: FormEvent) {
    event.preventDefault();
    setChargingLog((items) => [{ id: crypto.randomUUID(), date: logDate, location: logLocation.trim() || logType, type: logType, energyKwh: Math.max(0, logEnergy), cost: Math.max(0, logCost), distanceKm: Math.max(0, logDistance) }, ...items]);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <DataTrustNotice message="Saved trips, chargers and device reminders stay in this browser. Email reminders are stored securely only after you verify and consent." />

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_85%_60%,rgba(16,185,129,0.14),transparent_32%)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200"><Car className="h-4 w-4" />PlugV Owner Hub</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">Everything you need to own your EV with confidence.</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">Plan charging costs, remember important dates, keep trusted routes close and find the right help when a journey does not go to plan.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#charging-cost" className="rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-slate-950">Calculate charging cost</a><Link href="/travel" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold">Plan a trip</Link></div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-sky-300/15 bg-white/[0.045]">
          <OwnerSectionHeader icon={Car} eyebrow="Personal EV profile" title="Set it once. Personalize every PlugV decision." copy="Your vehicle, variant, driving and charging context improve range, cost and trip estimates across PlugV." />
          <div className="grid gap-6 border-t border-white/10 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="text-xs font-semibold text-slate-300">City</span><input value={profile.city} onChange={(event) => setProfile((value) => ({ ...value, city: event.target.value }))} placeholder="e.g. Hyderabad" className="field mt-2 w-full" /></label>
              <label><span className="text-xs font-semibold text-slate-300">Your EV</span><select value={profile.vehicleSlug} onChange={(event) => { const vehicleSlug = event.target.value; setProfile((value) => ({ ...value, vehicleSlug, variantName: getVehicleTripProfile(vehicleSlug)?.defaultVariant ?? "" })); }} className="field mt-2 w-full">{vehicles.map((vehicle) => <option key={vehicle.slug} value={vehicle.slug}>{vehicle.brand} {vehicle.name}</option>)}</select></label>
              <label><span className="text-xs font-semibold text-slate-300">Variant</span><select value={profile.variantName} onChange={(event) => setProfile((value) => ({ ...value, variantName: event.target.value }))} className="field mt-2 w-full" disabled={!selectedTripProfile?.variants.length}><option value="">{selectedTripProfile?.variants.length ? "Select variant" : "Variant data unavailable"}</option>{selectedTripProfile?.variants.map((variant) => <option key={variant.name}>{variant.name}</option>)}</select></label>
              <NumberField label="Daily distance" value={profile.dailyDistanceKm} onChange={(dailyDistanceKm) => setProfile((value) => ({ ...value, dailyDistanceKm }))} suffix="km" min={1} max={1000} />
              <label><span className="text-xs font-semibold text-slate-300">Home charging</span><select value={profile.homeCharging} onChange={(event) => setProfile((value) => ({ ...value, homeCharging: event.target.value as typeof value.homeCharging }))} className="field mt-2 w-full"><option value="unknown">Not decided</option><option value="dedicated">Dedicated home charger</option><option value="shared">Shared parking charger</option><option value="workplace">Workplace charging</option><option value="public-only">Public charging only</option></select></label>
              <NumberField label="Electricity tariff" value={profile.electricityTariff} onChange={(electricityTariff) => setProfile((value) => ({ ...value, electricityTariff }))} suffix="₹/kWh" min={0} max={100} step={0.5} />
              <label><span className="text-xs font-semibold text-slate-300">Highway travel</span><select value={profile.highwayFrequency} onChange={(event) => setProfile((value) => ({ ...value, highwayFrequency: event.target.value as typeof value.highwayFrequency }))} className="field mt-2 w-full"><option value="rarely">Rarely</option><option value="monthly">Monthly</option><option value="weekly">Weekly</option></select></label>
              <NumberField label="Family size" value={profile.familySize} onChange={(familySize) => setProfile((value) => ({ ...value, familySize }))} suffix="people" min={1} max={12} />
              <NumberField label="Budget / vehicle value" value={profile.budgetLakhs} onChange={(budgetLakhs) => setProfile((value) => ({ ...value, budgetLakhs }))} suffix="₹ lakh" min={1} max={500} step={0.5} />
            </div>
            <div className="rounded-[1.5rem] border border-sky-300/15 bg-sky-400/[0.07] p-6">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Profile readiness</p><span className="text-lg font-semibold">{completion}%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-950/70"><div className="h-full rounded-full bg-sky-300" style={{ width: `${completion}%` }} /></div>
              <div className="mt-6 space-y-3 text-sm leading-6 text-slate-300">
                <p>{selectedVariant ? `${selectedVariant.name}: ${selectedVariant.practicalRangeKm} km planning range and ${selectedVariant.batteryCapacityKWh} kWh battery.` : "Select a supported variant for variant-specific range and battery estimates."}</p>
                {profile.homeCharging === "public-only" ? <p className="rounded-xl border border-amber-300/15 bg-amber-400/[0.07] p-3 text-amber-100">Public-charging dependent: save at least two compatible, recently verified chargers near home.</p> : null}
                <p>Profile data is stored only in this browser. Cross-device sync requires a future secure PlugV account and is not active yet.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-white/[0.045]">
          <OwnerSectionHeader icon={Gauge} eyebrow="Today’s EV check" title="Can your EV comfortably complete today’s drive?" copy="Enter your current battery and expected driving. PlugV keeps a 15% reserve and adjusts claimed range for everyday conditions." />
          <div className="grid gap-6 border-t border-white/10 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="text-xs font-semibold text-slate-300">Your EV</span><select value={profile.vehicleSlug} onChange={(e) => { const vehicleSlug = e.target.value; setProfile((value) => ({ ...value, vehicleSlug, variantName: getVehicleTripProfile(vehicleSlug)?.defaultVariant ?? "" })); }} className="field mt-2 w-full">{vehicles.map((vehicle) => <option key={vehicle.slug} value={vehicle.slug}>{vehicle.brand} {vehicle.name} · {vehicle.range ?? "Range unavailable"}</option>)}</select></label>
              <NumberField label="Battery now" value={profile.batteryPercent} onChange={(batteryPercent) => setProfile((value) => ({ ...value, batteryPercent }))} suffix="%" min={0} max={100} />
              <NumberField label="Today's driving" value={profile.distance} onChange={(distance) => setProfile((value) => ({ ...value, distance }))} suffix="km" min={0} max={2000} />
              <label className="sm:col-span-2"><span className="text-xs font-semibold text-slate-300">Driving conditions</span><select value={profile.condition} onChange={(e) => setProfile((value) => ({ ...value, condition: e.target.value as DriveCondition }))} className="field mt-2 w-full"><option value="city">Mixed city driving</option><option value="highway">Highway driving</option><option value="difficult">Heavy AC, rain, hills or congestion</option></select></label>
              <p className="sm:col-span-2 text-xs leading-5 text-slate-500">{selectedVariant ? `Uses PlugV's ${selectedVariant.name} practical planning range.` : "Uses the vehicle’s published maximum range with a condition adjustment."} Actual range changes with speed, weather, terrain, load, battery health and driving style.</p>
            </div>
            <div className={`rounded-[1.5rem] border p-6 ${readiness.status === "ready" ? "border-emerald-300/20 bg-emerald-400/[0.08]" : readiness.status === "tight" ? "border-amber-300/20 bg-amber-400/[0.08]" : "border-red-300/20 bg-red-400/[0.08]"}`}>
              <div className="flex items-start gap-3">{readiness.status === "ready" ? <CheckCircle2 className="mt-1 h-6 w-6 text-emerald-300" /> : <AlertTriangle className={`mt-1 h-6 w-6 ${readiness.status === "tight" ? "text-amber-300" : "text-red-300"}`} />}<div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Drive readiness</p><h3 className="mt-2 text-2xl font-semibold">{readiness.status === "ready" ? "Ready for today's drive" : readiness.status === "tight" ? "Possible, but the reserve is tight" : "Charge or plan a stop first"}</h3></div></div>
              <div className="mt-6 grid grid-cols-2 gap-3"><Metric label="Estimated available" value={`${Math.round(readiness.availableRange)} km`} /><Metric label="After 15% reserve" value={`${Math.round(readiness.rangeWithReserve)} km`} /></div>
              <p className="mt-4 text-sm text-slate-300">{readiness.margin >= 0 ? `About ${Math.round(readiness.margin)} km remains beyond your planned drive and safety reserve.` : `Your planned drive exceeds the reserve-adjusted estimate by about ${Math.abs(Math.round(readiness.margin))} km.`}</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2"><Link href="/travel" className="action"><Navigation className="h-4 w-4" />Plan this journey</Link><Link href="/charging" className="flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-white/15 bg-white/5 text-sm font-semibold hover:bg-white/10"><MapPin className="h-4 w-4" />Find chargers</Link></div>
            </div>
          </div>
        </section>

        <section aria-label="Owner overview" className="grid gap-3 sm:grid-cols-3">
          <OwnerSnapshot icon={CalendarClock} label="Reminders" value={reminderSummary.overdue ? `${reminderSummary.overdue} overdue` : reminderSummary.next ? `Next: ${new Date(`${reminderSummary.next.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "None added"} href="#owner-reminders" />
          <OwnerSnapshot icon={Bookmark} label="Saved trips & chargers" value={`${saved.length} saved`} href="#owner-saved" />
          <OwnerSnapshot icon={ShieldCheck} label="Need help?" value="Safety steps & helplines" href="#emergency-help" />
        </section>

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
          <section id="owner-reminders" className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={CalendarClock} eyebrow="Reminders" title="Service & insurance reminders" copy="Use a device reminder without signing in, or verify your email to receive one private reminder on your chosen schedule." />
            <div className="border-t border-white/10 p-5">{emailStatus.verified ? <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/[0.07] p-4"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-200"><CheckCircle2 className="h-4 w-4" />Email verified</div><p className="mt-2 text-xs leading-5 text-slate-400">New reminders can be emailed to {emailStatus.email}. Emails are used only for reminders, never marketing. Every email includes an unsubscribe link.</p></div> : <form onSubmit={requestEmailVerification} className="rounded-2xl border border-sky-300/15 bg-sky-400/[0.06] p-4"><p className="text-sm font-semibold">Activate email reminders</p><p className="mt-1 text-xs leading-5 text-slate-400">Verify your address once. No phone number is required.</p><input type="email" required autoComplete="email" value={reminderEmail} onChange={(event) => setReminderEmail(event.target.value)} placeholder="you@example.com" className="field mt-3 w-full" /><label className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-300"><input type="checkbox" required checked={emailConsent} onChange={(event) => setEmailConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-sky-400" /><span>I agree that PlugV may store this email and my reminder details only to send requested reminders. I can unsubscribe at any time. See the <Link href="/privacy" className="text-sky-300 underline">Privacy Policy</Link>.</span></label><button disabled={emailBusy} className="action mt-4 w-full disabled:opacity-50">{emailBusy ? "Sending…" : "Send verification email"}</button></form>}{emailFeedback ? <p className="mt-3 text-xs text-sky-200" role="status">{emailFeedback}</p> : null}</div>
            <form onSubmit={addReminder} className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              <select value={reminderType} onChange={(e) => setReminderType(e.target.value as Reminder["type"])} className="field"><option>Service</option><option>Insurance</option><option>Warranty</option><option>Registration</option><option>PUC</option><option>Tyres</option></select>
              <input type="date" required value={reminderDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setReminderDate(e.target.value)} className="field" aria-label="Reminder date" />
              <input required maxLength={100} value={reminderTitle} onChange={(e) => setReminderTitle(e.target.value)} placeholder="e.g. Annual service" className="field sm:col-span-2" aria-label="Reminder name" />
              <label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-slate-300">Remind me before</span><select value={reminderNotice} onChange={(e) => setReminderNotice(Number(e.target.value))} className="field w-full"><option value={0}>On the due date</option><option value={1}>1 day before</option><option value={3}>3 days before</option><option value={7}>7 days before</option><option value={14}>14 days before</option><option value={30}>30 days before</option></select></label>
              {emailStatus.verified ? <label className="flex items-center gap-2 text-xs text-slate-300 sm:col-span-2"><input type="checkbox" checked={sendByEmail} onChange={(event) => setSendByEmail(event.target.checked)} className="h-4 w-4 accent-sky-400" />Send this reminder by email</label> : null}{reminderFormFeedback ? <p className="text-xs text-amber-200 sm:col-span-2" role="alert">{reminderFormFeedback}</p> : null}<button type="submit" disabled={emailBusy} className="action sm:col-span-2 disabled:cursor-wait disabled:opacity-50"><Plus className="h-4 w-4" />{emailBusy ? "Saving…" : "Add reminder"}</button>
            </form>
            <div className="border-t border-white/10 px-5 py-4"><div className="flex flex-col gap-3 rounded-2xl border border-sky-300/15 bg-sky-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold">Browser reminders</p><p className="mt-1 text-xs leading-5 text-slate-400">Alerts appear on this device when you open PlugV near a due date. They are not background SMS, email or push reminders.</p></div>{notificationPermission === "granted" ? <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-emerald-200"><CheckCircle2 className="h-4 w-4" />Enabled</span> : <button type="button" onClick={enableNotifications} disabled={notificationPermission === "denied" || notificationPermission === "unsupported"} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-sky-300/20 px-4 text-xs font-semibold text-sky-100 disabled:cursor-not-allowed disabled:opacity-50"><Bell className="h-4 w-4" />{notificationPermission === "denied" ? "Blocked in browser" : notificationPermission === "unsupported" ? "Not supported" : "Enable alerts"}</button>}</div></div>
            <ReminderList reminders={reminders} onCalendar={downloadReminder} onDelete={deleteReminder} />
          </section>

          <section id="owner-saved" className="scroll-mt-24 rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={Bookmark} eyebrow="Saved" title="Saved trips & chargers" copy="Recheck familiar journeys before departure and keep charging locations you personally trust easy to find." />
            <form onSubmit={addSaved} className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              <select value={savedType} onChange={(e) => setSavedType(e.target.value as SavedItem["type"])} className="field"><option>Trip</option><option>Charger</option></select>
              <input value={savedTitle} onChange={(e) => setSavedTitle(e.target.value)} placeholder={savedType === "Trip" ? "Bengaluru to Mysuru" : "Favourite charger"} className="field" />
              <input value={savedDetail} onChange={(e) => setSavedDetail(e.target.value)} placeholder="Location, operator, connector or note" className="field sm:col-span-2" />
              <button className="action sm:col-span-2"><Plus className="h-4 w-4" />Save {savedType.toLowerCase()}</button>
            </form>
            <ItemList empty="No trips or chargers saved yet." items={saved.map((item) => ({ id: item.id, title: item.title, meta: `${item.trustedByOwner ? "My trusted charger" : item.type}${item.detail ? ` · ${item.detail}` : ""}`, href: item.href, actionLabel: item.type === "Trip" ? "Recheck trip" : item.href ? "Directions" : undefined, external: item.type === "Charger" }))} onDelete={(id) => setSaved((items) => items.filter((item) => item.id !== id))} />
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={WalletCards} eyebrow="Charging log" title="Track energy, spend and efficiency" copy="Record home and public charging sessions to understand your real monthly ownership cost." />
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-5 sm:grid-cols-4"><Metric label="This month" value={`₹${monthlyCharging.cost.toFixed(0)}`} /><Metric label="Energy" value={`${monthlyCharging.energy.toFixed(1)} kWh`} /><Metric label="Sessions" value={`${monthlyCharging.sessions}`} /><Metric label="Efficiency" value={monthlyCharging.efficiency ? `${monthlyCharging.efficiency.toFixed(1)} km/kWh` : "—"} /></div>
            <form onSubmit={addChargingLog} className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              <input type="date" value={logDate} onChange={(event) => setLogDate(event.target.value)} className="field" aria-label="Charging date" />
              <select value={logType} onChange={(event) => { const type = event.target.value as ChargingLog["type"]; setLogType(type); if (!logLocation || logLocation === "Home" || logLocation === "Public charger") setLogLocation(type === "Home" ? "Home" : "Public charger"); }} className="field"><option>Home</option><option>Public</option></select>
              <input value={logLocation} onChange={(event) => setLogLocation(event.target.value)} placeholder="Location or operator" className="field sm:col-span-2" />
              <NumberField label="Energy added" value={logEnergy} onChange={setLogEnergy} suffix="kWh" min={0} max={500} step={0.1} />
              <NumberField label="Session cost" value={logCost} onChange={setLogCost} suffix="₹" min={0} max={100000} step={1} />
              <div className="sm:col-span-2"><NumberField label="Distance driven since previous charge" value={logDistance} onChange={setLogDistance} suffix="km" min={0} max={3000} step={1} /></div>
              <button className="action sm:col-span-2"><Plus className="h-4 w-4" />Add charging session</button>
            </form>
            <ItemList empty="No charging sessions recorded yet." items={chargingLog.slice(0, 8).map((item) => ({ id: item.id, title: `${item.type} · ${item.location}`, meta: `${new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN")} · ${item.energyKwh} kWh · ₹${item.cost}${item.energyKwh > 0 && item.distanceKm > 0 ? ` · ${(item.distanceKm / item.energyKwh).toFixed(1)} km/kWh` : ""}` }))} onDelete={(id) => setChargingLog((items) => items.filter((item) => item.id !== id))} />
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={ClipboardCheck} eyebrow="Ownership checklist" title="A calmer monthly EV check" copy="A simple device-based checklist for routine items that are easy to forget." />
            <div className="space-y-2 border-t border-white/10 p-5">{checklist.map((item) => <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4"><input type="checkbox" checked={item.complete} onChange={() => setChecklist((items) => items.map((entry) => entry.id === item.id ? { ...entry, complete: !entry.complete } : entry))} className="h-5 w-5 accent-emerald-400" /><span className={`text-sm ${item.complete ? "text-slate-500 line-through" : "text-slate-200"}`}>{item.label}</span></label>)}</div>
            <div className="border-t border-white/10 p-5"><button type="button" onClick={() => setChecklist(defaultChecklist)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold text-slate-300 hover:bg-white/5"><History className="h-4 w-4" />Reset monthly checklist</button></div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04]">
            <OwnerSectionHeader icon={Bell} eyebrow="Owner alerts" title="Choose what matters to you" copy="Preferences are ready; live manufacturer and charging-network alert delivery will be added after official feeds are connected." />
            <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
              {([{ key: "recalls", label: "Safety recalls", detail: "Manufacturer-issued safety campaigns" }, { key: "software", label: "Software updates", detail: "Official vehicle update notices" }, { key: "chargers", label: "New nearby chargers", detail: "Verified network additions" }, { key: "network", label: "Charging-network changes", detail: "Tariff or access updates" }] as const).map((item) => <label key={item.key} className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4"><span><span className="block text-sm font-semibold">{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span></span><input type="checkbox" checked={alerts[item.key]} onChange={() => setAlerts((value) => ({ ...value, [item.key]: !value[item.key] }))} className="h-5 w-5 accent-sky-400" /></label>)}
            </div>
          </section>

          <section id="emergency-help" className="scroll-mt-24 rounded-[2rem] border border-red-300/15 bg-red-400/[0.045]">
            <OwnerSectionHeader icon={HeartPulse} eyebrow="Emergency assistance" title="Help when it matters" copy="PlugV provides verified public contact shortcuts; it does not operate emergency or roadside services." />
            <div className="space-y-3 border-t border-white/10 p-5">
              <EmergencyLink number="112" title="Pan-India emergency" detail="Police, fire, medical and rescue emergencies" href="https://112.gov.in/" />
              <EmergencyLink number="1033" title="National Highway helpline" detail="Incident and road assistance on National Highways" href="https://nhai.gov.in/" />
              <Link href="/charging" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/55 p-4 hover:bg-white/[0.06]"><span className="flex items-center gap-3"><MapPin className="h-5 w-5 text-sky-300" /><span><span className="block text-sm font-semibold">Find a nearby charger</span><span className="mt-1 block text-xs text-slate-500">Open PlugV charging search</span></span></span><ChevronRight className="h-4 w-4 text-slate-500" /></Link>
              <div className="rounded-2xl border border-red-300/10 bg-slate-950/40 p-4"><p className="text-sm font-semibold">If the vehicle stops or shows smoke or unusual heat</p><ol className="mt-3 space-y-2 text-xs leading-5 text-slate-400"><li>1. Move away from traffic if it is safe, stop and switch on hazard lights.</li><li>2. Leave the vehicle and keep everyone at a safe distance if you notice smoke, heat, sparks or a strong chemical smell.</li><li>3. Do not touch orange high-voltage cables or attempt battery repairs.</li><li>4. Share your live location and call 112 for immediate danger; use manufacturer or insurer roadside assistance for a breakdown.</li></ol></div>
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
function OwnerSnapshot({ icon: Icon, label, value, href }: { icon: typeof Zap; label: string; value: string; href: string }) { return <a href={href} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:border-sky-300/20 hover:bg-white/[0.065]"><span className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300"><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-xs text-slate-500">{label}</span><span className="mt-1 block truncate text-sm font-semibold">{value}</span></span></span><ChevronRight className="h-4 w-4 shrink-0 text-slate-600" /></a>; }
function ReminderList({ reminders, onCalendar, onDelete }: { reminders: Reminder[]; onCalendar: (item: Reminder) => void; onDelete: (id: string) => void }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return <div className="border-t border-white/10 p-5">{reminders.length ? <div className="space-y-2">{reminders.map((item) => {
    const days = Math.ceil((new Date(`${item.date}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
    const status = days < 0 ? { label: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`, style: "border-red-300/20 bg-red-400/10 text-red-200" } : days === 0 ? { label: "Due today", style: "border-amber-300/20 bg-amber-400/10 text-amber-100" } : { label: `Due in ${days} day${days === 1 ? "" : "s"}`, style: days <= (item.notifyDays ?? 7) ? "border-amber-300/20 bg-amber-400/10 text-amber-100" : "border-emerald-300/15 bg-emerald-400/[0.07] text-emerald-200" };
    return <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold">{item.title}</p><span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.style}`}>{status.label}</span></div><p className="mt-2 text-xs text-slate-500">{item.type} · {new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · Alert {item.notifyDays ?? 7} day{(item.notifyDays ?? 7) === 1 ? "" : "s"} before</p></div><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={() => onCalendar(item)} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 text-xs font-semibold text-sky-100 hover:bg-sky-400/20"><CalendarClock className="h-3.5 w-3.5" />Add to calendar</button><button type="button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-red-400/10 hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div></div></div>;
  })}</div> : <p className="py-4 text-center text-sm text-slate-500">No reminders saved yet.</p>}</div>;
}
function ItemList({ items, empty, onDelete }: { items: { id: string; title: string; meta: string; href?: string; actionLabel?: string; external?: boolean }[]; empty: string; onDelete: (id: string) => void }) { return <div className="border-t border-white/10 p-5">{items.length ? <div className="space-y-2">{items.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.meta}</p></div><div className="flex shrink-0 items-center gap-2">{item.href ? item.external ? <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 text-xs font-semibold text-sky-100 hover:bg-sky-400/20">{item.actionLabel}<ChevronRight className="h-3.5 w-3.5" /></a> : <Link href={item.href} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-sky-300/20 bg-sky-400/10 px-3 text-xs font-semibold text-sky-100 hover:bg-sky-400/20">{item.actionLabel}<ChevronRight className="h-3.5 w-3.5" /></Link> : null}<button type="button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-red-400/10 hover:text-red-200"><Trash2 className="h-4 w-4" /></button></div></div>)}</div> : <p className="py-4 text-center text-sm text-slate-500">{empty}</p>}</div>; }
function EmergencyLink({ number, title, detail, href }: { number: string; title: string; detail: string; href: string }) { return <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-4"><div><p className="text-sm font-semibold">{title}</p><a href={href} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-slate-500 hover:text-slate-300">{detail} · Official source</a></div><a href={`tel:${number}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-red-300 px-4 text-sm font-bold text-red-950"><Phone className="h-4 w-4" />{number}</a></div>; }

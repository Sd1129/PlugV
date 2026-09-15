"use client";
import { useState } from "react";
import { reportOutcomes, reportConnectors } from "@/lib/charging/stationReports";
export default function ReportForm({ stationId, enabled }: { stationId: string; enabled: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(form: HTMLFormElement) {
    const fields = Object.fromEntries(new FormData(form));
    const visit = new Date(String(fields.visitedAt));
    if (!Number.isFinite(visit.getTime())) { setMessage("Enter a valid visit time."); return; }
    setBusy(true); setMessage("");
    try {
      const r = await fetch("/api/station-reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, stationId, visitedAt: visit.toISOString(), consent: fields.consent === "on" }) });
      setMessage((await r.json()).message);
      if (r.ok) form.reset();
    } catch { setMessage("Unable to submit. Please try later."); } finally { setBusy(false); }
  }
  return <section className="mt-8 space-y-4"><h2 className="text-2xl font-semibold">Report your visit</h2><p>Use your own visit from the last 30 days. Do not copy other apps or include names, phone numbers, registration plates, private links or precise personal travel details. A report is an observation, not live availability.</p>{!enabled && <p className="rounded border border-amber-300/40 p-4 text-amber-100">Collection is not open yet. Use <a href="mailto:support@plugv.in" className="underline">support@plugv.in</a> for corrections.</p>}<form onSubmit={e => { e.preventDefault(); void submit(e.currentTarget); }}><fieldset disabled={!enabled || busy} className="grid gap-4"><label>Outcome<select required name="outcome" className="mt-1 block w-full rounded bg-slate-800 p-3">{reportOutcomes.map(v=><option key={v}>{v}</option>)}</select></label><label>Connector used or affected<select required name="connector" className="mt-1 block w-full rounded bg-slate-800 p-3">{reportConnectors.map(v=><option key={v}>{v}</option>)}</select></label><label>Visit date and time (your device’s local time)<input required type="datetime-local" name="visitedAt" className="mt-1 block w-full rounded bg-slate-800 p-3"/></label><label>What happened? Include the correction if details are wrong (private)<textarea name="notes" required minLength={20} maxLength={1000} rows={4} className="mt-1 block w-full rounded bg-slate-800 p-3"/></label><label><input type="checkbox" name="consent" required/> I am 18 or older. This is my own observation, and I consent to private review and publication of its outcome, connector and visit time. I have read the <a className="underline" href="/privacy#station-reports">privacy details</a> and <a className="underline" href="/terms">terms</a>.</label><button className="rounded bg-cyan-300 px-4 py-3 font-semibold text-slate-950">{busy ? "Submitting…" : "Submit station report"}</button></fieldset></form><p role="status">{message}</p><button disabled={busy} className="rounded border border-slate-500 p-3" onClick={async()=>{if(!window.confirm("Delete all station reports submitted from this browser?"))return;setBusy(true);try { const r=await fetch("/api/station-reports",{method:"DELETE",headers:{"Content-Type":"application/json"},body:"{}"});setMessage((await r.json()).message);if(r.ok)window.location.reload(); }catch{setMessage("Withdrawal failed. Please retry.");}finally{setBusy(false);}}}>Withdraw all station reports from this browser</button></section>;
}

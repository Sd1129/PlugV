import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How PlugV handles information when you use its EV discovery, charging, travel and ownership tools.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <LegalPage eyebrow="Your privacy" title="Privacy Policy" summary="This policy explains what information PlugV may process, why it is used, and the choices available to you when using plugv.in.">
    <p><strong>Effective date:</strong> 26 August 2026 · <strong>Last updated:</strong> 26 August 2026</p>
    <h2>1. Who this policy applies to</h2><p>This policy applies to visitors and users of PlugV.in. PlugV is an India-focused electric-vehicle information and planning platform operated under the PlugV name.</p>
    <h2>2. Information you provide</h2><p>You may provide information when contacting PlugV, reporting incorrect data, saving owner reminders, using search or entering trip details. Do not submit sensitive personal, financial or medical information through free-text fields.</p>
    <h2>3. Owner tools and email reminders</h2><p>Saved trips, saved chargers, alert preferences and device-only reminders are stored in your browser using local storage. Clearing browser data may permanently remove them. If you separately activate email reminders, PlugV stores your verified email address, consent record, reminder type, title, due date and notice period on its server so the requested email can be delivered. This information is not used for marketing.</p>
    <h2>4. Email reminder choices</h2><p>Email ownership is confirmed through a time-limited verification link. Reminder emails include an unsubscribe link. Deleting an email reminder removes that reminder from active delivery. Unsubscribing disables all active email reminders. You may request access or deletion by contacting support@plugv.in.</p>
    <h2>5. Email service providers</h2><p>PlugV uses hosting, database and email-delivery providers, currently including Vercel, Neon and Zoho Mail, only as necessary to operate this feature. Access credentials are kept outside the public website code.</p>
    <h2>4. Location information</h2><p>PlugV requests device location only when you choose a feature such as “Use my location.” Your browser controls permission. Location is used to calculate nearby charging results or routes and may be sent to mapping, geocoding or routing providers needed to return that result.</p>
    <h2>5. Technical and usage information</h2><p>Hosting and security providers may process standard technical logs such as IP address, browser type, requested URL, timestamps, device information and error diagnostics. PlugV may use privacy-conscious analytics to understand reliability and improve features. We do not sell personal information.</p>
    <h2>6. External service providers</h2><p>PlugV relies on infrastructure and mapping services such as Vercel, map providers, OpenStreetMap-based geocoding or routing services, and email providers. Their processing is governed by their own policies. Only the information reasonably required to provide the requested feature should be sent.</p>
    <h2>7. Cookies</h2><p>PlugV may use essential cookies or similar storage for security, preferences and core functionality. If non-essential analytics or advertising cookies are introduced, PlugV will provide appropriate notice and choices where required.</p>
    <h2>8. Retention and security</h2><p>Information is retained only as reasonably needed for the relevant purpose, legal obligations, security or dispute resolution. PlugV uses reasonable safeguards, but no online service can promise absolute security.</p>
    <h2>9. Your choices and rights</h2><p>You can deny location permission, clear local browser storage, stop using the service, or ask about personal information associated with a message you sent. Depending on applicable Indian law, additional access, correction or deletion rights may apply.</p>
    <h2>10. Children</h2><p>PlugV is not designed to collect personal information from children. A parent or guardian should supervise use by anyone who cannot legally consent to data processing.</p>
    <h2>11. Updates and contact</h2><p>We may update this policy as PlugV develops. Material changes will be reflected by a new date on this page. Privacy questions may be sent to <a href="mailto:support@plugv.in?subject=Privacy%20request">support@plugv.in</a>.</p>
  </LegalPage>;
}

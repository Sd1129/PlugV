import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "EV Information Disclaimer", description: "Important limitations for PlugV vehicle, charging, route, cost and EV Assistant information.", alternates: { canonical: "/disclaimer" } };

export default function DisclaimerPage() {
  return <LegalPage eyebrow="Important information" title="Disclaimer" summary="PlugV is designed to reduce EV confusion, but important vehicle, charging and travel decisions must still be confirmed with the responsible manufacturer or operator.">
    <p><strong>Effective date:</strong> 21 August 2026 · <strong>Last updated:</strong> 28 August 2026</p>
    <h2>Vehicle information</h2><p>Ex-showroom prices, variants, battery sizes, range, charging speeds, safety features and launch dates can change without notice. Claimed or certified range is not guaranteed real-world range. Manufacturer sources should be treated as authoritative for the final purchase decision.</p>
    <h2>Charging-directory information</h2><p>A station appearing in PlugV does not guarantee that it is operational, publicly accessible, compatible, available or free. Government and operator directory records may become outdated. “Live status unavailable” means PlugV has no current operator feed. Always confirm in the operator’s official app or support channel.</p>
    <h2>Travel and range planning</h2><p>Routes, distances, durations, charging stops, arrival charge and energy costs are planning estimates. Traffic, road closures, weather, elevation, speed, payload, battery condition and charger reliability can materially affect a journey. Maintain a safe reserve and identify alternatives before departure.</p>
    <h2>EV Assistant and rankings</h2><p>PlugV recommendations are generated from the available dataset and stated preferences. They are not personalised financial advice, paid rankings or a substitute for test drives, inspection, insurance advice or independent research.</p>
    <h2>Costs and ownership tools</h2><p>Charging costs, running costs and ownership calculations are estimates and not invoices, dealer quotations, insurance offers or tax advice. Actual tariffs, losses, finance, maintenance and resale value vary.</p>
    <h2>Emergency use</h2><p>PlugV is not an emergency service. If there is danger, a collision, fire, medical emergency or unsafe roadside situation, contact the appropriate emergency services and your vehicle or roadside-assistance provider immediately.</p>
    <h2>No endorsement</h2><p>References to manufacturers, charging networks, government datasets or third-party services do not imply endorsement, partnership or sponsorship unless expressly stated.</p>
    <h2>Corrections</h2><p>To report incorrect information, email <a href="mailto:support@plugv.in?subject=PlugV%20data%20correction">support@plugv.in</a> with the page URL, the issue and an official source where possible.</p>
    <h2>Operator contact</h2><p>PlugV is operated by Syed Manjoor Ahmed, trading under the name PlugV, from Hyderabad, Telangana, India. Contact <a href="mailto:support@plugv.in?subject=PlugV%20legal%20query">support@plugv.in</a> for legal or operational questions.</p>
  </LegalPage>;
}

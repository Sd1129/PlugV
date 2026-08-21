import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms governing access to and use of PlugV.in and its EV information and planning tools.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <LegalPage eyebrow="Using PlugV" title="Terms of Use" summary="These terms govern access to PlugV.in. By using the platform, you agree to use it responsibly and to verify important decisions with the relevant manufacturer, operator or professional.">
    <h2>1. Informational service</h2><p>PlugV provides EV discovery, comparison, charging-directory, travel-planning, ownership and recommendation tools. Content is provided for general information and planning, not as a quotation, guarantee, professional advice or promise of availability.</p>
    <h2>2. Eligibility and acceptance</h2><p>You must be legally capable of accepting these terms under applicable law. If you use PlugV for an organisation, you confirm that you are authorised to act for it.</p>
    <h2>3. Your responsibilities</h2><p>You agree not to misuse the platform, interfere with its operation, attempt unauthorised access, submit unlawful or harmful content, scrape at a scale that harms the service, or present PlugV data as guaranteed or live when it is labelled otherwise.</p>
    <h2>4. Vehicle and charging information</h2><p>Prices, specifications, certified range, launch timing and charging details can change. Confirm purchase information with the manufacturer or authorised dealer. Confirm connector compatibility, operating status, access conditions and price with the charging operator before travelling.</p>
    <h2>5. Routes, costs and recommendations</h2><p>Trip duration, energy use, charging stops, range, costs, scores and assistant recommendations are estimates based on available inputs. Weather, traffic, driving style, elevation, load, battery health and service availability can materially change results.</p>
    <h2>6. Intellectual property</h2><p>PlugV’s name, logo, design, original text, software and organisation of data are protected by applicable intellectual-property laws. Third-party names, marks and source materials remain the property of their respective owners. No affiliation or endorsement is implied unless stated.</p>
    <h2>7. External links and services</h2><p>Links to manufacturers, operators, maps and other third parties are provided for convenience. PlugV does not control their content, availability, security, terms or privacy practices.</p>
    <h2>8. Availability and changes</h2><p>PlugV may modify, suspend or discontinue features, correct errors, change data sources or introduce reasonable limits. Continuous or error-free availability is not guaranteed.</p>
    <h2>9. Disclaimer and liability</h2><p>To the extent permitted by law, PlugV is provided on an “as available” basis without implied guarantees. PlugV will not be liable for indirect or consequential loss arising from reliance on planning information, third-party data or unavailable external services. Nothing in these terms excludes liability that cannot legally be excluded.</p>
    <h2>10. Governing law</h2><p>These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of a competent court in India, subject to mandatory consumer-protection rights.</p>
    <h2>11. Contact</h2><p>Questions about these terms may be sent to <a href="mailto:support@plugv.in?subject=Terms%20of%20Use">support@plugv.in</a>.</p>
  </LegalPage>;
}

# EV assistant audit — 13 September 2026

The assistant is a local, deterministic catalogue helper, not a general-purpose language model. Passing its regression suite does not certify the underlying catalogue facts.

## Corrected findings

- Unknown and unrelated questions previously fell through to arbitrary car recommendations. Unsupported requests now ask for clarification.
- Model lookups now return the named vehicle, source links and scoped verification limits. Exact word boundaries prevent Seal/Sealion collisions; common shorthand and selected spelling mistakes are handled.
- “Launched” no longer selects Upcoming. Upcoming cards link to upcoming pages.
- Budgets accept lakh, crore and rupee amounts with commas. Brand filters and explicit exclusions are enforced. Unsupported minimum budgets, price intervals and features are acknowledged.
- Trip estimates require an explicit distance, starting charge and unambiguous recorded battery variant. Invalid percentages are rejected instead of clamped. Insufficient energy is stated rather than displaying an apparently achievable zero-percent arrival.
- Practical range remains an estimate even when the profile has a manufacturer source. Station searches, live status and reservations are not implied to have occurred.
- An immediate follow-up can reference one explicitly named model from the previous question; ambiguous references ask for the name. Old amounts are never silently reused.
- Removed the unexplained numerical fit badge. Catalogue candidates are not verified quotes or proof that the cheapest variant supplies maximum range.

## Verification

Run `npm run audit:assistant` for 48 regression checks. The weekly workflow and release audit run this suite. It covers routing, budgets, names, typos, exclusions, unknown input, follow-ups, source links, trip arithmetic and invalid inputs.

Browser checks covered comparison submission, direct lookup, single-model follow-up, reset, the trip example, 390-pixel mobile width and page exceptions. Production build, TypeScript and targeted lint were also checked.

## Remaining limits

- Current price and variant source reconciliation remains incomplete. Historical launch evidence is not specification verification.
- Arbitrary spelling, languages, multi-turn constraint editing, unsupported features and personalised ownership questions are not fully understood. The assistant must clarify rather than invent an answer.
- No operator live feed is queried by this assistant. Charger records and the route planner open separately.
- Candidate ranking uses catalogue heuristics; it cannot prove a specific variant meets combined budget/range/charging constraints. Daily driving suitability is not calculated by a shortlist.
- Guides are linked as reference material, not presented as a fresh personalised answer.

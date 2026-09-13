// Deliberately limited corrections: never fuzzy-match model numbers or amounts.
export function cleanPrompt(value: string) {
  return value.toLowerCase().normalize("NFKC")
    .replace(/\b(comapre|compair|compar)\b/g, "compare")
    .replace(/\b(maindra|mahindara)\b/g, "mahindra")
    .replace(/\b(nexoon|nexonn)\b/g, "nexon")
    .replace(/\b(chargers?|chargng|chargin)\b/g, (word) => word.startsWith("charger") ? word : "charging")
    .replace(/\b(staions|statiosn|statons)\b/g, "stations")
    .replace(/\b(buget|budjet)\b/g, "budget")
    .replace(/\b(lac|lacs|lakhs)\b/g, "lakh")
    .replace(/\b(kilometres?|kilometers?|kms)\b/g, "km")
    .replace(/\b(electric|electic)\s+vehicles?\b/g, "ev")
    .replace(/\b(be|xev|vf)\s*(\d)/g, "$1 $2");
}

export function normalise(value: string) {
  return cleanPrompt(value).replace(/[^a-z0-9]+/g, " ").trim();
}

export function containsPhrase(text: string, phrase: string) {
  return (` ${normalise(text)} `).includes(` ${normalise(phrase)} `);
}

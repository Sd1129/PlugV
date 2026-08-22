const COMPACT_EV_SLUGS = new Set(["tata-tiago-ev", "mg-comet-ev", "vayve-mobility-eva"]);
const SEDAN_EV_SLUGS = new Set(["bmw-i7", "byd-seal"]);
const MPV_EV_SLUGS = new Set(["mg-windsor-ev", "kia-carens-clavis-ev", "mg-m9", "vinfast-vf-mpv-7"]);
const ROADSTER_EV_SLUGS = new Set(["mg-cyberster"]);

export function getVehicleImage(slug: string) {
  if (COMPACT_EV_SLUGS.has(slug)) return "/images/vehicles/plugv-concept-compact.png";
  if (SEDAN_EV_SLUGS.has(slug)) return "/images/vehicles/plugv-concept-sedan.png";
  if (MPV_EV_SLUGS.has(slug)) return "/images/vehicles/plugv-concept-mpv.png";
  if (ROADSTER_EV_SLUGS.has(slug)) return "/images/vehicles/plugv-concept-roadster.png";
  return "/images/vehicles/plugv-concept-suv.png";
}

export function getVehicleVisual(slug: string) {
  return { src: getVehicleImage(slug), modelSpecific: false, plugvConcept: true };
}

export type OwnerSavedItem = {
  id: string;
  type: "Trip" | "Charger";
  title: string;
  detail: string;
  href?: string;
  createdAt?: string;
  stationId?: string;
  trustedByOwner?: boolean;
};

export const OWNER_SAVED_ITEMS_KEY = "plugv-owner-saved";

export function readOwnerSavedItems(): OwnerSavedItem[] {
  try {
    const value = window.localStorage.getItem(OWNER_SAVED_ITEMS_KEY);
    return value ? JSON.parse(value) as OwnerSavedItem[] : [];
  } catch {
    return [];
  }
}

export function writeOwnerSavedItems(items: OwnerSavedItem[]) {
  window.localStorage.setItem(OWNER_SAVED_ITEMS_KEY, JSON.stringify(items));
}

export function toggleTrustedCharger(item: OwnerSavedItem) {
  const existing = readOwnerSavedItems();
  const alreadySaved = existing.some((saved) => saved.type === "Charger" && saved.stationId === item.stationId);
  const next = alreadySaved
    ? existing.filter((saved) => !(saved.type === "Charger" && saved.stationId === item.stationId))
    : [item, ...existing];
  writeOwnerSavedItems(next);
  return !alreadySaved;
}

export type HomeChargingAccess = "dedicated" | "shared" | "workplace" | "public-only" | "unknown";
export type HighwayFrequency = "rarely" | "monthly" | "weekly";
export type DriveCondition = "city" | "highway" | "difficult";

export type OwnerProfile = {
  version: 2;
  city: string;
  vehicleSlug: string;
  variantName: string;
  batteryPercent: number;
  distance: number;
  dailyDistanceKm: number;
  condition: DriveCondition;
  homeCharging: HomeChargingAccess;
  electricityTariff: number;
  highwayFrequency: HighwayFrequency;
  familySize: number;
  budgetLakhs: number;
  updatedAt?: string;
};

export const OWNER_PROFILE_KEY = "plugv-owner-profile";

export function createDefaultOwnerProfile(vehicleSlug = ""): OwnerProfile {
  return { version: 2, city: "", vehicleSlug, variantName: "", batteryPercent: 70, distance: 80, dailyDistanceKm: 40, condition: "city", homeCharging: "unknown", electricityTariff: 8, highwayFrequency: "monthly", familySize: 4, budgetLakhs: 20 };
}

export function readOwnerProfile(fallbackVehicleSlug = ""): OwnerProfile {
  const fallback = createDefaultOwnerProfile(fallbackVehicleSlug);
  try {
    const stored = JSON.parse(window.localStorage.getItem(OWNER_PROFILE_KEY) ?? "{}") as Partial<OwnerProfile>;
    return { ...fallback, ...stored, version: 2 };
  } catch { return fallback; }
}

export function writeOwnerProfile(profile: OwnerProfile) {
  window.localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify({ ...profile, version: 2, updatedAt: new Date().toISOString() }));
}

export function profileCompletion(profile: OwnerProfile) {
  const checks = [profile.city.trim(), profile.vehicleSlug, profile.variantName, profile.dailyDistanceKm > 0, profile.homeCharging !== "unknown", profile.electricityTariff > 0, profile.familySize > 0, profile.budgetLakhs > 0];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

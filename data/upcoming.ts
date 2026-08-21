import { upcomingVehicles } from "@/data/vehicles-upcoming";

export const upcomingEVs = upcomingVehicles.map((vehicle) => ({
  slug: vehicle.slug,
  brand: vehicle.brand,
  maker: vehicle.brand,
  name: vehicle.name,
  launch: vehicle.launch,
  note: vehicle.note,
  range: vehicle.range ?? "Not announced",
  battery: vehicle.battery ?? "Not announced",
  charging: vehicle.range ? "Official claim" : "Not announced",
  status: vehicle.status,
}));

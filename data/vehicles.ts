import { launchedVehicles, type LaunchedVehicle } from "@/data/vehicles-launched";
import { upcomingVehicles, type UpcomingVehicle } from "@/data/vehicles-upcoming";

export type Vehicle = LaunchedVehicle;
export type VehicleCatalogItem = LaunchedVehicle | UpcomingVehicle;

export const vehicles = launchedVehicles;
export const upcomingEVs = upcomingVehicles;

export const allEVs: VehicleCatalogItem[] = [...launchedVehicles, ...upcomingVehicles];

export function getLaunchedVehicles(): LaunchedVehicle[] {
  return launchedVehicles;
}

export function getUpcomingVehicles(): UpcomingVehicle[] {
  return upcomingVehicles;
}
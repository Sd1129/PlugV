import CompareClient from "./CompareClient";
export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const vehicle = typeof params.vehicle === "string" ? params.vehicle : "";
  const withVehicle = typeof params.with === "string" ? params.with : "";
  return <CompareClient key={vehicle + ":" + withVehicle} initialVehicle={vehicle} initialWith={withVehicle} />;
}

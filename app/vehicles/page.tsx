import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import { vehicles } from "@/data/vehicles";
import { siteCopy } from "@/data/siteCopy";

export default function VehiclesPage() {
  const launchedVehicles = vehicles.filter((vehicle) => vehicle.launched);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <section className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0f5132]">
            Vehicles
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            {siteCopy.vehiclesTitle}
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {siteCopy.vehiclesDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {launchedVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
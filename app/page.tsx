import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedVehicles from "@/components/FeaturedVehicles";
import UpcomingVehicles from "@/components/UpcomingVehicles";
import ChargingStations from "@/components/ChargingStations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen text-slate-950">
      <Navbar />
      <HeroSection />
      <FeaturedVehicles />
      <UpcomingVehicles />
      <ChargingStations />
      <Footer />
    </main>
  );
}
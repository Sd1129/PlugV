import Navbar from "@/components/Navbar";
import CompareSection from "@/components/CompareSection";
import Footer from "@/components/Footer";

export default function ComparePage() {
  return (
    <main className="min-h-screen text-slate-950">
      <Navbar />
      <CompareSection />
      <Footer />
    </main>
  );
}
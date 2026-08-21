import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function DataTrustNotice({
  message = "Manufacturer specifications are labelled as claimed. Estimates and live availability limits are shown separately.",
}: {
  message?: string;
}) {
  return (
    <div className="border-b border-emerald-300/10 bg-emerald-400/[0.045]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="flex items-start gap-2 leading-5 text-emerald-100/80">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
          <span><strong className="text-emerald-100">PlugV data clarity:</strong> {message}</span>
        </p>
        <Link href="/methodology" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-emerald-200 hover:text-white">
          How PlugV verifies data <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

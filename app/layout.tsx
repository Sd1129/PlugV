import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlugV 2.0",
  description: "India's premium EV decision platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
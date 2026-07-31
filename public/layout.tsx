import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlugV | EV Vehicles & Charging Stations",
  description:
    "PlugV is an Indian EV platform for vehicles, upcoming launches, and charging stations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
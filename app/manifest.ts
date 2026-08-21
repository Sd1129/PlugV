import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PlugV.in — India's EV Platform",
    short_name: "PlugV.in",
    description:
      "Discover and compare electric cars, find charging stations and plan EV trips across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/brand/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

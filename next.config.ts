import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://router.project-osrm.org https://routing.openstreetmap.de https://va.vercel-scripts.com; frame-src 'self' https://www.google.com; worker-src 'self' blob:;" },
      ],
    }];
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const MAX_UPLOAD_BODY_SIZE = 50 * 1024 * 1024; // 50 MB

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  experimental: {
    serverActions: {
      // Avoid string parse issues at config load time
      bodySizeLimit: MAX_UPLOAD_BODY_SIZE,
    },
    // Proxy clones the request body and defaults to 10MB.
    // Large deed/sublease PDFs were truncated → "Unexpected end of form".
    proxyClientMaxBodySize: MAX_UPLOAD_BODY_SIZE,
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "radix-ui",
      "recharts",
      "leaflet",
      "react-leaflet",
      "firebase",
      "date-fns",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aqid.subcodeco.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "aqid.subcodeco.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "aqid.subcodeco.com",
        pathname: "/images/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);

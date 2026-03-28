import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lemma.oipav.ru" },
      { protocol: "https", hostname: "ege-journal.oipav.ru" },
    ],
  },
  // Allow reading content/ dir from fs at build time
  outputFileTracingIncludes: {
    "/blog/**": ["./content/**"],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  redirects() {
    return [
      { source: "/", destination: "/fr", permanent: true },
      { source: "/en/:path*", destination: "/fr/:path*", permanent: true },
    ];
  },
};

export default nextConfig;

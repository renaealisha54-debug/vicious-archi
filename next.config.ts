import type { NextConfig } from 'next';

const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true';

const nextConfig: NextConfig = {
  images: {
    // Static export can't use Next's image optimizer, so it's disabled
    // for the mobile build; the web build keeps normal optimization.
    unoptimized: isMobileBuild,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Capacitor needs a static HTML/JS bundle, not a Node server. Static
  // export doesn't support Server Actions — scripts/mobile-build.js swaps
  // the Groq-backed flow for a plain stub before this build runs.
  ...(isMobileBuild && {
    output: 'export' as const,
  }),
};

export default nextConfig;

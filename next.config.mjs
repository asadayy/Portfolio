/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /**
     * Client router cache: keep visited/prefetched pages fresh in the
     * browser for a while so navigating back and forth is instant instead
     * of re-fetching from the server every time. Content edits still
     * appear promptly (admin mutations revalidate the server cache; the
     * client picks them up after the stale window or on hard refresh).
     */
    staleTimes: {
      static: 300, // s — our public pages (all statically rendered)
      dynamic: 30, // s — anything dynamic
    },
  },
};

export default nextConfig;

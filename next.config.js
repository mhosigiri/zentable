/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  // Removed output: "export" to allow dynamic API routes
  webpack(config) {
    // 1a) Add this warning to the ignore list
    config.ignoreWarnings = config.ignoreWarnings || []
    config.ignoreWarnings.push({
      message: /Critical dependency: the request of a dependency is an expression/,
    })

    return config
  },
};

module.exports = nextConfig;

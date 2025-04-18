/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow image optimization for all domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true, // Disable image optimization for local images
  },
  // Ensure all assets are included in the build
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Ensure the public directory is properly included
  output: 'standalone',
  // Configure webpack to properly handle our assets 
  webpack(config) {
    // Add a rule to handle image files
    config.module.rules.push({
      test: /\.(jpg|jpeg|png|svg|gif)$/i,
      type: 'asset/resource',
    });
    return config;
  },
  // Add proper tracing so Next.js knows about public files
  experimental: {
    outputFileTracingIncludes: {
      '/': ['public/**/*']
    }
  }
};

export default nextConfig; 
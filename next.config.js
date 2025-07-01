/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com', // Replace with your actual domain
        pathname: '/**',
      },
      // Add other domains as needed
    ],
  },
  // Your other configurations...
};

module.exports = nextConfig;

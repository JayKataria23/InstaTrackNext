/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "instagram.*.fna.fbcdn.net",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;

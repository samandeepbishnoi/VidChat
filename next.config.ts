/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
        pathname: "/**", // Allow all paths from this hostname
      },
    ],
  },
};

module.exports = nextConfig;

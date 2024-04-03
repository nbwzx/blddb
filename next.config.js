/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:slug*.html",
        destination: "/:slug*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

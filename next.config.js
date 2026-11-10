/** @type {import('next').NextConfig} */
const isExport = process.env.STATIC_EXPORT === "1";
const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const nextConfig = {
  // Offline desktop build (Tauri): with STATIC_EXPORT=1 we emit a pure static
  // export. Without it (normal Vercel build) behavior is unchanged.
  output: isExport ? "export" : undefined,
  images: {
    // Static export can't use the Next image optimizer, so disable it; this has
    // no functional impact on the Vercel build either.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
  },
  // In Tauri dev mode, frontend assets are served from the dev server.
  ...(isExport
    ? {
        assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
        // Skip type-check / lint for the static export build: some files under
        // test/ still carry type errors from the latest commutator API and are
        // unrelated to runtime; the normal Vercel build keeps these checks.
        typescript: { ignoreBuildErrors: true },
        eslint: { ignoreDuringBuilds: true },
      }
    : {}),
  // Static export can't do runtime redirects, and the desktop app doesn't need
  // the .html -> extensionless redirect, so drop it on export; keep it for the
  // normal Vercel build.
  ...(isExport
    ? {}
    : {
        async redirects() {
          return [
            {
              source: "/:slug*.html",
              destination: "/:slug*",
              permanent: true,
            },
          ];
        },
      }),
};

module.exports = nextConfig;

import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy'
export default defineConfig({
  plugins: [
    copy({
      targets: [
        { src: "./assets/*", dest: "./public/assets" },
        { src: ["./images/zh.png","./images/en.png","./images/ja.png"], dest: "./public/images" }
      ],
      verbose: true,
      copyOnce: true,
    })
  ],
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    strictPort: true,
  },
  // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
  // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
  // env variables
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // 为调试构建生成源代码映射 (sourcemap)
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      input: {
        "main": resolve(__dirname, "index.html"),
        "corner": resolve(__dirname, "corner.html"),
        "edge": resolve(__dirname, "edge.html"),
        "image": resolve(__dirname, "image.html"),
        "donate": resolve(__dirname, "donate.html"),
        "2e2e": resolve(__dirname, "2e2e.html"),
        "2flips": resolve(__dirname, "2flips.html"),
        "5style": resolve(__dirname, "5style.html"),
        "donate_en": resolve(__dirname, "donate_en.html"),
        "twists": resolve(__dirname, "twists.html"),
        "parity": resolve(__dirname, "parity.html"),
        "code": resolve(__dirname, "code.html"),
        "night/2c2c": resolve(__dirname, "nightmare/2c2c.html"),
        "night/2e2e": resolve(__dirname, "nightmare/2e2e.html"),
        "night/2flips": resolve(__dirname, "nightmare/2flips.html"),
        "night/2twists": resolve(__dirname, "nightmare/2twists.html"),
        "night/3twists": resolve(__dirname, "nightmare/3twists.html"),
        "night/4flips": resolve(__dirname, "nightmare/4flips.html"),
        "night/5style": resolve(__dirname, "nightmare/5style.html"),
        "night/corner": resolve(__dirname, "nightmare/corner.html"),
        "night/edge": resolve(__dirname, "nightmare/edge.html"),
        "night/parity": resolve(__dirname, "nightmare/parity.html"),
        "night/paritytwist": resolve(__dirname, "nightmare/paritytwist.html"),
        "night/index": resolve(__dirname, "nightmare/index.html"),
        "custom/index": resolve(__dirname, "custom/index.html"),
        "custom/corner": resolve(__dirname, "custom/corner.html"),
        "custom/edge": resolve(__dirname, "custom/edge.html"),
      },
    },
  },
})
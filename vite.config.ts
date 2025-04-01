import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25 MB
      },
      srcDir: "src",
      filename: "service-worker.js",
      includeAssets: ["src/assets/**/*"],
      manifest: {
        short_name: "ImageAboveText",
        name: "Image Above Text",
        icons: [
          {
            src: "/src/assets/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/src/assets/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#4F46E5",
        background_color: "#F9FAFB",
      },
    }),
  ],
  server: {
    allowedHosts: ["f375-39-39-224-96.ngrok-free.app", "localhost"],
  },
});

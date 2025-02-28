import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    allowedHosts: [
      "4107-61-218-122-10.ngrok-free.app", // 加入 ngrok 提供的域名
    ],
    host: "0.0.0.0",
    port: 3000,
  },
});

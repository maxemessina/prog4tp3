import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/productos": "http://localhost:3000",
      "/pedidos": "http://localhost:3000",
    },
  },
});

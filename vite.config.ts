import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "shrimp-assets",
      closeBundle() {
        const source = resolve(__dirname, "assets");
        const target = resolve(__dirname, "dist/assets");
        if (existsSync(source)) {
          cpSync(source, target, { recursive: true });
        }
      },
    },
  ],
});

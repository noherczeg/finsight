/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Project is deployed to GitHub Pages at https://<user>.github.io/finsight/
// so the base path must match the repo name for correct asset URLs.
export default defineConfig({
  base: "/finsight/",
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
});

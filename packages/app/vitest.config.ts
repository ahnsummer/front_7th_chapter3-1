import { defineConfig } from "vitest/config";
import { mergeConfig } from "vite";
import viteConfig from "./vite.config";

// https://vitest.dev/config/
export default defineConfig(
  mergeConfig(viteConfig, {
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: true,
    },
  })
);

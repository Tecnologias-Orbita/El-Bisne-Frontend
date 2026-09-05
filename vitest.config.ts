import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.tsx"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});

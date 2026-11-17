import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  server: {
    port: 5001,
    proxy: {
      "/api/backend": {
        target: "https://mini-project-server-i490.onrender.com/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/backend/, ""),
      },
    },
  },
  fmt: {
    ignorePatterns: [".agents/**", "build/**", "dist/**"],
  },
  lint: {
    ignorePatterns: [".agents/**", "build/**", "dist/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [tailwindcss(), react()]),
  resolve: {
    tsconfigPaths: true,
  },
});

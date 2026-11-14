import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
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
    ignorePatterns: [".react-router/**", ".agents/**", "build/**"],
  },
  lint: {
    ignorePatterns: [".react-router/**", ".agents/**", "build/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [tailwindcss(), reactRouter()]),
  resolve: {
    tsconfigPaths: true,
  },
});

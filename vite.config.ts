import { defineConfig, loadEnv } from "vite";
import { legalPrerender } from "./prerender/legalPrerender";
import { articlePrerender } from "./prerender/articlePrerender";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), legalPrerender(loadEnv(mode, process.cwd(), "")), articlePrerender(loadEnv(mode, process.cwd(), ""))].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

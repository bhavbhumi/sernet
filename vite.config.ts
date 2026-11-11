// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";
import { loadEnv, type ConfigEnv } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const withLovableConfig = defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        { find: "entities/lib/decode.js", replacement: path.resolve(process.cwd(), "node_modules/entities/lib/decode.js") },
        { find: "entities/lib/encode.js", replacement: path.resolve(process.cwd(), "node_modules/entities/lib/encode.js") },
        { find: "entities/decode", replacement: path.resolve(process.cwd(), "node_modules/entities/lib/decode.js") },
        { find: "entities/encode", replacement: path.resolve(process.cwd(), "node_modules/entities/lib/encode.js") },
        { find: /^entities$/, replacement: path.resolve(process.cwd(), "node_modules/entities/lib/index.js") },
      ],
    },
  },
});

export default async (env: ConfigEnv) => {
  // VITE_* client variables remain handled by the Lovable config. Server-only
  // values are populated here and are never added to client-side definitions.
  const serverEnv = loadEnv(env.mode, process.cwd(), "");
  Object.assign(process.env, serverEnv);
  return withLovableConfig(env);
};

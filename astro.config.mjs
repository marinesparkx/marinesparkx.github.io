// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import clickToAi from "./src/dev-toolbar/click-to-ai/integration.ts";

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), clickToAi()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
});

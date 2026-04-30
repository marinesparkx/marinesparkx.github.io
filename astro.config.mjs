// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import clickToAi from "astro-click-to-ai";

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

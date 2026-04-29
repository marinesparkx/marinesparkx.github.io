import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import type { CapturedClick } from "./types.ts";

const APP_ID = "click-to-ai";
const EVENT = `${APP_ID}:capture`;
const OUTPUT_FILE = "last-click.json";

// Inline SVG so the integration ships standalone — no astro-icon coupling at toolbar load.
const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><circle cx="12" cy="12" r="2"/></svg>';

export default function clickToAi(): AstroIntegration {
  let outputPath = "";

  return {
    name: APP_ID,
    hooks: {
      "astro:config:setup": ({ addDevToolbarApp, config }) => {
        outputPath = fileURLToPath(new URL(OUTPUT_FILE, config.root));
        addDevToolbarApp({
          id: APP_ID,
          name: "Click to AI",
          icon: ICON,
          entrypoint: new URL("./app.ts", import.meta.url),
        });
      },
      "astro:server:setup": ({ toolbar }) => {
        toolbar.on<CapturedClick>(EVENT, (data) => {
          writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
        });
      },
    },
  };
}

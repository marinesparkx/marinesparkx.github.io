import { defineToolbarApp } from "astro/toolbar";
import type { CapturedClick } from "./types.ts";

const APP_ID = "click-to-ai";
const EVENT = `${APP_ID}:capture`;
const MAX_TEXT = 200;
const MAX_HTML = 600;

function buildSelector(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;
  while (current && current !== document.body && parts.length < 5) {
    let part = current.tagName.toLowerCase();
    if (current.id) {
      parts.unshift(`${part}#${current.id}`);
      break;
    }
    const cls = Array.from(current.classList).slice(0, 2).join(".");
    if (cls) part += `.${cls}`;
    parts.unshift(part);
    current = current.parentElement;
  }
  return parts.join(" > ");
}

function capture(el: Element): CapturedClick {
  const rect = el.getBoundingClientRect();
  return {
    timestamp: new Date().toISOString(),
    url: location.href,
    pathname: location.pathname,
    tag: el.tagName.toLowerCase(),
    id: el.id,
    classes: Array.from(el.classList),
    selector: buildSelector(el),
    text: (el.textContent ?? "").trim().slice(0, MAX_TEXT),
    outerHtml: el.outerHTML.slice(0, MAX_HTML),
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
  };
}

export default defineToolbarApp({
  init(canvas, app, server) {
    let highlight: HTMLElement | null = null;

    const win = document.createElement("astro-dev-toolbar-window");
    win.style.cssText =
      "display: none; position: fixed; bottom: 72px; right: 16px; max-width: 360px;";
    const status = document.createElement("p");
    status.textContent = "Click any element to capture context for Claude.";
    win.appendChild(status);
    canvas.appendChild(win);

    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      e.preventDefault();
      e.stopPropagation();

      const data = capture(target);
      server.send(EVENT, data);

      if (highlight) highlight.remove();
      highlight = document.createElement("astro-dev-toolbar-highlight");
      const r = target.getBoundingClientRect();
      highlight.style.cssText = `top:${r.top + scrollY - 6}px;left:${r.left + scrollX - 6}px;width:${r.width + 12}px;height:${r.height + 12}px;`;
      canvas.appendChild(highlight);

      status.textContent = `Captured: ${data.selector} → last-click.json`;
    };

    app.onToggled(({ state }) => {
      win.style.display = state ? "block" : "none";
      if (state) {
        document.addEventListener("click", onClick, { capture: true });
      } else {
        document.removeEventListener("click", onClick, { capture: true });
        if (highlight) {
          highlight.remove();
          highlight = null;
        }
      }
    });
  },
});

import { render } from "preact";

import { defineToolbarApp } from "astro/toolbar";
import { ToolbarAppWindow } from "./components/ToolbarAppWindow.js";
import type { DevToolbarApp } from "astro";

const SESSION_KEY_OPEN = "@altano/astro-opengraph/toolbar:is-open";

const app: DevToolbarApp = defineToolbarApp({
  init(canvas, app) {
    app.onToggled((event) => {
      if (event.state) {
        sessionStorage.setItem(SESSION_KEY_OPEN, "true");
        render(<ToolbarAppWindow />, canvas);
      } else {
        sessionStorage.removeItem(SESSION_KEY_OPEN);
      }
    });

    app.toggleNotification({
      state: document.querySelector('meta[property="og:image"]') != null,
      level: "info",
    });

    if (sessionStorage.getItem(SESSION_KEY_OPEN) != null) {
      app.toggleState({ state: true });
    }
  },
});

export default app;

import { createRoot } from "react-dom/client";

import { defineToolbarApp } from "astro/toolbar";
import { ToolbarAppWindow } from "./components/ToolbarAppWindow.js";

const SESSION_KEY_OPEN = "@altano/astro-opengraph/toolbar:is-open";

export default defineToolbarApp({
  init(canvas, app) {
    const root = createRoot(canvas);

    app.onToggled((event) => {
      if (event.state) {
        sessionStorage.setItem(SESSION_KEY_OPEN, "true");
        root.render(<ToolbarAppWindow />);
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

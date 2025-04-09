import type React from "react";
import { styles } from "../styles.js";
import { ToolbarApp } from "./ToolbarApp.js";

export function ToolbarAppWindow(): React.JSX.Element {
  return (
    <astro-dev-toolbar-window>
      <style>{styles}</style>
      <ToolbarApp />
    </astro-dev-toolbar-window>
  );
}

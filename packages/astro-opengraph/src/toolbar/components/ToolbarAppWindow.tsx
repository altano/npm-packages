import type Preact from "preact";
import { styles } from "../styles.js";
import { ToolbarApp } from "./ToolbarApp.js";

export function ToolbarAppWindow(): Preact.JSX.Element {
  return (
    <astro-dev-toolbar-window>
      <style>{styles}</style>
      <ToolbarApp />
    </astro-dev-toolbar-window>
  );
}

import type { Icon } from "astro/runtime/client/dev-toolbar/ui-library/icons.js";
import type Preact from "preact";

export function Error({
  message,
  icon,
}: {
  message: string;
  icon: Icon;
}): Preact.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
      }}
    >
      <astro-dev-toolbar-icon style={{ width: 24, height: 24 }} icon={icon} />{" "}
      {message}
    </div>
  );
}

import type { ComponentChildren } from "preact";
import type Preact from "preact";

export function ToolbarSection({
  icon,
  children,
}: {
  icon: Preact.JSX.Element;
  children: ComponentChildren;
}): Preact.JSX.Element {
  return (
    <div
      style={{
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        columnGap: 5,
      }}
    >
      <div
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
        }}
      >
        {icon}
      </div>
      {children}
    </div>
  );
}

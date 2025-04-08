import type React from "react";

export function ToolbarSection({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element {
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

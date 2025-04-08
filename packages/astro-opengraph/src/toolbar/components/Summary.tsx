import type React from "react";

export function Summary({ children }: { children: string }): React.JSX.Element {
  return (
    <summary
      style={{
        cursor: "pointer",
        fontWeight: 700,
        color: "white",
      }}
    >
      {children}
    </summary>
  );
}

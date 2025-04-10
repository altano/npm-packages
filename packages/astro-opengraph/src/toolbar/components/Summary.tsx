import type Preact from "preact";

export function Summary({
  children,
}: {
  children: string;
}): Preact.JSX.Element {
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

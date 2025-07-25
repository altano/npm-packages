import type Preact from "preact";

export function ExternalLinkicon({
  width = 27,
  height = 27,
  fill = "#020202",
}: {
  width?: number;
  height?: number;
  fill?: string;
}): Preact.JSX.Element {
  return (
    <span
      style={{
        display: "inline-block",
        width,
        height,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <path d="M120.09 16.696H60.256V.096L120.09.09z" fill={fill} />
        <path
          d="M57.99 48.64l42.573-42.574 13.475 13.475-42.574 42.58z"
          fill={fill}
        />
        <path
          d="M119.98.107l.02 59.83-16.59.013-.02-59.846zM3 23.5h17v87H3zm83.49 52.56h17V113h-17z"
          fill={fill}
        />
        <path d="M3 16.692h40.655v17H3zM3 96h100.49v17H3z" fill={fill} />
      </svg>
    </span>
  );
}

import type React from "react";
import type { DevToolbarButton } from "astro/runtime/client/dev-toolbar/ui-library/button.js";
import type { DevToolbarIcon } from "astro/runtime/client/dev-toolbar/ui-library/icon.js";
import type { DevToolbarWindow } from "astro/runtime/client/dev-toolbar/ui-library/window.js";
import type { DevToolbarRadioCheckbox } from "astro/runtime/client/dev-toolbar/ui-library/radio-checkbox.js";

// Astro doesn't expose React-friendly types for these web components so we can
// just manually define them for now.
//
// The components live here: node_modules/astro/dist/runtime/client/dev-toolbar/ui-library/
// e.g. DevToolbarButton: node_modules/astro/dist/runtime/client/dev-toolbar/ui-library/button.d.ts

interface DevToolbarIconAttributes
  extends React.HTMLAttributes<HTMLElement>,
    Partial<Pick<DevToolbarIcon, "icon">> {}

interface DevToolbarButtonAttributes
  extends React.HTMLAttributes<HTMLElement>,
    Partial<
      Pick<DevToolbarButton, "size" | "buttonStyle" | "buttonBorderRadius">
    > {}

interface DevToolbarWindowAttributes
  extends React.HTMLAttributes<HTMLElement>,
    Partial<Pick<DevToolbarWindow, "placement">> {}

interface DevToolbarRadioCheckboxAttributes
  extends React.HTMLAttributes<HTMLElement>,
    Partial<Pick<DevToolbarRadioCheckbox, "radioStyle">> {}

interface AstroIntrinsicElements {
  "astro-dev-toolbar-window": DevToolbarWindowAttributes;
  "astro-dev-toolbar-button": DevToolbarButtonAttributes;
  "astro-dev-toolbar-icon": DevToolbarIconAttributes;
  "astro-dev-toolbar-radio-checkbox": DevToolbarRadioCheckboxAttributes;
}

declare module "react" {
  declare namespace JSX {
    // false-positive: the `extends X` is what matters.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends AstroIntrinsicElements {}
  }
}

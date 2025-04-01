import type React from "react";

export type ReactElementWithRef = React.ReactElement<{
  ref: React.Ref<Element>;
}>;

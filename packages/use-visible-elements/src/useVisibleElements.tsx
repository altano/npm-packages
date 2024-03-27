import React from "react";
import { VisibleElementsContext } from "./VisibleElementObserver";

export function useVisibleElements(): Set<Element> {
  const value = React.useContext(VisibleElementsContext);
  if (value == null) {
    throw new Error(
      `useVisibleElements must be used within a context provider`,
    );
  }
  return value;
}

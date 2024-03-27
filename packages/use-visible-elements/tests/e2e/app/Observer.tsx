import React from "react";
import { useVisibleElements } from "@altano/use-visible-elements";

export default function Observer(): React.ReactElement {
  const visibleListItems = useVisibleElements();

  return (
    <div
      data-testid="visible-element-count"
      style={{
        position: "fixed",
        left: 10,
        top: 10,
        fontSize: "3em",
      }}
    >
      Visible List Items Count: {visibleListItems.size}
    </div>
  );
}

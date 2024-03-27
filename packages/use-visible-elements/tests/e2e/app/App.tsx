import React from "react";
import { VisibleElementObserver } from "@altano/use-visible-elements";
import Observer from "./Observer";

export default function App(): React.ReactElement {
  return (
    <VisibleElementObserver selector="nav li">
      <Observer />
      <main style={{ margin: "1rem" }}>
        <nav style={{ marginTop: "110vh" }}>
          <ul>
            <li>Hi I am a list item</li>
            <li>Hi I am another list item</li>
          </ul>
        </nav>
      </main>
    </VisibleElementObserver>
  );
}

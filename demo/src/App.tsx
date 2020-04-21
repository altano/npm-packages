import React from "react";

import Article from "./Article";
import TableOfContents from "./TableOfContents";
import { VisibleElementObserver } from "@altano/use-visible-elements";

import "./App.css";

const intersectionOptions = {
  // rootMargin: '-100px 0px',
};

function App() {
  return (
    <div className="App">
      <VisibleElementObserver
        intersectionOptions={intersectionOptions}
        useWrapperDiv={true}
        selector="article section"
      >
        <TableOfContents />
        <Article />
      </VisibleElementObserver>
    </div>
  );
}

export default React.memo(App);

import React from "react";

import Article from "./Article";
import TableOfContents from "./TableOfContents";
import { TocVisibleSectionObserver } from "@altano/use-toc-visible-sections";

import "./App.css";

const intersectionOptions = {
  rootMargin: "-100px 0px",
};

function App() {
  return (
    <div className="App">
      <TocVisibleSectionObserver
        intersectionOptions={intersectionOptions}
        selector="article section"
      >
        <TableOfContents />
        <Article />
      </TocVisibleSectionObserver>
    </div>
  );
}

export default React.memo(App);

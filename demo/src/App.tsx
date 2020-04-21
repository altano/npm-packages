import React from "react";

import Article from "./Article";
import TableOfContents from "./TableOfContents";
import { TocVisibleSectionObserver } from "@altano/use-toc-visible-sections";

import "./App.css";

function App() {
  return (
    <div className="App">
      <TocVisibleSectionObserver>
        <TableOfContents />
        <Article />
      </TocVisibleSectionObserver>
    </div>
  );
}

export default React.memo(App);

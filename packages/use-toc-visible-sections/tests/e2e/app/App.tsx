import Article from "./Article";
import TableOfContents from "./TableOfContents";
import { TocVisibleSectionObserver } from "@altano/use-toc-visible-sections";

import "./App.css";

function App(): JSX.Element {
  return (
    <div className="App">
      <TocVisibleSectionObserver>
        <TableOfContents />
        <Article />
      </TocVisibleSectionObserver>
    </div>
  );
}

export default App;

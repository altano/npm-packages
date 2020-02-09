import React from 'react';
import useIntersectionSpy from 'intersection-spy-hook';

import Article from './Article';
import TableOfContents from './TableOfContents';

import './App.css';

function App() {
  useIntersectionSpy({
    rootMargin: '-100px 0px',
    getTarget: (heading: Element) => {
      const section = heading.nextElementSibling;
      if (section == null) {
        throw new Error('Could not get target from heading');
      }
      return section;
    },
    navigationLinksSelector: 'nav > ul > li > a',
    // @TODO optional callback that handles selection
  });
  return (
    <div className="App">
      <TableOfContents />
      <Article />
    </div>
  );
}

export default React.memo(App);

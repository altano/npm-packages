# use-visible-elements

[![npm](https://badgen.net/npm/v/@altano/use-visible-elements)](https://www.npmjs.com/package/@altano/use-visible-elements) ![Typed with TypeScript](https://badgen.net/npm/types/@altano/use-visible-elements) ![ESM only](https://badgen.net/badge/module/esm%20only?icon=js)

React hook to faciliate observing the visibility of elements in a React tree, by selector.

## Installation

`npm install @altano/use-visible-elements`

## Example

### Component.jsx

```jsx
import { VisibleElementObserver, useVisibleElements } from "@altano/use-visible-elements";

function Component() {
  const visibleElements = useVisibleElements();
  React.useEffect(() => {
    console.log(`These elements are visible: `, visibleElements);
  }, [visibleElements]);
  return (
    <VisibleElementObserver selector="div.root > ul > li">
      <div className="root">
        <ul>
          <li>Some stuff</li>
          <li>Some more stuff</li>
        </ul>
      </div>
    </VisibleElementObserver>
  );
}
```

Notes:

- Does not yet respond to DOM mutations. Observed tree must be statically mounted on first mount. Children can't be conditionally mounted. This could easily be added but this limitation is due to my only use of this hook being in a static site generator.
- The `useWrapperDiv` prop can be used to suppress creating any DOM elements for the observation. `useWrapperDiv={true}` requires having a single child of `<VisibleElementObserver>` that accepts a ref.
- Don't use this hook if you own the whole component tree. Use explicit refs instead. This should only be used when you don't own the tree (e.g. you're rendering Markdown MDX components on a static site).

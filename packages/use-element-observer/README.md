# use-element-observer

[![npm](https://badgen.net/npm/v/@altano/use-element-observer)](https://www.npmjs.com/package/@altano/use-element-observer) ![Typed with TypeScript](https://badgen.net/npm/types/@altano/use-element-observer) ![ESM only](https://badgen.net/badge/module/esm%20only?icon=js)

React hook to faciliate observing the mount of elements in a React tree, by selector.

## Installation

`npm install @altano/use-element-observer`

## Example

### Component.jsx

```jsx
import { useElementObserver } from "@altano/use-element-observer";

function Component() {
  const [mountedElements, observedTree] = useElementObserver({
    tree: (
      <ul>
        <li>Some stuff</li>
        <li>Some more stuff</li>
      </ul>
    ),
    selector: "ul > li",
  });
  React.useEffect(() => {
    console.log(`These elements are mounted: `, mountedElements);
  }, [mountedElements]);
  return observedTree;
}
```

Notes:

- Does not yet respond to DOM mutations. Observed tree must be statically mounted on first mount. Children can't be conditionally mounted. This could easily be added but this limitation is due to my only use of this hook being in a static site generator.
- The `useWrapperDiv` prop can be used to suppress creating any DOM elements for the observation. `useWrapperDiv={true}` requires having a single root element in `tree` that accepts a ref.
- Don't use this hook if you own the whole component tree. Use explicit refs instead. This should only be used when you don't own the tree (e.g. you're rendering Markdown MDX components on a static site).

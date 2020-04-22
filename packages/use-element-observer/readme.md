# use-element-observer

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

React hook to faciliate observing the mount of elements in a React tree, by selector. For example:

## Component.jsx

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

# use-toc-visible-sections

React hooks to faciliate observing sections linked to a table of contents. For example:

## App.jsx

```jsx
import { TocVisibleSectionObserver } from "@altano/use-toc-visible-sections";

function App() {
  return (
    <div className="App">
      <TocVisibleSectionObserver selector="article section">
        <TableOfContents />
        <Article />
      </TocVisibleSectionObserver>
    </div>
  );
}
```

## TableOfContents.jsx

```jsx
import { useVisibilityOfTarget } from "@altano/use-toc-visible-sections";

export default () => {
  return (
    <nav>
      <ul>
        <ListItem href="#heading1">Lorem ipsum dolor sit amet.</ListItem>
        <ListItem href="#heading2">Dignissimos aliquam dolorum</ListItem>
      </ul>
    </nav>
  );
};

function ListItem({ href, children }) {
  const isVisible = useVisibilityOfTarget(href);
  return (
    <li
      style={{
        borderLeft: isVisible ? "3px solid black" : "3px solid transparent",
      }}
    >
      <a href={href}>{children}</a>
    </li>
  );
}

```

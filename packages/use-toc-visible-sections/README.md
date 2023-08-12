# use-toc-visible-sections

[![npm](https://badgen.net/npm/v/@altano/use-toc-visible-sections)](https://www.npmjs.com/package/@altano/use-toc-visible-sections) ![Typed with TypeScript](https://badgen.net/npm/types/@altano/use-toc-visible-sections) ![ESM only](https://badgen.net/badge/module/esm%20only?icon=js)

React hook to faciliate observing visibility of sections linked to a table of contents.

## Installation

`npm install @altano/use-toc-visible-sections`

## Example

### App.jsx

```jsx
import { TocVisibleSectionObserver } from "@altano/use-toc-visible-sections";

export default () => (
  <TocVisibleSectionObserver selector="article section">
    <TableOfContents />
    <Article />
  </TocVisibleSectionObserver>
);
```

### TableOfContents.jsx

```jsx
import { useVisibilityOfTarget } from "@altano/use-toc-visible-sections";

export default () => (
  <nav>
    <ul>
      <ListItem href="#heading1">Lorem ipsum dolor sit amet.</ListItem>
      <ListItem href="#heading2">Dignissimos aliquam dolorum</ListItem>
    </ul>
  </nav>
);

function ListItem({ href, children }) {
  // Is the section this `href` points to visible in the viewport?
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

### Article.jsx

```jsx
export default () => (
  <article>
    <section>
      <h1 id="heading1">Lorem ipsum dolor sit amet.</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius libero autem in? Dicta explicabo cum laudantium voluptas voluptate quaerat inventore eos? Facilis, quae, doloribus dolorum doloremque voluptatum, labore omnis ipsum architecto debitis quibusdam quam recusandae delectus nesciunt voluptate iusto sequi saepe voluptatibus quis officiis illo dolor hic. Laudantium harum, quas tempora nobis doloremque odit sint fugit ea non beatae maxime enim odio debitis ullam delectus minima assumenda expedita. Laboriosam magni, voluptate harum officiis, voluptatibus illum porro minima architecto inventore eaque iusto a, praesentium nihil cum veritatis sunt! Incidunt debitis dignissimos hic soluta alias nisi asperiores nulla non? Corrupti, perspiciatis ducimus.</p>
    </section>
    <section>
      <h1 id="heading2">Dignissimos aliquam dolorum</h1>
      <p>Quis veniam qui quas! Repellendus tenetur nemo explicabo laborum cumque similique dicta cum ab quae ducimus aliquam ut animi sequi accusamus, dolorem perspiciatis quis doloremque, et dolorum voluptatem sunt, hic quidem nihil eveniet! Tenetur, consequatur nemo possimus sint quo itaque accusantium, voluptatibus facilis eveniet earum voluptas veniam quidem minima dolore? Aspernatur adipisci iste expedita exercitationem pariatur ex tenetur error doloribus nihil maxime eos repudiandae dolore omnis nesciunt, delectus illum, aperiam fugit blanditiis ipsa alias quaerat cupiditate eum numquam! Sed, ipsum. Eaque animi doloremque exercitationem amet eum, accusamus deserunt in atque, excepturi sunt, unde pariatur consequuntur repellendus aut quas sit ratione!</p>
    </section>
  </article>
);
```

Doesn't react to DOM mutation, e.g. if you dynamically mount a `<section>` later it won't be observed.

This hook is meant to be simple and handle cases like static sites generated using MDX where:

- The subtree is static once mounted
- The Markdown subtree is not directly owned by the application and therefore the observed elements are best discovered through a selector instead of explicit React refs.

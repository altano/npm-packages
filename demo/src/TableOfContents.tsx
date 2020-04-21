import * as React from 'react';

import {useVisibilityOfTarget} from '@altano/use-visible-elements';

import './TableOfContents.css';

function ListItem({href, children}: {href: string; children: React.ReactNode}) {
  const isVisible = useVisibilityOfTarget(href);
  return (
    <li
      style={{
        borderLeft: isVisible ? '3px solid black' : '3px solid transparent',
      }}>
      <a href={href}>{children}</a>
    </li>
  );
}

export default () => {
  return (
    <nav>
      <ul>
        {/*li*20>a[href={#heading$}]>lorem5*/}
        <ListItem href="#heading1">Lorem ipsum dolor sit amet.</ListItem>
        <ListItem href="#heading2">
          Dignissimos aliquam dolorum assumenda quod!
        </ListItem>
        <ListItem href="#heading3">Explicabo animi iusto velit nisi?</ListItem>
        <ListItem href="#heading4">
          Quam aut alias excepturi. Eligendi?
        </ListItem>
        <ListItem href="#heading5">
          Voluptatem eum temporibus amet sapiente.
        </ListItem>
        <ListItem href="#heading6">
          Architecto ipsa illum perspiciatis unde.
        </ListItem>
        <ListItem href="#heading7">
          Inventore quaerat dolorem sunt pariatur?
        </ListItem>
        <ListItem href="#heading8">Itaque alias fuga quasi in?</ListItem>
        <ListItem href="#heading9">
          Accusamus sint officiis sequi sunt?
        </ListItem>
        <ListItem href="#heading10">
          Reiciendis aut reprehenderit mollitia suscipit!
        </ListItem>
        <ListItem href="#heading11">
          Optio harum voluptate id corporis!
        </ListItem>
        <ListItem href="#heading12">
          Corrupti magnam corporis odit rerum?
        </ListItem>
        <ListItem href="#heading13">
          Quas expedita esse molestiae ducimus?
        </ListItem>
        <ListItem href="#heading14">Qui odit et ipsa nostrum?</ListItem>
        <ListItem href="#heading15">Est rerum deserunt ut suscipit?</ListItem>
        <ListItem href="#heading16">
          Error provident consequatur voluptas at?
        </ListItem>
        <ListItem href="#heading17">
          Tempora quam soluta atque ratione.
        </ListItem>
        <ListItem href="#heading18">
          Esse voluptates quam earum facilis!
        </ListItem>
        <ListItem href="#heading19">Libero molestias saepe a commodi.</ListItem>
        <ListItem href="#heading20">
          Saepe laboriosam itaque excepturi eligendi.
        </ListItem>
      </ul>
    </nav>
  );
};

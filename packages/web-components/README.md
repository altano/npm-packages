# anchor-current-setter

When an element's visibility changes, get the first descendant with a `id`
attribute and mark any links that target it (i.e. `<a href=#abc>...</a>`
targets #abc) as having `aria-current=true`

## Slots

| Name | Description                                      |
|------|--------------------------------------------------|
|      | Arbitrary child nodes containing anchor elements. Will update<br />descendant anchors as appropriate. |


# visible-element-observer

Observes its children for visibility using IntersectionObserver. An event is fired whenever the visibility changes for a descendant that matches the data-selector attribute.

## Attributes

| Attribute       | Type     | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `data-selector` | `String` | Only descendant elements which match this selector will have their visibility observed. Can be ommitted (or set to `*`) to match all descendant elements. |

## Events

| Event                    | Description                                      |
|--------------------------|--------------------------------------------------|
| `visible-element-change` | Event that is fired whenever the visibility of an observed descendant changes. |

## Slots

| Name | Description                                      |
|------|--------------------------------------------------|
|      | Arbitrary child nodes. Will be observed for visibility changes. |

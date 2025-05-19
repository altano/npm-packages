# anchor-current-setter

Make any descendant anchor have the `aria-current=true` attribute whenever its target (i.e. `<a href=#abc>...</a>` targets #abc) is visible (or whenever its target is the child of a visible element).

## Slots

| Name | Description                                      |
|------|--------------------------------------------------|
|      | Arbitrary child nodes containing anchor elements. Will update descendant anchors as appropriate. |


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

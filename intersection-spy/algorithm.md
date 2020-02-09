# Algorithm for scroll spy

## State

* all sections currently intersecting the viewport
* the ratio of intersection
* the area of the visible rect of the section
* the currently selected section

## Observed

* Hash changes and associated headings
* Intersection ratio of all sections w/ threshold = either [0, 0.25, ..., 0.75, 1] or [0, 0.1, ..., 0.9, 1]

```pseudo-code
observe_hash_change(newhash) {
  if hash points at one of the headings
    selected section = section associated with heading
    ignore next intersection observer callback = true
}

observation_callback(sections: Array<IntersectionObserverEntry>) {
  update entry list in state
  Window.requestIdleCallback(recompute_selected_section)
}

recompute_selected_section() {
  if ignore next intersection observer callback = true
    <!-- noop (b/c we must have just processed, a hashchange) -->
    ignore next intersection observer callback = false
  else if no existing sections tracked
    selected section = find section with largest visible rect
  else if any entry intersection is 100%
    selected section = last such section to become 100%
  else
    selected section = find section with largest visible rect

  if selection changed
    change hash without scroll? Or just remove?
}
```

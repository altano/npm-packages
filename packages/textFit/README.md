# `textFit` - Hassle-Free Text Fitting

A fork of [STRML/textFit](https://github.com/STRML/textFit) (@7a1eed6db54a97798556eed3c57b2ce1f87dbab4). Has the following changes:

- Convert to ESM module.
- Remove .min.js file.
- Adds the following settings to [the defaults](https://github.com/STRML/textFit#default-settings):
  ```js
  settings = {
    ...
    sizeMultipleOf: 1, // Sets the final size to the max multiple of this. Useful when a font requires the font size to be a multiple of a number for optimal rendering.
  };
  ```

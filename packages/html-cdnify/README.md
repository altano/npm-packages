![logo](https://bytebucket.org/altano/html-cdnify/raw/master/logo.png)

[ ![Codeship Status for altano/html-cdnify](https://codeship.com/projects/25227ef0-e8d1-0133-56fa-226489e381a7/status?branch=master)](https://codeship.com/projects/147335)

Transform the relative URLs in your HTML markup (e.g. scripts, stylesheets, images) to use your CDN URL.

* Uses a real HTML parser, [trumpet](https://www.npmjs.com/package/trumpet), not regular expressions.
* Doesn't require changes to your HTML, is a purely post-process transformation.
* Supports relative URLs in your HTML.
* Will perform minimal modifications to your HTML, only modifying the element that is having an attribute cdnified.
* Like [grunt-cdnify](https://www.npmjs.com/package/grunt-cdnify) but usable with or without grunt.
* Like [cdnify](https://www.npmjs.com/package/cdnify) but you don't have to mark up your HTML with magic attributes.
* This library's scope is limited to HTML and is not meant to process CSS.

# Simplest usage

```js
var cdnify = require("html-cdnify").cdnify;

cdnify({
    cdnUrl: "//cdn.com",
    buffer: `<img src="/face.png">`,
})
.then(buffer => buffer.toString())
.then(output => console.log(output));

// Output:
// <img src="//cdn.com/face.png">
```

# What gets cdnified

Any URLs where only the path (and after) is specified which are found in the following locations will be cdnified:

       <img data-src="____">
       <img src="____">
       <img srcset="____">
     <video poster="____">
    <script src="____">
    <source src="____">
      <link rel="apple-touch-icon" href="____">
      <link rel="icon" href="____">
      <link rel="shortcut icon" href="____">
      <link rel="stylesheet" href="____">

## Will be cdnified

* `<img src="/logo.png">`
* `<script src="jquery.js"></script>`
* `<link rel="stylesheet" href="main.css"></script>`

## Won't be cdnified

HTMLElement | Reason not cdnified
--- | ---
`<img src="http://foo.com/logo.png">` | Absolute URL specified
`<img src="//foo.com/logo.png">` | Scheme-relative/agnostic URL specified
`<img custom="/logo.png">` | "custom" attribute not among those cdnified

Adding the `data-cdn-ignore` attribute to any element will cause the element to be skipped during cdnification, and the `data-cdn-ignore` attribute will be removed to clean up your HTML.

# More Examples

## Using `bufferPath` to deal with subdirectories

You can specify `bufferPath`, the relative path to the buffer being processed. If this isn't specified, all resources with relative paths will be assumed to be at the root of the domain before being cdnified.

```js
var cdnify = require("html-cdnify").cdnify;

var input = `
<img src="figure1.png">
<img src="articleSubDirectory/figure2.png">
<img src="/images/logo.png">
`;

var outputPromise = cdnify({
    cdnUrl: "//cdn.com",
    bufferPath: "articles/article1/index.html",
    buffer: input,
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <img src="//cdn.com/articles/article1/figure1.png">
// <img src="//cdn.com/articles/article1/articleSubDirectory/figure2.png">
// <img src="//cdn.com/images/logo.png">
```

*Without* `bufferPath`, the output would be:

```js
// Output:
// <img src="//cdn.com/figure1.png">
// <img src="//cdn.com/articleSubDirectory/figure2.png">
// <img src="//cdn.com/images/logo.png">
```

If your CDN has a path specified, it is assumed that both relative URLs AND root-relative URLs in your HTML are relative to the CDN directory. In other words, the CDN subdirectory will always be in the final URL. For example:

```js
var cdnify = require("html-cdnify").cdnify;

var input = `
<img src="figure1.png">
<img src="articleSubDirectory/figure2.png">
<img src="/images/logo.png">
`;

var outputPromise = cdnify({
    cdnUrl: "//cdn.com/sub/directory/in/cdn/is/always/present",
    bufferPath: "article/index.html",
    buffer: input,
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <img src="//cdn.com/sub/directory/in/cdn/is/always/present/article/figure1.png">
// <img src="//cdn.com/sub/directory/in/cdn/is/always/present/article/articleSubDirectory/figure2.png">
// <img src="//cdn.com/sub/directory/in/cdn/is/always/present/images/logo.png">
```

It should usually be the expectation that a CDN subdir is always present in the cdnified result. If you need to specify a CDN subdirectory AND you need to sometimes escape URLs in your HTML to the root of the CDN domain, you'll have to write a custom transformFunction.

## Using the underlying stream instead of a Promise

If you are dealing with large files or network IO and would like to use the underlying NodeJS Transform Stream rather than buffering all of the input and output, feel free:

```js
var streamifier = require("streamifier");
var CDNTransformer = require("html-cdnify").CDNTransformer;

var transformer = new CDNTransformer({
    cdnUrl: "http://cdn.com"
});

var outputStream = streamifier
    .createReadStream(`<img src="face1.png">
<img src="face2.png">
<img src="face3.png">`)
    .pipe(transformer.stream);

outputStream.pipe(process.stdout);

// Output:
// <img src="http://cdn.com/face1.png">
// <img src="http://cdn.com/face2.png">
// <img src="http://cdn.com/face3.png">
```

## Specifying a transform defintion to add `<custom-element src="____">` to the list of attributes to be cdnified

```js
var cdnify = require("html-cdnify").cdnify;

var outputPromise = cdnify({
  cdnUrl: "//cdn.com/cdn/",
  transformDefinitions: [
    {
      selector: "custom-element[src]",
      attribute: "src",
    }
  ],
  buffer: `<custom-element src="/face7.png">`
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <custom-element src="//cdn.com/cdn/face7.png">
```

## Specifying a custom transform function

```js
var cdnify = require("html-cdnify").cdnify;

var outputPromise = cdnify({
  cdnUrl: "//cdn.com",
  transformFunction: (cdnUrl, oldUrl, bufferPath) => {
    return cdnUrl + "/subdir" + oldUrl;
  },
  buffer: `<img src="/logo.png">`
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <img src="//cdn.com/subdir/logo.png">
```

## Specifying a custom transform function that delegates to the default

If your assets are on different CDNs, you might need to write something like:

```js
var cdnify = require("html-cdnify").cdnify;
var CDNTransformer = require("html-cdnify").CDNTransformer;

var outputPromise = cdnify({
  cdnUrl: "//cdn.com",
  transformFunction: (cdnUrl, oldUrl, bufferPath) => {
    if (oldUrl.endsWith(".png")) {
      var customCdnBaseUrl = "//imagecdn.com";
    }
    else {
      var customCdnBaseUrl = "//assetcdn.com"
    }
    return CDNTransformer.defaultTransformFunction(customCdnBaseUrl, oldUrl, bufferPath);
  },
  buffer: `<img src="logo.png"><script src="main.js"></script>`
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <img src="//imagecdn.com/logo.png"><script src="//assetcdn.com/main.js"></script>
```

## Specifying a custom attributeParser

A custom attributeParser is like a custom transformFunction, but is scoped to just one selector rather than being applied to every attribute transformation.  For example, to uppercase only PNG image names before cdnifying:

```js
var cdnify = require("html-cdnify").cdnify;

var outputPromise = cdnify({
  cdnUrl: "//cdn.com",
  transformDefinitions: [
    {
      selector: `img[src$="png"]`,
      attribute: "src",
      attributeParser: (oldAttribute, transformFunction) => transformFunction(oldAttribute.toUpperCase())
    }
  ],
  buffer: `<img src="/logo.gif"><img src="/logo.png">`
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <img src="//cdn.com/logo.gif"><img src="//cdn.com/LOGO.PNG">
```

## Overriding an existing transform

The default transformDefinitions array is:

```js
[
  {
    selector: `video[poster]:not([data-cdn-ignore])`,
    attribute: "poster",
  },
  {
    selector: `img[data-src]:not([data-cdn-ignore])`,
    attribute: "data-src",
  },
  {
    selector: `script[src]:not([data-cdn-ignore])`,
    attribute: "src",
  },
  {
    selector: `source[src]:not([data-cdn-ignore])`,
    attribute: "src",
  },
  {
    selector: `link[rel="apple-touch-icon"]:not([data-cdn-ignore])`,
    attribute: "href",
  },
  {
    selector: `link[rel="icon"]:not([data-cdn-ignore])`,
    attribute: "href",
  },
  {
    selector: `link[rel="shortcut icon"]:not([data-cdn-ignore])`,
    attribute: "href",
  },
  {
    selector: `link[rel="stylesheet"]:not([data-cdn-ignore])`,
    attribute: "href",
  },
  {
    selector: `img[src]:not([data-cdn-ignore])`,
    attribute: "src",
  },
  {
    selector: `img[srcset]:not([data-cdn-ignore])`,
    attribute: "srcset",
    attributeParser: (attr, transformFunction) => {
      return attr.split(",")
        .map(imgInfo => imgInfo.replace(/([^ ]+)/, transformFunction))
        .join(",");
    }
  }
]
```

If you'd like to ovverride any of these, specify the same selector and attribute but a different attributeParser. For example:


```js
var cdnify = require("html-cdnify").cdnify;

var noopFn = oldAttribute => oldAttribute;

var outputPromise = cdnify({
  cdnUrl: "//cdn.com",
  transformDefinitions: [
    {
      selector: "img[src]:not([data-cdn-ignore])",
      attribute: "src",
      attributeParser: noopFn // pass-through attribute without modification
    }
  ],
  buffer: `<img src="logo.gif">`
}).then(buffer => buffer.toString());

outputPromise.then(output => console.log(output));

// Output:
// <img src="logo.gif">
```

# API

## Promise-based API (recommended for simplicity)

```js
var cdnify = require("html-cdnify").cdnify;

cdnify({ ... Options ...}) => Promise<Buffer>
```

### Options

Same options as stream-based API (see below), plus:

Property | Type | Optional | Description
---------|------|----------|-------------
buffer | Buffer or string | The content that is going to be cdnified

## Stream-based API

use the stream-based API when you are dealing with large files or network IO and would like to use the underlying NodeJS Transform Stream rather than buffering all of the input and output. The Promisebased API is simpler but the input/output must be completely buffered, which is obviously fine most of the time.

```js
var CDNTransformer = require("html-cdnify").CDNTransformer;

var transformer = new CDNTransformer({ ... Options ... }) => CDNTransformer
transformer.stream => NodeJS TransformStream
```

### Options

Property | Type | Optional | Description
---------|------|----------|-------------
cdnUrl | string |  | The absolute (or scheme-relative/agnostic) URL to your CDN.
bufferPath | string | Y | The relative path to the buffer being processed. If this isn't specified, all resources with relative paths will be assumed to be at the root of the domain before being cdnified.
transformDefinitions | TransformDefinition | Y | See below...
transformFunction | CDNTransformFunction | Y | See below...

### TransformDefinition

```
interface TransformDefinition {
  selector: string;
  attribute: string;
  attributeParser?: (oldAttribute: string, transformFunction: TransformFunction) => string;
}
```

The default attributeParser when one isn't specified is:
```
HtmlAttributeStreamTransformerOptions.attributeParsers = {
  default: (attr, transformFunction) => transformFunction(attr)
};
```

### CDNTransformFunction

```
(cdnUrl: string, oldUrl: string, bufferPath: string) => string;
```

### TransformFunction

```
(oldAttribute: string) => string;
```

---
Shield (in logo) by [Flaticon](http://www.flaticon.com) from [Freepik](http://www.freepik.com)
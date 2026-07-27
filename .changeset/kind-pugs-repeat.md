---
"@altano/html-cdnify": major
---

replace the deprecated legacy `url.resolve` with the WHATWG URL API.

Resolution is otherwise unchanged for absolute, protocol-relative, and path-only
CDN URLs, but there are two breaking differences in the URLs written into your
output HTML:

- **`../` segments are clamped at the buffer root.** Previously a `../` that
  walked above the root was carried into the CDN URL and ate into the CDN base
  directory, so `http://cdn.com/cdnDir/` + `../../face.jpg` resolved to
  `http://cdn.com/face.jpg`. It now resolves to
  `http://cdn.com/cdnDir/face.jpg`. That escape contradicted the documented
  intent that the CDN base directory is always preserved.

- **Path segments are percent-encoded per the URL spec.** Non-ASCII characters
  are now escaped (`café.jpg` becomes `caf%C3%A9.jpg`), and characters the URL
  spec permits in a path are no longer escaped (`a|b.jpg` stays `a|b.jpg`
  instead of becoming `a%7Cb.jpg`). Browsers resolve both spellings identically,
  so this changes the bytes in your HTML rather than what they point at. Input
  that is already percent-encoded is passed through untouched.

One much smaller difference, for malformed input only: a backslash-prefixed URL
(`\face.jpg`) resolved against a relative CDN base used to keep a leading slash
and is now fully relative. Note that a backslash-prefixed URL still escapes the
CDN base directory, as it did before — the leading-slash guard doesn't recognize
a backslash as a path separator, though the URL spec does.

import path from "node:path";

/** Origin used to resolve path-only bases, which `new URL()` can't parse. */
const PLACEHOLDER_ORIGIN = "http://html-cdnify.invalid";

const SCHEME_PATTERN = /^[a-z][a-z0-9+\-.]*:/i;

function isLocalPath(filePath: string): boolean {
  return (
    typeof filePath === "string" &&
    filePath.length > 0 &&
    filePath.indexOf("//") === -1 &&
    filePath.indexOf("data:") !== 0
  );
}

/**
 * Resolve `relativeUrl` against `base`, the way the (deprecated) legacy
 * `url.resolve` did, but using the WHATWG URL API.
 *
 * `new URL()` only accepts a fully absolute base, so the two other base shapes
 * this package supports are resolved against a stand-in that is stripped back
 * off afterwards:
 *
 *   - protocol-relative (`//cdn.com/cdn/`) borrows a protocol
 *   - path-only (`someDir/`) borrows a whole origin
 */
function resolveUrl(base: string, relativeUrl: string): string {
  if (base.startsWith("//")) {
    return new URL(relativeUrl, `http:${base}`).href.slice("http:".length);
  } else if (SCHEME_PATTERN.test(base)) {
    return new URL(relativeUrl, base).href;
  } else {
    const absoluteBase = new URL(base, PLACEHOLDER_ORIGIN);
    const resolved = new URL(relativeUrl, absoluteBase).href.slice(
      PLACEHOLDER_ORIGIN.length,
    );
    // The placeholder origin makes everything look rooted at `/`. Only keep
    // that slash if it was already there before resolving.
    const isRooted = base.startsWith("/") || relativeUrl.startsWith("/");
    return isRooted ? resolved : resolved.slice(1);
  }
}

/**
 * Resolve oldUrl against pathOldUrlIsRelativeTo, and then prepend newUrlBase
 */
export default (
  newUrlBase: string,
  oldUrl: string,
  pathOldUrlIsRelativeTo?: string,
): string => {
  if (!isLocalPath(oldUrl)) {
    return oldUrl;
  } else {
    oldUrl = oldUrl.trim();
    let relativePath = ".";

    if (pathOldUrlIsRelativeTo) {
      const isDirAlready = pathOldUrlIsRelativeTo.endsWith("/");
      const fileDirName = isDirAlready
        ? pathOldUrlIsRelativeTo
        : path.dirname(pathOldUrlIsRelativeTo) + "/";
      relativePath = resolveUrl(fileDirName, oldUrl);
    } else {
      relativePath = oldUrl;
    }

    // When resolving against the CDN URL, we should always use a relative URL.
    //
    //   e.g. http://somecdn.com/cdn/ + /article/some.css => http://somecdn.com/cdn/article/some.css
    //     and *NOT*
    //        http://somecdn.com/cdn/ + /article/some.css => http://somecdn.com/article/some.css
    //
    if (relativePath.startsWith("/")) {
      relativePath = relativePath.slice(1);
    }

    if (!newUrlBase.endsWith("/")) {
      newUrlBase += "/";
    }

    return resolveUrl(newUrlBase, relativePath);
  }
};

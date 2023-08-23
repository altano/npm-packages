import url from "node:url";
import path from "node:path";

function isLocalPath(filePath: string): boolean {
  return (
    typeof filePath === "string" &&
    filePath.length > 0 &&
    filePath.indexOf("//") === -1 &&
    filePath.indexOf("data:") !== 0
  );
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
      relativePath = url.resolve(fileDirName, oldUrl);
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

    return url.resolve(newUrlBase, relativePath);
  }
};

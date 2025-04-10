export function getRelativeUrl(absoluteUrl: string): string {
  const url = new URL(absoluteUrl);
  return url.pathname;
}

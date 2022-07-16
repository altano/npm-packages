export function unquoteIfNecessary(str: string): string {
  if (str.startsWith(`"`) && str.endsWith(`"`)) {
    return str.slice(1, -1);
  }
  return str;
}

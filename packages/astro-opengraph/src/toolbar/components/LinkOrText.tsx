import type Preact from "preact";
import { ExternalLinkicon } from "./ExternalLinkicon.js";

type LinkOrTextType = Preact.JSX.Element | string | null;

export function LinkOrText({
  maybeLinkText,
}: {
  maybeLinkText: string | null;
}): LinkOrTextType {
  if (maybeLinkText == null) {
    return null;
  }
  // Only the parse goes in the try. Constructing JSX inside a try/catch doesn't
  // do what it looks like it does -- React renders the element later, so render
  // errors escape the catch (react-hooks/error-boundaries).
  let url: URL;
  try {
    url = new URL(maybeLinkText);
  } catch (_) {
    return maybeLinkText;
  }
  return (
    <a href={url.toString()} target="_blank">
      {maybeLinkText} <ExternalLinkicon width={10} height={10} fill="white" />
    </a>
  );
}

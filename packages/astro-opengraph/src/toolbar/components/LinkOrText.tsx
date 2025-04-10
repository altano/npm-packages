import type Preact from "preact";
import { ExternalLinkicon } from "./ExternalLinkicon.js";

type LinkOrTextType = Preact.JSX.Element | string | null;

export function LinkOrText({
  maybeLinkText,
}: {
  maybeLinkText: string | null;
}): LinkOrTextType {
  let parsedMaybeLink: LinkOrTextType = null;
  try {
    if (maybeLinkText != null) {
      const url = new URL(maybeLinkText);
      parsedMaybeLink = (
        <a href={url.toString()} target="_blank">
          {maybeLinkText}{" "}
          <ExternalLinkicon width={10} height={10} fill="white" />
        </a>
      );
    }
  } catch (_) {
    parsedMaybeLink = maybeLinkText;
  }
  return parsedMaybeLink;
}

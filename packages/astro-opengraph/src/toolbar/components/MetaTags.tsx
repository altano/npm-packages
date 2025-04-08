import type React from "react";
import { LinkOrText } from "./LinkOrText.js";
import { useMetaTagInfo, type MetaTagInfo } from "../hooks/useMetaTagInfo.js";

export function MetaTags(): React.JSX.Element {
  const tags = useMetaTagInfo();

  return (
    <dl
      data-testid="astro-opengraph-toolbar"
      style={{
        margin: 0,
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gap: 7,
        columnGap: 13,
      }}
    >
      {tags.map((tag) => (
        <MetaTagContent key={tag[1]} tag={tag} />
      ))}
    </dl>
  );
}

function MetaTagContent({ tag }: { tag: MetaTagInfo }): React.JSX.Element {
  const [content, property] = tag;
  return (
    <>
      <dt
        style={{
          color: "white",
          textAlign: "right",
          fontWeight: 500,
        }}
      >
        {property}
      </dt>
      <dd style={{ margin: 0 }}>
        <LinkOrText maybeLinkText={content} />
      </dd>
    </>
  );
}

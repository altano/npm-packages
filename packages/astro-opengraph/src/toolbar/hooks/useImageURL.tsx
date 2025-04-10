import { useState } from "preact/hooks";

export function useImageURL(): string {
  const imageUrl = useImageURLIfAvailable();
  if (imageUrl == null) {
    throw new Error(
      `Shouldn't be rendering this component without an image URL`,
    );
  }
  return imageUrl;
}

export function useImageURLIfAvailable(): string | null {
  const [imageUrlRef] = useState(() => {
    const meta = document.querySelector('meta[property="og:image"]');
    return meta?.getAttribute("content") ?? null;
  });
  return imageUrlRef;
}

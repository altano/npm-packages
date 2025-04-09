export function ZoomLabel({ imageSize }: { imageSize: number }): string {
  const formattedNumber = (imageSize / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  return `${formattedNumber}x`;
}

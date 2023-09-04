let interSemiBoldBuffer: ArrayBuffer;

export async function getInterSemiBold() {
  if (interSemiBoldBuffer == null) {
    interSemiBoldBuffer = await fetch(
      "https://rsms.me/inter/font-files/Inter-SemiBold.woff",
    ).then((res) => res.arrayBuffer());
  }

  return {
    name: "Inter",
    data: interSemiBoldBuffer,
    weight: 600,
  } as const;
}

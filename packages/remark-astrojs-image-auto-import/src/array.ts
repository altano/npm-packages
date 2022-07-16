export function extract<T, TExtracted extends T>(
  arr: T[],
  guard: (item: T) => item is TExtracted,
): [extracted: TExtracted | null, rest: T[]] {
  const extractedTest = arr.find(guard);
  if (extractedTest == null) {
    return [null, arr];
  }
  // A little wasteful but *shrug*
  const extractedIndex = arr.findIndex((i) => i === extractedTest);
  const rest = [
    ...arr.slice(0, extractedIndex),
    ...arr.slice(extractedIndex + 1),
  ];
  return [extractedTest, rest];
}

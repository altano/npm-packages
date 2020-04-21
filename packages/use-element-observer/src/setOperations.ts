/**
 * Return everything in setA that is not present in setB
 */
function setDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const notInB = (i: T): boolean => setB.has(i) === false;
  const differences = Array.from(setA).filter(notInB);
  return new Set(differences);
}

/**
 * Tuple of (1) added items and (2) removed items
 */
export type Differences<T> = [Set<T>, Set<T>];

/**
 * Return everything that must be added and removed to go from `previous` set to
 * `latest` set
 */
export function delta<T>(previous: Set<T>, latest: Set<T>): Differences<T> {
  const added = setDifference(latest, previous);
  const removed = setDifference(previous, latest);
  return [added, removed];
}

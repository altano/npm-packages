const formatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});
const divisions = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.3452381, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
] as const;
const allUnits = divisions.map((d) => d.unit);
type Unit = (typeof allUnits)[0];
const requestTime = Date.now();

export function getRelativeTime(
  date: Date,
  options: {
    smallestUnit: Unit;
  },
): string {
  const { smallestUnit = "seconds" } = options ?? {};
  let duration = (date.getTime() - requestTime) / 1000;
  let largeEnoughUnit = false;

  for (const division of divisions) {
    if (division.unit === smallestUnit) {
      largeEnoughUnit = true;
    }
    if (largeEnoughUnit && Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  throw new Error(`Could not format ${date}`);
}

export function getRelativeTimeInDaysOrLarger(date: Date): string {
  return getRelativeTime(date, { smallestUnit: "days" });
}

import {getRelativeTimeInDaysOrLarger} from "../utils/date";

export interface Props {
  date: string;
}

export default function DateTime({date: dateStr}: Props) {
  const date = new Date(dateStr);
  const relativeDate = getRelativeTimeInDaysOrLarger(date);
  const dateFormatted = new Intl.DateTimeFormat().format(date);
  return (
    <time className="created-date" title={dateFormatted} dateTime={dateStr}>
      {relativeDate}
    </time>
  );
}

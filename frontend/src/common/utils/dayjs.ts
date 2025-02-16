import dayjs from "dayjs";

export const getShortRelativeTime = (timestamp: string | Date) => {
  const now = dayjs();
  const time = dayjs(timestamp);
  const diffSeconds = now.diff(time, "seconds");

  if (diffSeconds < 60) return `${diffSeconds} s`;
  const diffMinutes = now.diff(time, "minutes");
  if (diffMinutes < 60) return `${diffMinutes} m`;
  const diffHours = now.diff(time, "hours");
  if (diffHours < 24) return `${diffHours} h`;
  const diffDays = now.diff(time, "days");
  if (diffDays < 7) return `${diffDays} d`;
  const diffWeeks = now.diff(time, "weeks");
  if (diffWeeks < 4) return `${diffWeeks} w`;
  const diffMonths = now.diff(time, "months");
  if (diffMonths < 12) return `${diffMonths} mo`;
  return `${now.diff(time, "years")} y`;
};

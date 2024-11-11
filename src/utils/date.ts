export const MELBOURNE_TIMEZONE = "Australia/Melbourne";

// function for relative time (e.g., "2 hours ago")
export function getRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat("en-AU", { numeric: "auto" });
  const now = new Date();
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000;
  const diffInMinutes = diffInSeconds / 60;
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (Math.abs(diffInDays) >= 1) {
    return rtf.format(Math.round(diffInDays), "day");
  }
  if (Math.abs(diffInHours) >= 1) {
    return rtf.format(Math.round(diffInHours), "hour");
  }
  if (Math.abs(diffInMinutes) >= 1) {
    return rtf.format(Math.round(diffInMinutes), "minute");
  }
  return rtf.format(Math.round(diffInSeconds), "second");
}

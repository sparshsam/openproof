// ── Time formatting and timezone localization ──

export function formatLocalTimestamp(isoTimestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(new Date(isoTimestamp));
}

/** Format timestamp in a specific timezone */
export function formatTimestampInTimezone(
  isoTimestamp: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: timezone,
    timeZoneName: "long",
  }).format(new Date(isoTimestamp));
}

/** Format timestamp for citation (ISO 8601 with timezone) */
export function formatTimestampCitation(isoTimestamp: string): string {
  const d = new Date(isoTimestamp);
  return d.toISOString().replace("T", " at ").replace("Z", " UTC");
}

/** Format timestamp as short date for header display */
export function formatShortDate(isoTimestamp: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoTimestamp));
}

/** Format a unix timestamp (seconds since epoch) */
export function formatUnixTimestamp(unixSeconds: number): string {
  return formatLocalTimestamp(new Date(unixSeconds * 1000).toISOString());
}

/** Get the user's IANA timezone (e.g. "America/New_York") */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/** Get UTC offset string (e.g. "UTC-5" or "UTC+2") */
export function getUtcOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const h = Math.floor(Math.abs(offset) / 60);
  const m = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `UTC${sign}${h}${m ? `:${m.toString().padStart(2, "0")}` : ""}`;
}

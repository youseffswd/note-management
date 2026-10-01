const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/** "just now", "5m ago", "3h ago", "2d ago", then a short date like "Sep 22". */
export function formatRelativeTime(
    value: Date | string,
    now: Date = new Date(),
): string {
    const date = new Date(value);
    const elapsed = now.getTime() - date.getTime();
    if (!Number.isFinite(elapsed)) return "";

    // Negative too: a timestamp slightly ahead of this device's clock.
    if (elapsed < MINUTE) return "just now";
    if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m ago`;
    if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h ago`;
    if (elapsed < WEEK) return `${Math.floor(elapsed / DAY)}d ago`;

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year:
            date.getFullYear() === now.getFullYear() ? undefined : "numeric",
    });
}

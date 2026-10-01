import { describe, expect, it } from "vitest";

import { formatRelativeTime } from "./relative-time";

const now = new Date("2026-09-30T12:00:00");
const ago = (ms: number) => new Date(now.getTime() - ms);

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

describe("formatRelativeTime", () => {
    it("says just now for the last minute and for future times", () => {
        expect(formatRelativeTime(ago(30_000), now)).toBe("just now");
        expect(formatRelativeTime(ago(-5 * MINUTE), now)).toBe("just now");
    });

    it("uses minutes, hours and days within a week", () => {
        expect(formatRelativeTime(ago(5 * MINUTE), now)).toBe("5m ago");
        expect(formatRelativeTime(ago(HOUR), now)).toBe("1h ago");
        expect(formatRelativeTime(ago(23 * HOUR), now)).toBe("23h ago");
        expect(formatRelativeTime(ago(3 * DAY), now)).toBe("3d ago");
    });

    it("falls back to a short date after a week", () => {
        const date = ago(8 * DAY);

        expect(formatRelativeTime(date, now)).toBe(
            date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            }),
        );
    });

    it("adds the year for another year", () => {
        const date = new Date("2025-03-01T12:00:00");

        expect(formatRelativeTime(date, now)).toContain("2025");
    });

    it("accepts ISO strings and ignores invalid dates", () => {
        expect(formatRelativeTime(ago(2 * HOUR).toISOString(), now)).toBe(
            "2h ago",
        );
        expect(formatRelativeTime("not a date", now)).toBe("");
    });
});

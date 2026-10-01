import type { TagColor } from "../types";

/** New tags take these in turn. */
export const TAG_COLORS: readonly TagColor[] = [
    "blue",
    "green",
    "amber",
    "purple",
    "red",
];

const tagColorClasses: Record<TagColor, { badge: string; dot: string }> = {
    blue: { badge: "bg-chart-1/15 text-blue-300", dot: "bg-chart-1" },
    green: { badge: "bg-chart-2/15 text-green-300", dot: "bg-chart-2" },
    amber: { badge: "bg-chart-3/15 text-amber-300", dot: "bg-chart-3" },
    purple: { badge: "bg-chart-5/15 text-violet-300", dot: "bg-chart-5" },
    red: { badge: "bg-chart-4/15 text-red-300", dot: "bg-chart-4" },
};

export function tagBadgeClass(color: TagColor): string {
    return (tagColorClasses[color] ?? tagColorClasses.blue).badge;
}

export function tagDotClass(color: TagColor): string {
    return (tagColorClasses[color] ?? tagColorClasses.blue).dot;
}

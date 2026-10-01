const folderColors: Record<string, string> = {
    "chart-1": "text-chart-1",
    "chart-2": "text-chart-2",
    "chart-3": "text-chart-3",
    "chart-4": "text-chart-4",
    "chart-5": "text-chart-5",
};

export function folderColorClass(colorClass: string): string {
    return folderColors[colorClass] || "text-foreground";
}

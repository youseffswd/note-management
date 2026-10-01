"use client";

import { cn } from "@/shared/lib/utils";
import type { Tag } from "../types";
import { tagChipClass } from "../utils/tag-chip-styles";
import { tagDotClass } from "../utils/tag-colors";

interface TagChipProps {
    tag: Tag;
    count: number;
    active: boolean;
    onClick: () => void;
}

export default function TagChip({ tag, count, active, onClick }: TagChipProps) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                tagChipClass,
                "cursor-pointer hover:border-muted-foreground/30 hover:bg-secondary hover:text-foreground",
                active && "border-primary/30 bg-accent text-primary hover:text-primary",
            )}
        >
            <span className={cn("size-1.75 rounded-full", tagDotClass(tag.color))} />
            {tag.name}
            <span
                className={cn(
                    "rounded-full bg-secondary px-1.75 text-[11px] text-muted-foreground",
                    active && "bg-primary/20 text-primary",
                )}
            >
                {count}
            </span>
        </button>
    );
}

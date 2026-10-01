import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import type { Tag } from "../types";
import { tagBadgeClass } from "../utils/tag-colors";

interface TagBadgeProps {
    tag: Tag;
    className?: string;
    /** Trailing content, e.g. a remove button. */
    children?: ReactNode;
}

export default function TagBadge({ tag, className, children }: TagBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
                tagBadgeClass(tag.color),
                className,
            )}
        >
            {tag.name}
            {children}
        </span>
    );
}

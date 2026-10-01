"use client";

import { StarIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useStarredStore } from "../store/starred.store";

interface StarButtonProps {
    noteId: string;
    size?: "icon" | "icon-xs";
    className?: string;
}

export default function StarButton({
    noteId,
    size = "icon",
    className,
}: StarButtonProps) {
    const starred = useStarredStore(state => Boolean(state.starredIds[noteId]));
    const toggleStar = useStarredStore(state => state.toggleStar);
    const label = starred ? "Unstar note" : "Star note";

    return (
        <Button
            variant="ghost"
            size={size}
            aria-pressed={starred}
            aria-label={label}
            title={label}
            onClick={() => toggleStar(noteId)}
            className={cn(
                "text-muted-foreground hover:text-foreground",
                starred && "text-chart-3 hover:bg-chart-3/15 hover:text-chart-3",
                className,
            )}
        >
            <StarIcon className={cn(starred && "fill-current")} />
        </Button>
    );
}

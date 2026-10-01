"use client";

import { cn } from "@/shared/lib/utils";

import { logOutAction } from "@/features/auth"
import { clearAllDrafts } from "@/features/nodes"
import { clearStarred } from "@/features/starred"
import { clearTags } from "@/features/tags"
import { browserStorage } from "@/shared/lib/browser-storage"
import { LEGACY_NOTE_META_KEY } from "@/shared/lib/migrate-note-meta"

type LogOutButtonProps = React.ComponentProps<"button">;

// Spreads the rest of the props so it can be used as a Radix `asChild` target (e.g. TooltipTrigger).
export default function LogOutButton({ className, children, onClick, ...props }: LogOutButtonProps) {
    const handleLogOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        // Drafts live in localStorage, which is shared by everyone who uses
        // this browser. Never leave them behind for the next person. The same
        // goes for stars and tags, which are kept on this device for now.
        clearAllDrafts();
        clearStarred();
        clearTags();
        browserStorage.removeItem(LEGACY_NOTE_META_KEY);
        await logOutAction();
    };

    return (
        <button type="button" {...props} onClick={handleLogOut} className={cn("cursor-pointer", className)}>
            {children}
        </button>
    );
}

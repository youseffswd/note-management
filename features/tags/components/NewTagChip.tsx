"use client";

import { useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { PlusIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { useTagsStore } from "../store/tags.store";
import { tagChipClass } from "../utils/tag-chip-styles";

/** A dashed "New tag" chip that turns into a name field. */
export default function NewTagChip() {
    const createTag = useTagsStore(state => state.createTag);
    const [editing, setEditing] = useState(false);

    if (!editing) {
        return (
            <button
                type="button"
                onClick={() => setEditing(true)}
                className={cn(
                    tagChipClass,
                    "cursor-pointer border-dashed opacity-70 hover:opacity-100 hover:text-foreground",
                )}
            >
                <PlusIcon className="size-3.5" />
                New tag
            </button>
        );
    }

    // Leaving the field is the single place a tag gets created: Enter blurs
    // it, and Escape empties it first so nothing is created.
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        createTag(event.currentTarget.value);
        setEditing(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === "Escape") event.currentTarget.value = "";
        if (event.key === "Enter" || event.key === "Escape") {
            event.preventDefault();
            event.currentTarget.blur();
        }
    };

    return (
        <input
            autoFocus
            aria-label="New tag name"
            placeholder="Tag name"
            maxLength={32}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
                tagChipClass,
                "w-40 border-ring/60 text-foreground outline-none placeholder:text-muted-foreground",
            )}
        />
    );
}

"use client";

import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import { PlusIcon } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import {
    findTagByName,
    normalizeTagName,
    useTagsStore,
} from "../store/tags.store";
import type { Tag } from "../types";
import { tagDotClass } from "../utils/tag-colors";
import TagOption from "./TagOption";

interface AddTagPopoverProps {
    noteId: string;
    tagIds: string[];
}

type TagChoice = { kind: "tag"; tag: Tag } | { kind: "create"; name: string };

/** Exact name first, then names starting with the query, then the rest. */
function matchRank(tag: Tag, query: string): number {
    const name = tag.name.toLowerCase();
    if (name === query) return 0;
    return name.startsWith(query) ? 1 : 2;
}

export default function AddTagPopover({ noteId, tagIds }: AddTagPopoverProps) {
    const tagsById = useTagsStore(state => state.tags);
    const createTag = useTagsStore(state => state.createTag);
    const addTagToNote = useTagsStore(state => state.addTagToNote);
    const listId = useId();

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const name = normalizeTagName(query);
    const lowerName = name.toLowerCase();
    const existing = name ? findTagByName(tagsById, name) : undefined;
    const alreadyAdded = existing !== undefined && tagIds.includes(existing.id);
    const available = Object.values(tagsById).filter(
        tag => !tagIds.includes(tag.id),
    );
    const matches = name
        ? available
              .filter(tag => tag.name.toLowerCase().includes(lowerName))
              .sort((a, b) => matchRank(a, lowerName) - matchRank(b, lowerName))
        : available;

    const choices: TagChoice[] = matches.map(tag => ({ kind: "tag", tag }));
    if (name && !existing) choices.push({ kind: "create", name });
    const active = Math.min(activeIndex, choices.length - 1);

    const choose = (choice: TagChoice) => {
        const tag = choice.kind === "tag" ? choice.tag : createTag(choice.name);
        if (!tag) return;
        addTagToNote(noteId, tag.id);
        // Stays open, so several tags can be added in a row.
        setQuery("");
        setActiveIndex(0);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) return;
        const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
        if (step !== undefined && choices.length > 0) {
            event.preventDefault();
            setActiveIndex((active + step + choices.length) % choices.length);
        } else if (event.key === "Enter") {
            event.preventDefault();
            // With the exact tag already on the note, a partial match must
            // not be picked in its place.
            if (!alreadyAdded && choices[active]) choose(choices[active]);
        }
    };

    const handleOpenChange = (next: boolean) => {
        setOpen(next);
        if (!next) {
            setQuery("");
            setActiveIndex(0);
        }
    };

    let hint: string | null = null;
    if (alreadyAdded) {
        hint = `"${existing.name}" is already on this note`;
    } else if (!name && available.length === 0) {
        hint = Object.keys(tagsById).length
            ? "Every tag is on this note"
            : "No tags yet. Type a name to create one.";
    }

    const optionId = (index: number) => `${listId}-${index}`;

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-full border border-dashed border-muted-foreground/40 bg-secondary px-2.5 py-0.5 text-[11.5px] font-medium text-muted-foreground transition hover:text-foreground cursor-pointer"
                >
                    <PlusIcon className="size-3" />
                    tag
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60 p-1.5">
                <input
                    value={query}
                    onChange={event => {
                        setQuery(event.target.value);
                        setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Find or create a tag…"
                    role="combobox"
                    aria-label="Tag name"
                    aria-expanded
                    aria-controls={listId}
                    aria-activedescendant={
                        choices.length > 0 ? optionId(active) : undefined
                    }
                    maxLength={32}
                    className="mb-1 h-8 w-full rounded-md border border-input bg-input/30 px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
                />
                <div
                    id={listId}
                    role="listbox"
                    aria-label="Tags"
                    className="flex max-h-56 flex-col overflow-y-auto"
                >
                    {choices.map((choice, index) => (
                        <TagOption
                            key={choice.kind === "tag" ? choice.tag.id : "create"}
                            id={optionId(index)}
                            active={index === active}
                            onClick={() => choose(choice)}
                            onHover={() => setActiveIndex(index)}
                        >
                            {choice.kind === "tag" ? (
                                <>
                                    <span
                                        className={cn(
                                            "size-2 shrink-0 rounded-full",
                                            tagDotClass(choice.tag.color),
                                        )}
                                    />
                                    <span className="truncate">
                                        {choice.tag.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="size-3.5 shrink-0" />
                                    <span className="truncate">
                                        Create &ldquo;{choice.name}&rdquo;
                                    </span>
                                </>
                            )}
                        </TagOption>
                    ))}
                </div>
                {hint && (
                    <p className="px-2 py-1.5 text-xs text-muted-foreground">
                        {hint}
                    </p>
                )}
            </PopoverContent>
        </Popover>
    );
}

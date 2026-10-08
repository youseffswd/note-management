"use client";

import { XIcon } from "lucide-react";

import { useNoteTagIds } from "../hooks/use-note-tag-ids";
import { useTagsStore } from "../store/tags.store";
import type { Tag } from "../types";
import AddTagPopover from "./AddTagPopover";
import TagBadge from "./TagBadge";

/** The note's tags, each removable, plus a picker to add or create more. */
export default function NoteTags({ noteId }: { noteId: string }) {
    const tagIds = useNoteTagIds(noteId);
    const tagsById = useTagsStore(state => state.tags);
    const removeTagFromNote = useTagsStore(
        state => state.removeTagFromNote,
    );

    const tags = tagIds
        .map(id => tagsById[id])
        .filter((tag): tag is Tag => tag !== undefined);

    return (
        <div className="flex flex-wrap items-center gap-1.5 px-13.5 pt-3">
            {tags.map(tag => (
                <TagBadge key={tag.id} tag={tag} className="pr-1">
                    <button
                        type="button"
                        aria-label={`Remove tag ${tag.name}`}
                        title="Remove tag"
                        onClick={() => removeTagFromNote(noteId, tag.id)}
                        className="rounded-full p-0.5 opacity-60 transition hover:bg-black/20 hover:opacity-100 cursor-pointer"
                    >
                        <XIcon className="size-3" />
                    </button>
                </TagBadge>
            ))}
            <AddTagPopover noteId={noteId} tagIds={tagIds} />
        </div>
    );
}

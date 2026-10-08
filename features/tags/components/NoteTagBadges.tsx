"use client";

import { useNoteTagIds } from "../hooks/use-note-tag-ids";
import { useTagsStore } from "../store/tags.store";
import type { Tag } from "../types";
import TagBadge from "./TagBadge";


interface NoteTagBadgesProps {
    noteId: string;
    maxTags?: number;
}

/** Read-only tags for note cards. The picker lives in NoteTags. */
export default function NoteTagBadges({ noteId, maxTags }: NoteTagBadgesProps) {
    const tagIds = useNoteTagIds(noteId);
    const tagsById = useTagsStore(state => state.tags);
    const tags = tagIds
        .map(id => tagsById[id])
        .filter((tag): tag is Tag => tag !== undefined)
        .slice(0, maxTags);

    return tags.map(tag => (
        <TagBadge
            key={tag.id}
            tag={tag}
            className="rounded-md px-2 text-[10.5px]"
        />
    ));
}

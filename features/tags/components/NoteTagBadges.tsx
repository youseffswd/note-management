"use client";

import { useTagsStore } from "../store/tags.store";
import type { Tag } from "../types";
import TagBadge from "./TagBadge";

const NO_TAG_IDS: string[] = [];

interface NoteTagBadgesProps {
    noteId: string;
    maxTags?: number;
}

/** Read-only tags for note cards. The picker lives in NoteTags. */
export default function NoteTagBadges({ noteId, maxTags }: NoteTagBadgesProps) {
    const tagIds = useTagsStore(state => state.noteTags[noteId] ?? NO_TAG_IDS);
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

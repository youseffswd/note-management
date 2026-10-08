"use client";

import { useMemo, useState } from "react";

import { Loader } from "@/shared/components/ui/loader";
import { NoteCard, notesByRecent, useNodeStore } from "@/features/nodes";
import { useTagsStore } from "../store/tags.store";
import NewTagChip from "./NewTagChip";
import NoteTagBadges from "./NoteTagBadges";
import TagChip from "./TagChip";

const plural = (count: number, word: string) =>
    `${count} ${word}${count === 1 ? "" : "s"}`;

export default function TagsView() {
    const initialized = useNodeStore(state => state.initialized);
    const nodesHash = useNodeStore(state => state.nodesHash);
    const tagsById = useTagsStore(state => state.tags);

    const [activeTagId, setActiveTagId] = useState<string | null>(null);

    const notes = useMemo(() => notesByRecent(nodesHash), [nodesHash]);
    // Counted from the notes that still exist, not every assignment made.
    const counts = useMemo(() => {
        const result: Record<string, number> = {};
        for (const note of notes) {
            for (const tagId of note.tagIds) {
                result[tagId] = (result[tagId] ?? 0) + 1;
            }
        }
        return result;
    }, [notes]);

    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-full min-h-125">
                <Loader />
            </div>
        );
    }

    const tags = Object.values(tagsById);
    const activeTag = activeTagId ? tagsById[activeTagId] : undefined;
    const visibleNotes = activeTag
        ? notes.filter(note => note.tagIds.includes(activeTag.id))
        : notes;

    return (
        <div className="w-full">
            <header className="mb-5">
                <h1 className="mb-1 text-lg font-semibold text-foreground">Tags</h1>
                <p className="text-[13px] text-muted-foreground">
                    {plural(tags.length, "tag")} · {plural(notes.length, "note")}
                </p>
            </header>

            <div className="mb-7 flex flex-wrap gap-2.5">
                {tags.map(tag => (
                    <TagChip
                        key={tag.id}
                        tag={tag}
                        count={counts[tag.id] ?? 0}
                        active={tag.id === activeTag?.id}
                        onClick={() =>
                            setActiveTagId(current =>
                                current === tag.id ? null : tag.id,
                            )
                        }
                    />
                ))}
                <NewTagChip />
            </div>

            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {activeTag ? `Notes tagged “${activeTag.name}”` : "All notes"}
            </h2>
            {visibleNotes.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {visibleNotes.map(note => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            metadata={<NoteTagBadges noteId={note.id} />}
                        />
                    ))}
                </div>
            ) : (
                <p className="py-10 text-center text-[13px] text-muted-foreground">
                    {activeTag ? "No notes with this tag yet." : "No notes yet."}
                </p>
            )}
        </div>
    );
}

"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";

import { Loader } from "@/shared/components/ui/loader";
import { NoteCard, notesByRecent, useNodeStore } from "@/features/nodes";
import { useStarredStore } from "../store/starred.store";
import StarButton from "./StarButton";
import StarredEmptyState from "./StarredEmptyState";

interface StarredNotesViewProps {
    renderMetadata?: (noteId: string) => ReactNode;
}

export default function StarredNotesView({ renderMetadata }: StarredNotesViewProps) {
    const initialized = useNodeStore(state => state.initialized);
    const nodesHash = useNodeStore(state => state.nodesHash);
    const starredIds = useStarredStore(state => state.starredIds);

    const notes = useMemo(
        () => notesByRecent(nodesHash).filter(note => starredIds[note.id]),
        [nodesHash, starredIds],
    );

    if (!initialized) {
        return (
            <div className="flex items-center justify-center h-full min-h-125">
                <Loader />
            </div>
        );
    }

    if (notes.length === 0) return <StarredEmptyState />;

    return (
        <div className="w-full">
            <header className="mb-5">
                <h1 className="mb-1 text-lg font-semibold text-foreground">
                    Starred Notes
                </h1>
                <p className="text-[13px] text-muted-foreground">
                    {notes.length} starred {notes.length === 1 ? "note" : "notes"}
                </p>
            </header>
            <div className="flex flex-col gap-2">
                {notes.map(note => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        actions={<StarButton noteId={note.id} size="icon-xs" />}
                        metadata={renderMetadata?.(note.id)}
                    />
                ))}
            </div>
        </div>
    );
}

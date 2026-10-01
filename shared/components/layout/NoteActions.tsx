"use client";

import { useNodeStore, useActiveNoteId } from "@/features/nodes";
import { StarButton } from "@/features/starred";

/** Header actions for the note open in the current route. */
export default function NoteActions() {
    const activeNoteId = useActiveNoteId();
    const isNote = useNodeStore(state =>
        activeNoteId ? state.nodesHash[activeNoteId]?.type === "note" : false,
    );

    if (!activeNoteId || !isNote) return null;

    return <StarButton noteId={activeNoteId} />;
}

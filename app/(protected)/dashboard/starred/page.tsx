"use client";

import { StarredNotesView } from "@/features/starred";
import { NoteTagBadges } from "@/features/tags";

export default function StarredPage() {
    return (
        <StarredNotesView
            renderMetadata={noteId => <NoteTagBadges noteId={noteId} maxTags={3} />}
        />
    );
}

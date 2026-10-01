"use client";

import { useParams } from "next/navigation";

/** The id of the note open in /dashboard/notes/[note], if any. */
export function useActiveNoteId(): string | undefined {
    const { note } = useParams<{ note?: string }>();
    return note;
}

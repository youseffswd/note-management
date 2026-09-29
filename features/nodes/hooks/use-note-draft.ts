import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import type { Note } from "../types";
import {
    clearDraft,
    serverBaseline,
    writeDraft,
    type DraftResolution,
    type NoteDraft,
} from "../utils/note-draft";
import { extractTitle } from "../utils/extract-title";

/** Local mirror, kept well ahead of the server save. */
const DRAFT_DEBOUNCE_MS = 150;
const DRAFT_DEBOUNCE_OPTIONS = {
    maxWait: 500,
};

interface UseNoteDraftOptions {
    note: Note;
    userId: string;
    editor: BlockNoteEditor;
    /** From loadDraftResolution, computed once before the editor was created. */
    resolution: DraftResolution;
}

/**
 * Mirrors the editor into a localStorage draft and owns the edit revision
 * counter the server save uses to know when a draft is safe to clear.
 */
export function useNoteDraft({
    note,
    userId,
    editor,
    resolution,
}: UseNoteDraftOptions) {
    const [conflict, setConflict] = useState<NoteDraft | null>(
        resolution.kind === "conflict" ? resolution.draft : null,
    );
    // Its own state, not a save status variant: the recovery save immediately
    // flips the status to "saving", which would hide the notice instantly.
    const [recovered, setRecovered] = useState(resolution.kind === "restore");

    // Refs, not state: these must not change the callbacks' identity.
    // useDebounceCallback rebuilds its timer whenever the callback changes,
    // which would orphan a pending write.
    const titleRef = useRef(note.title);
    const baselineRef = useRef(serverBaseline(note));
    const revRef = useRef(0);

    useEffect(() => {
        if (!recovered) return;
        const timer = setTimeout(() => setRecovered(false), 4000);
        return () => clearTimeout(timer);
    }, [recovered]);

    const writeDraftNow = useCallback(
        (content: PartialBlock[]) => {
            const title = extractTitle(content, titleRef.current);
            titleRef.current = title;
            writeDraft({
                noteId: note.id,
                userId,
                title,
                content,
                baseUpdatedAt: baselineRef.current,
                rev: revRef.current,
            });
        },
        [note.id, userId],
    );

    const scheduleDraft = useDebounceCallback(
        writeDraftNow,
        DRAFT_DEBOUNCE_MS,
        DRAFT_DEBOUNCE_OPTIONS,
    );

    const flushDraft = useCallback(() => {
        scheduleDraft.cancel();
        writeDraftNow(editor.document);
    }, [scheduleDraft, writeDraftNow, editor]);

    // Flush on unmount: the backstop if the server flush's request is lost.
    useEffect(() => {
        return () => flushDraft();
    }, [flushDraft]);

    // A synchronous localStorage write is the only thing guaranteed to finish
    // while the page is being torn down. beforeunload is not used: it does not
    // fire on a crash, an OS kill, or a mobile tab eviction.
    useEffect(() => {
        const onHide = () => {
            if (document.visibilityState === "hidden") flushDraft();
        };
        document.addEventListener("visibilitychange", onHide);
        window.addEventListener("pagehide", flushDraft);
        return () => {
            document.removeEventListener("visibilitychange", onHide);
            window.removeEventListener("pagehide", flushDraft);
        };
    }, [flushDraft]);

    /** Call on every editor change, before scheduling the server save. */
    const recordChange = useCallback(
        (content: PartialBlock[]) => {
            // Bumped synchronously so a save that resolves mid-keystroke
            // cannot clear the draft protecting what was just typed.
            revRef.current += 1;
            scheduleDraft(content);
        },
        [scheduleDraft],
    );

    const getRevision = useCallback(() => revRef.current, []);

    /** Called once the server holds everything up to `rev`. */
    const markPersisted = useCallback(
        (rev: number, saved: Note) => {
            // Advance the baseline to what was actually persisted, so the
            // next draft forks from the right version.
            const stamp = saved.updatedAt?.getTime();
            if (stamp !== undefined && Number.isFinite(stamp)) {
                baselineRef.current = stamp;
            }
            // Only clears if nothing was typed while the save was in flight.
            clearDraft(userId, note.id, rev);
        },
        [userId, note.id],
    );

    /** Loads the conflicting draft into the editor. Returns false if none. */
    const restoreConflict = useCallback(() => {
        if (!conflict) return false;
        setConflict(null);
        // A single undoable transaction; also fires onChange, which records
        // the change and schedules the server save.
        editor.replaceBlocks(editor.document, conflict.content);
        return true;
    }, [conflict, editor]);

    const discardConflict = useCallback(() => {
        setConflict(null);
        clearDraft(userId, note.id);
    }, [userId, note.id]);

    return {
        conflict,
        recovered,
        recordChange,
        getRevision,
        markPersisted,
        restoreConflict,
        discardConflict,
    };
}

import type { Block, BlockNoteEditor } from "@blocknote/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import type { Note } from "../types";
import { useNodeStore } from "../store/nodes.store";

const SERVER_DEBOUNCE_MS = 2000;
const SERVER_DEBOUNCE_OPTIONS = {
    maxWait: 5000,
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseNoteServerSaveOptions {
    note: Note;
    editor: BlockNoteEditor;
    /** The title field's current value, saved with the content. */
    getTitle: () => string;
    /** Current edit revision; a save is skipped if nothing changed since. */
    getRevision: () => number;
    /** Called after a successful save with the revision it covered. */
    onSaved: (rev: number, saved: Note) => void;
    /**
     * Save the editor's content once on mount. Needed after a silent draft
     * restore: initialContent fires no onChange, so the server would
     * otherwise stay stale indefinitely.
     */
    saveOnMount?: boolean;
}

/** Debounced autosave of the editor's content through the nodes store. */
export function useNoteServerSave({
    note,
    editor,
    getTitle,
    getRevision,
    onSaved,
    saveOnMount = false,
}: UseNoteServerSaveOptions) {
    const updateNote = useNodeStore(state => state.updateNote);

    const [status, setStatus] = useState<SaveStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Refs, not state: these must not change persistContent's identity.
    // useDebounceCallback rebuilds its timer whenever the callback changes,
    // which would orphan a pending save.
    const lastSavedRev = useRef(-1);
    const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (statusTimer.current) clearTimeout(statusTimer.current);
        };
    }, []);

    const markSaved = useCallback(() => {
        setStatus("saved");
        if (statusTimer.current) clearTimeout(statusTimer.current);
        statusTimer.current = setTimeout(() => setStatus("idle"), 3000);
    }, []);

    const persistContent = useCallback(
        async (newContent: Block[]) => {
            const revAtRequest = getRevision();
            if (revAtRequest <= lastSavedRev.current) return;

            try {
                setStatus("saving");
                setErrorMessage(null);

                // Blank means the user is still typing a new title: keep the
                // saved one until they leave the field, which fills one in.
                const title = getTitle().trim();
                const saved = await updateNote(
                    note.id,
                    title
                        ? { title, content: newContent }
                        : { content: newContent },
                );

                onSaved(revAtRequest, saved);
                markSaved();
                lastSavedRev.current = revAtRequest;
            } catch (err) {
                // The draft is deliberately left in place: it is now the only
                // copy of these edits.
                setStatus("error");

                if (typeof navigator !== "undefined" && !navigator.onLine) {
                    setErrorMessage("Offline. Saved on this device.");
                } else if (
                    err instanceof TypeError &&
                    err.message.includes("fetch")
                ) {
                    setErrorMessage("Network error. Saved on this device.");
                } else {
                    setErrorMessage(
                        err instanceof Error
                            ? err.message
                            : "An error occurred",
                    );
                }
            }
        },
        [note.id, updateNote, markSaved, getTitle, getRevision, onSaved],
    );

    const scheduleSave = useDebounceCallback(
        persistContent,
        SERVER_DEBOUNCE_MS,
        SERVER_DEBOUNCE_OPTIONS,
    );

    // Flush rather than cancel: cancelling discarded up to 2s of typing on
    // every navigation. The draft flush is the backstop if the request is lost.
    useEffect(() => {
        return () => {
            scheduleSave.flush();
        };
    }, [scheduleSave]);

    const didMountSave = useRef(false);
    useEffect(() => {
        if (!saveOnMount || didMountSave.current) return;
        // Deferred a tick so the save's first setState does not cascade a
        // render during mount. The flag is set inside the callback so a
        // cancelled run (StrictMode) does not swallow the save entirely.
        const timer = setTimeout(() => {
            didMountSave.current = true;
            void persistContent(editor.document);
        }, 0);
        return () => clearTimeout(timer);
    }, [saveOnMount, editor, persistContent]);

    return {
        status,
        errorMessage,
        scheduleSave,
        flushSave: scheduleSave.flush,
    };
}

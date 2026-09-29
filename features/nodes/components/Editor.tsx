"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import type { Block, PartialBlock } from "@blocknote/core";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Check, CloudOff, History } from "lucide-react";
import type { Note } from "../types";
import { useNodeStore } from "../store/nodes.store";
import { useDebounceCallback } from "usehooks-ts";
import {
    clearDraft,
    readDraft,
    resolveDraft,
    serverBaseline,
    writeDraft,
    type NoteDraft,
} from "../utils/note-draft";
import DraftBanner from "./DraftBanner";

/** Local mirror, kept well ahead of the server save. */
const DRAFT_DEBOUNCE_MS = 150;
const SERVER_DEBOUNCE_MS = 2000;
const DRAFT_DEBOUNCE_OPTIONS = {
    maxWait: 500,
};
const SERVER_DEBOUNCE_OPTIONS = {
    maxWait: 5000,
};


/** Best-effort title from the first block's first text run. */
function extractTitle(blocks: PartialBlock[], fallback: string): string {
    try {
        const first = blocks?.[0];
        if (!first || !Array.isArray(first.content)) return fallback;
        const run = first.content[0];
        if (run && typeof run === "object" && "text" in run) {
            const text = String(run.text).trim();
            if (text.length > 0) return text;
        }
    } catch {
        /* keep the fallback */
    }
    return fallback;
}

interface EditorProps {
    className: string;
    note: Note;
    userId: string;
}

export default function Editor({ className, note, userId }: EditorProps) {
    // Must run before useCreateBlockNote: initialContent is read exactly once.
    // Safe during render because EditorWrapper mounts this with ssr: false.
    const [resolution] = useState(() => {
        const draft = readDraft(userId, note.id);
        const resolved = resolveDraft(note, draft);
        if (draft && resolved.kind === "none") clearDraft(userId, note.id);
        return resolved;
    });

    const editor = useCreateBlockNote({
        initialContent:
            resolution.kind === "restore"
                ? resolution.draft.content
                : note.content,
    });

    const updateNote = useNodeStore(state => state.updateNote);
    const ensureNode = useNodeStore(state => state.ensureNode);

    const [conflict, setConflict] = useState<NoteDraft | null>(
        resolution.kind === "conflict" ? resolution.draft : null,
    );
    const [saveStatus, setSaveStatus] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Its own state, not a saveStatus variant: the recovery save immediately
    // flips saveStatus to "saving", which would hide the notice instantly.
    const [recovered, setRecovered] = useState(resolution.kind === "restore");

    // Refs, not state: these must not change persistContent's identity.
    // useDebounceCallback rebuilds its timer whenever the callback changes,
    // which would orphan a pending save.
    const noteRef = useRef(note);
    const titleRef = useRef(note.title);
    const baselineRef = useRef(serverBaseline(note));
    const revRef = useRef(0);
    const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const markSaved = useCallback(() => {
        setSaveStatus("saved");
        if (statusTimer.current) clearTimeout(statusTimer.current);
        statusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    }, []);

    useEffect(() => {
        noteRef.current = note;
    }, [note]);

    useEffect(() => {
        return () => {
            if (statusTimer.current) clearTimeout(statusTimer.current);
        };
    }, []);

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
    const lastSavedRev = useRef(-1);
    const persistContent = useCallback(
        async (newContent: Block[]) => {

            if (revRef.current <= lastSavedRev.current) return;
            // The hash is only populated by Explorer's effect; seeding here
            // keeps a save on a directly-loaded page from throwing.
            ensureNode(noteRef.current);

            const revAtRequest = revRef.current;
            try {
                setSaveStatus("saving");
                setErrorMessage(null);

                const title = extractTitle(newContent, titleRef.current);
                titleRef.current = title;

                const saved = await updateNote(note.id, {
                    title,
                    content: newContent,
                });

                // Advance the baseline to what was actually persisted, so the
                // next draft forks from the right version.
                const stamp = saved.updatedAt?.getTime();
                if (stamp !== undefined && Number.isFinite(stamp)) {
                    baselineRef.current = stamp;
                }

                // Only safe now, and only if nothing was typed meanwhile.
                clearDraft(userId, note.id, revAtRequest);
                markSaved();
                lastSavedRev.current = revAtRequest
            } catch (err) {
                // The draft is deliberately left in place: it is now the only
                // copy of these edits.
                setSaveStatus("error");

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
        [note.id, userId, updateNote, ensureNode, markSaved],
    );

    const saveContent = useDebounceCallback(
        persistContent,
        SERVER_DEBOUNCE_MS,
        SERVER_DEBOUNCE_OPTIONS,
    );

    // Flush rather than cancel: cancelling discarded up to 2s of typing on
    // every navigation. flushDraft is the backstop if the request is lost.
    useEffect(() => {
        return () => {
            flushDraft();
            saveContent.flush();
        };
    }, [flushDraft, saveContent]);

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

    // A silent restore fed the draft in through initialContent, which fires no
    // onChange — without this the server would stay stale indefinitely.
    const didRecoverySave = useRef(false);
    useEffect(() => {
        if (resolution.kind !== "restore" || didRecoverySave.current) return;
        // Deferred a tick so the save's first setState does not cascade a
        // render during mount. The flag is set inside the callback so a
        // cancelled run (StrictMode) does not swallow the save entirely.
        const timer = setTimeout(() => {
            didRecoverySave.current = true;
            void persistContent(editor.document);
        }, 0);
        return () => clearTimeout(timer);
    }, [resolution.kind, editor, persistContent]);

    const handleChange = useCallback(() => {
        const content = editor.document;
        // Bumped synchronously so a save that resolves mid-keystroke cannot
        // clear the draft protecting what was just typed.
        revRef.current += 1;
        scheduleDraft(content);
        saveContent(content); // debounce
      }, [editor, scheduleDraft, saveContent]);
      
      const handleRestoreConflict = useCallback(() => {
        if (!conflict) return;
        setConflict(null);
        // A single undoable transaction; also fires onChange, which schedules
        // the draft write and the server save.
        editor.replaceBlocks(editor.document, conflict.content);
        saveContent.flush();
    }, [conflict, editor, saveContent]);

    const handleDiscardConflict = useCallback(() => {
        setConflict(null);
        clearDraft(userId, note.id);
    }, [userId, note.id]);

    return (
        <div className="custom-editor-wrapper w-full relative">
            {conflict && (
                <DraftBanner
                    savedAt={conflict.savedAt}
                    onRestore={handleRestoreConflict}
                    onDiscard={handleDiscardConflict}
                />
            )}

            {/* Save Status Indicator */}
            <div className="absolute right-8 top-4 z-10 flex items-center gap-2 pointer-events-none transition-all">
                {recovered && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-md border border-emerald-500/20 backdrop-blur-sm shadow-sm">
                        <History className="w-3.5 h-3.5" />
                        <span>Recovered unsaved changes</span>
                    </div>
                )}
                {saveStatus === "saving" && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/70 px-2.5 py-1.5 rounded-md border border-border/50 backdrop-blur-sm shadow-sm">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                    </div>
                )}
                {saveStatus === "saved" && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1.5 rounded-md border border-emerald-500/20 backdrop-blur-sm shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                    </div>
                )}
                {saveStatus === "error" && (
                    <div
                        className="flex items-center gap-1.5 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-1.5 rounded-md border border-destructive/20 backdrop-blur-sm shadow-sm pointer-events-auto whitespace-nowrap"
                        title={errorMessage || "Failed to save"}
                    >
                        <CloudOff className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMessage || "Error saving"}</span>
                    </div>
                )}
            </div>

            <BlockNoteView
                onChange={handleChange}
                className={className}
                editor={editor}
            />
        </div>
    );
}

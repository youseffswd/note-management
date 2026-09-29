"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useState } from "react";
import { Loader2, Check, CloudOff, History } from "lucide-react";
import type { Note } from "../types";
import { loadDraftResolution } from "../utils/note-draft";
import { useNoteDraft } from "../hooks/use-note-draft";
import { useNoteServerSave } from "../hooks/use-note-server-save";
import DraftBanner from "./DraftBanner";

interface EditorProps {
    className: string;
    note: Note;
    userId: string;
}

export default function Editor({ className, note, userId }: EditorProps) {
    // Must run before useCreateBlockNote: initialContent is read exactly once.
    // Safe during render because EditorWrapper mounts this with ssr: false.
    const [resolution] = useState(() => loadDraftResolution(userId, note));

    const editor = useCreateBlockNote({
        initialContent:
            resolution.kind === "restore"
                ? resolution.draft.content
                : note.content,
    });

    // Declared before the server save so its unmount flush runs first.
    const {
        conflict,
        recovered,
        recordChange,
        getRevision,
        markPersisted,
        restoreConflict,
        discardConflict,
    } = useNoteDraft({ note, userId, editor, resolution });

    const {
        status: saveStatus,
        errorMessage,
        scheduleSave,
        flushSave,
    } = useNoteServerSave({
        note,
        editor,
        getRevision,
        onSaved: markPersisted,
        saveOnMount: resolution.kind === "restore",
    });

    const handleChange = useCallback(() => {
        const content = editor.document;
        recordChange(content);
        scheduleSave(content);
    }, [editor, recordChange, scheduleSave]);

    const handleRestoreConflict = useCallback(() => {
        if (restoreConflict()) flushSave();
    }, [restoreConflict, flushSave]);

    return (
        <div className="custom-editor-wrapper w-full relative">
            {conflict && (
                <DraftBanner
                    savedAt={conflict.savedAt}
                    onRestore={handleRestoreConflict}
                    onDiscard={discardConflict}
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

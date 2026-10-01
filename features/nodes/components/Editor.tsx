"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import type { PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, ReactNode } from "react";
import { Loader2, Check, CloudOff, History } from "lucide-react";
import type { Note } from "../types";
import { useNodeStore } from "../store/nodes.store";
import { loadDraftResolution } from "../utils/note-draft";
import { nextUntitledName } from "../utils/untitled-name";
import { useNoteDraft } from "../hooks/use-note-draft";
import { useNoteServerSave } from "../hooks/use-note-server-save";
import DraftBanner from "./DraftBanner";

interface EditorProps {
    className: string;
    note: Note;
    userId: string;
    /** Rendered between the title and the body. */
    meta?: ReactNode;
}

// BlockNote throws on an empty initialContent; undefined gives one empty paragraph.
function initialBlocks(content: PartialBlock[]): PartialBlock[] | undefined {
    return Array.isArray(content) && content.length > 0 ? content : undefined;
}

export default function Editor({ className, note, userId, meta }: EditorProps) {
    // Must run before useCreateBlockNote: initialContent is read exactly once.
    // Safe during render because EditorWrapper mounts this with ssr: false.
    const [resolution] = useState(() => loadDraftResolution(userId, note));

    const editor = useCreateBlockNote({
        initialContent: initialBlocks(
            resolution.kind === "restore"
                ? resolution.draft.content
                : note.content,
        ),
    });

    // The title is saved and backed up together with the body. The hooks read
    // it through this ref, so they always see the latest value.
    const [title, setTitle] = useState(
        () =>
            (resolution.kind === "restore" && resolution.draft.title) ||
            note.title,
    );
    const titleRef = useRef(title);
    const getTitle = useCallback(() => titleRef.current, []);
    const applyTitle = useCallback((value: string) => {
        titleRef.current = value;
        setTitle(value);
    }, []);

    // Declared before the server save so its unmount flush runs first.
    const {
        conflict,
        recovered,
        recordChange,
        getRevision,
        markPersisted,
        restoreConflict,
        discardConflict,
    } = useNoteDraft({ note, userId, editor, getTitle, resolution });

    const {
        status: saveStatus,
        errorMessage,
        scheduleSave,
        flushSave,
    } = useNoteServerSave({
        note,
        editor,
        getTitle,
        getRevision,
        onSaved: markPersisted,
        saveOnMount: resolution.kind === "restore",
    });

    // Records the whole note, title included, whichever part changed.
    const handleChange = useCallback(() => {
        const content = editor.document;
        recordChange(content);
        scheduleSave(content);
    }, [editor, recordChange, scheduleSave]);

    const handleRestoreConflict = useCallback(() => {
        if (!conflict) return;
        if (conflict.title) applyTitle(conflict.title);
        if (!restoreConflict()) return;
        // Also covers a draft that differs only in its title, which changes
        // no blocks and so fires no onChange.
        handleChange();
        flushSave();
    }, [conflict, applyTitle, restoreConflict, handleChange, flushSave]);

    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        // A title is one line; pasted line breaks become spaces.
        applyTitle(event.target.value.replace(/\s*\n+\s*/g, "."));
        handleChange();
    };

    // Leaving the field settles the title: trimmed, or an untitled name if it
    // was left blank. Then saves right away rather than after the debounce.
    const commitTitle = () => {
        const committed =
            titleRef.current.trim() ||
            nextUntitledName(useNodeStore.getState().nodesHash, {
                type: "note",
                parentId: note.parentId,
                excludeId: note.id,
            });
        if (committed !== titleRef.current) {
            applyTitle(committed);
            handleChange();
        }
        flushSave();
    };

    const handleTitleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
        event.preventDefault();
        // Continue into the body, like Enter at the end of a heading.
        editor.setTextCursorPosition(editor.document[0], "start");
        editor.focus();
    };

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

            {/* Padded like BlockNote's blocks, so the title lines up with the body text. */}
            <div className="px-13.5 pt-14">
                <textarea
                    value={title}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleKeyDown}
                    onBlur={commitTitle}
                    rows={1}
                    placeholder="Untitled Note"
                    aria-label="Note title"
                    className="block w-full resize-none overflow-hidden bg-transparent text-3xl font-bold leading-tight tracking-tight text-foreground outline-none field-sizing-content placeholder:text-muted-foreground/50"
                />
            </div>

            {meta}

            <BlockNoteView
                onChange={handleChange}
                className={className}
                editor={editor}
            />
        </div>
    );
}

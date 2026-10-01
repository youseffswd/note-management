"use client";

import { useRef } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { FileIcon, FolderIcon } from "lucide-react";

import { useNodeStore } from "../store/nodes.store";
import { useExplorerStore, type PendingNode } from "../store/explorer.store";
import { createEmptyFolder } from "../utils/create-empty-folder";
import { createEmptyNote } from "../utils/create-empty-note";
import { nextUntitledName } from "../utils/untitled-name";

/**
 * Inline name field for a note or folder that does not exist yet. Enter or
 * leaving the field creates it, named "Untitled Note" / "Untitled Folder"
 * (numbered when taken) if left blank. Escape cancels.
 */
export default function NewNodeInput({ type, parentId }: PendingNode) {
    const router = useRouter();
    const addNote = useNodeStore(state => state.addNote);
    const addFolder = useNodeStore(state => state.addFolder);
    const stopCreating = useExplorerStore(state => state.stopCreating);
    // Shown as the placeholder, so a blank name holds no surprise.
    const untitledName = useNodeStore(state =>
        nextUntitledName(state.nodesHash, { type, parentId }),
    );

    // Enter creates and then unmounts the field, which can also fire blur.
    const settledRef = useRef(false);

    const create = async (value: string) => {
        if (settledRef.current) return;
        settledRef.current = true;
        stopCreating();

        const name = value.trim() || untitledName;
        if (type === "folder") {
            await addFolder(createEmptyFolder(name, parentId));
            return;
        }

        const note = createEmptyNote(name, parentId);
        // Awaited so the editor's first save cannot reach the server before
        // the note exists there.
        await addNote(note);
        // addNote rolls back when the server refuses it.
        if (useNodeStore.getState().nodesHash[note.id]) {
            router.push(`/dashboard/notes/${note.id}`);
        }
    };

    const cancel = () => {
        if (settledRef.current) return;
        settledRef.current = true;
        stopCreating();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === "Enter") {
            event.preventDefault();
            void create(event.currentTarget.value);
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        void create(event.currentTarget.value);
    };

    return (
        <div
            className={`flex h-7 items-center rounded-md bg-accent px-2.5 text-[0.8rem] ring-1 ring-ring/50 ${type === "folder" ? "gap-1" : "gap-2"}`}
        >
            {type === "folder" ? (
                <>
                    {/* Lines the icon up with the folders' chevrons. */}
                    <span className="size-3.5 shrink-0" />
                    <FolderIcon className="size-3.5 shrink-0 text-muted-foreground fill-current" />
                </>
            ) : (
                <FileIcon className="size-3.5 shrink-0 text-amber-500" />
            )}
            <input
                autoFocus
                aria-label={type === "folder" ? "New folder name" : "New note name"}
                placeholder={untitledName}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="min-w-0 flex-1 bg-transparent text-accent-foreground outline-none placeholder:text-muted-foreground"
            />
        </div>
    );
}

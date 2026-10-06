"use client";

import { useEffect, useRef } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { FileIcon, FolderIcon } from "lucide-react";

import {
    createEmptyFolder,
    createEmptyNote,
    folderColorClass,
    nextUntitledName,
    useNodeStore,
} from "@/features/nodes";
import type { Node } from "@/features/nodes";
import { useExplorerStore } from "../store/explorer.store";

type NodeInputProps =
    | { mode: "create"; type: Node["type"]; parentId: string | null }
    | { mode: "rename"; node: Node };

/**
 * Inline name field for a note or folder, in one of two modes:
 * - create: the node does not exist yet. Enter or leaving the field creates
 *   it, named "Untitled Note" / "Untitled Folder" (numbered when taken) if
 *   left blank. Escape cancels.
 * - rename: replaces the node's row. Enter or leaving the field saves; a
 *   blank or unchanged name and Escape keep the current name.
 */
export default function NodeInput(props: NodeInputProps) {
    const router = useRouter();
    const addNote = useNodeStore(state => state.addNote);
    const addFolder = useNodeStore(state => state.addFolder);
    const updateNote = useNodeStore(state => state.updateNote);
    const updateFolder = useNodeStore(state => state.updateFolder);
    const stopCreating = useExplorerStore(state => state.stopCreating);
    const stopRenaming = useExplorerStore(state => state.stopRenaming);
    const inputRef = useRef<HTMLInputElement>(null);

    const isRename = props.mode === "rename";
    const type = isRename ? props.node.type : props.type;
    const parentId = isRename ? props.node.parentId : props.parentId;
    const currentName = isRename
        ? props.node.type === "note"
            ? props.node.title
            : props.node.name
        : "";
    const colorClass =
        isRename && props.node.type === "folder"
            ? folderColorClass(props.node.colorClass)
            : "text-muted-foreground";

    // Shown as the placeholder, so a blank name holds no surprise.
    const untitledName = useNodeStore(state =>
        nextUntitledName(state.nodesHash, { type, parentId }),
    );

    // Enter settles and then unmounts the field, which can also fire blur.
    const settledRef = useRef(false);

    // Renaming starts with the current name selected, ready to be replaced.
    useEffect(() => {
        if (!isRename) return;
        inputRef.current?.focus();
        inputRef.current?.select();
    }, [isRename]);

    const create = async (value: string) => {
        if (props.mode !== "create") return;
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

    const rename = async (value: string) => {
        if (props.mode !== "rename") return;
        stopRenaming();

        const name = value.trim();
        if (!name || name === currentName) return;

        try {
            if (props.node.type === "folder") {
                // The tree's copy carries its children; the store keeps none.
                await updateFolder({ ...props.node, name, children: [] });
            } else {
                await updateNote(props.node.id, { title: name });
            }
        } catch (error) {
            console.error(`Error renaming ${type}:`, error);
        }
    };

    const commit = (value: string) => {
        if (settledRef.current) return;
        settledRef.current = true;
        void (isRename ? rename(value) : create(value));
    };

    const cancel = () => {
        if (settledRef.current) return;
        settledRef.current = true;
        if (isRename) stopRenaming();
        else stopCreating();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === "Enter") {
            event.preventDefault();
            commit(event.currentTarget.value);
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        commit(event.currentTarget.value);
    };

    const label = `${isRename ? "" : "New "}${type === "folder" ? "folder" : "note"} name`;

    return (
        <div
            className={`flex h-7 items-center rounded-md bg-accent px-2.5 text-[0.8rem] ring-1 ring-ring/50 ${type === "folder" ? "gap-1" : "gap-2"}`}
        >
            {type === "folder" ? (
                <>
                    {/* Lines the icon up with the folders' chevrons. */}
                    <span className="size-3.5 shrink-0" />
                    <FolderIcon
                        className={`size-3.5 shrink-0 fill-current ${colorClass}`}
                    />
                </>
            ) : (
                <FileIcon className="size-3.5 shrink-0 text-amber-500" />
            )}
            <input
                ref={inputRef}
                // Creating focuses on mount; renaming also selects, above.
                autoFocus={!isRename}
                defaultValue={currentName}
                aria-label={label.charAt(0).toUpperCase() + label.slice(1)}
                placeholder={isRename ? undefined : untitledName}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className="min-w-0 flex-1 bg-transparent text-accent-foreground outline-none placeholder:text-muted-foreground"
            />
        </div>
    );
}

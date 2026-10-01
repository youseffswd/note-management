"use client";

import { Button } from "@/shared/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronRightIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import NoteItem from "./NoteItem";
import ExplorerContextMenu from "./ExplorerContextMenu";
import type { Folder } from "../types";
import { useNodeStore } from "../store/nodes.store";
import { useActiveNoteId } from "../hooks/use-active-note-id";
import { folderColorClass } from "../utils/folder-colors";
import { isAncestorOf } from "../utils/folder-path";

interface FolderItemProps {
    folder: Folder;
}

export default function FolderItem({ folder }: FolderItemProps) {
    const removeFolder = useNodeStore(state => state.removeFolder);
    const activeNoteId = useActiveNoteId();
    const containsActiveNote = useNodeStore(state =>
        activeNoteId
            ? isAncestorOf(state.nodesHash, folder.id, activeNoteId)
            : false,
    );

    // Starts open on the active note's path, so a reload reveals it, and
    // opens again whenever navigation moves the active note inside it.
    // Adjusted during render rather than in an effect, to avoid a closed frame.
    const [open, setOpen] = useState(containsActiveNote);
    const [prevContainsActiveNote, setPrevContainsActiveNote] =
        useState(containsActiveNote);
    if (containsActiveNote !== prevContainsActiveNote) {
        setPrevContainsActiveNote(containsActiveNote);
        if (containsActiveNote) setOpen(true);
    }

    const handleCreateNote = () => {};

    const handleCreateFolder = () => {};

    const handleRename = () => {};

    const handleDelete = async () => {
        try {
            await removeFolder(folder.id);
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <ExplorerContextMenu
                target="folder"
                onCreateNote={handleCreateNote}
                onCreateFolder={handleCreateFolder}
                onRename={handleRename}
                onDelete={handleDelete}
            >
                {/* Wrapper keeps the menu's data-state off the collapsible trigger */}
                <div className="rounded-md data-[state=open]:bg-accent">
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="group w-full justify-start transition hover:bg-accent! hover:text-accent-foreground"
                        >
                            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                            <FolderIcon
                                className={`${folderColorClass(folder.colorClass)} fill-current`}
                            />
                            {folder.name}
                            <span className="ml-auto text-xs">
                                {folder.children.length}
                            </span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </ExplorerContextMenu>
            <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
                <div className="flex flex-col gap-1">
                    {folder.children.map(child =>
                        child.type === "folder" ? (
                            <FolderItem key={child.id} folder={child} />
                        ) : (
                            <NoteItem key={child.id} note={child} />
                        ),
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

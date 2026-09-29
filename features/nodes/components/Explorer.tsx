"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

import { SidebarHeader } from "@/shared/components/ui/sidebar";
import { useNodeStore } from "../store/nodes.store";
import type { Folder, Note } from "../types";
import { buildTree } from "../utils/tree-build";
import { createEmptyNote } from "../utils/create-empty-note";
import { createEmptyFolder } from "../utils/create-empty-folder";
import ExplorerActions from "./ExplorerActions";
import ExplorerSearch from "./ExplorerSearch";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";

interface ExplorerProps {
    notes: Note[];
    folders: Folder[];
}

const Explorer = ({ notes, folders }: ExplorerProps) => {
    const router = useRouter();

    const initilizeNoteStore = useNodeStore(state => state.initilizeNoteStore);
    const nodesHash = useNodeStore(state => state.nodesHash);
    const addNote = useNodeStore(state => state.addNote);
    const addFolder = useNodeStore(state => state.addFolder);

    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSetSearchQuery = useDebounceCallback(setSearchQuery, 300);

    useEffect(() => {
        initilizeNoteStore(folders, notes);
    }, [initilizeNoteStore, folders, notes]);

    const rootNodes = useMemo(() => buildTree(nodesHash), [nodesHash]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;

        const query = searchQuery.toLowerCase();
        return Object.values(nodesHash).filter(
            (node): node is Note =>
                node.type === "note" &&
                node.title.toLowerCase().includes(query),
        );
    }, [searchQuery, nodesHash]);
    const visibleNodes = searchResults ?? rootNodes;
    const hasNoSearchResults = searchResults !== null && searchResults.length === 0;

    const handleCreateNote = async () => {
        const newNote = createEmptyNote();
        await addNote(newNote);
        router.push(`/dashboard/notes/${newNote.id}`);
    };

    const handleCreateFolder = async () => {
        await addFolder(createEmptyFolder());
    };

    return (
        <>
            <SidebarHeader className="p-4 border-b border-sidebar-border flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold text-sidebar-foreground/70 tracking-wider uppercase">
                        Explorer
                    </h2>
                    <ExplorerActions
                        addNote={handleCreateNote}
                        addFolder={handleCreateFolder}
                    />
                </div>
                <ExplorerSearch setSearchQuery={debouncedSetSearchQuery} />
            </SidebarHeader>
            <div className="flex flex-col gap-1 p-2">
                {hasNoSearchResults ? (
                    <div className="px-4 text-sm text-muted-foreground text-center py-4">
                        No notes found
                    </div>
                ) : (
                    visibleNodes.map(node =>
                        node.type === "folder" ? (
                            <FolderItem key={node.id} folder={node} />
                        ) : (
                            <NoteItem key={node.id} note={node} />
                        ),
                    )
                )}
            </div>
        </>
    );
};

export default Explorer;

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

import { SidebarHeader } from "@/shared/components/ui/sidebar";
import { useNodeStore } from "../store/nodes.store";
import type { Note } from "../types";
import { buildTree } from "../utils/tree-build";
import { createEmptyNote } from "../utils/create-empty-note";
import { createEmptyFolder } from "../utils/create-empty-folder";
import ExplorerActions from "./ExplorerActions";
import ExplorerContextMenu from "./ExplorerContextMenu";
import ExplorerSearch from "./ExplorerSearch";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";

const Explorer = () => {
    const router = useRouter();

    const nodesHash = useNodeStore(state => state.nodesHash);
    const addNote = useNodeStore(state => state.addNote);
    const addFolder = useNodeStore(state => state.addFolder);

    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSetSearchQuery = useDebounceCallback(setSearchQuery, 300);

    const {roots: rootNodes} = useMemo(() => buildTree(nodesHash), [nodesHash]);

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
            <ExplorerContextMenu
                target="blank"
                onCreateNote={handleCreateNote}
                onCreateFolder={handleCreateFolder}
            >
                <div className="flex flex-1 flex-col gap-1 p-2 pb-52">
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
            </ExplorerContextMenu>
        </>
    );
};

export default Explorer;

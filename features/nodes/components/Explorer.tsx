"use client";

import useNodeStore from "@/features/nodes/store/nodes.store";
import { useEffect, useState, useMemo } from "react";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import { SidebarHeader } from "@/shared/components/ui/sidebar";
import { Folder, Note } from "@/shared/types";
import ExplorerSearch from "./ExplorerSearch";

interface ExplorerProps {
  notes: Note[]
  folders: Folder[]
}

const Explorer = ({notes,folders}: ExplorerProps) => {
    const initilizeNoteStore = useNodeStore(state => state.initilizeNoteStore);
    const rootNodes = useNodeStore(state => state.nodes);
    const nodesHash = useNodeStore(state => state.nodesHash);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        initilizeNoteStore(folders, notes); // this is for initilization
    }, [initilizeNoteStore,folders,notes]);
   
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return null;
        
        const query = searchQuery.toLowerCase();
        return Object.values(nodesHash).filter(node => 
            node.type === "note" && node.title.toLowerCase().includes(query)
        ) as Note[];
    }, [searchQuery, nodesHash]);

    return (
        <>
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                <h2 className="text-xs font-bold text-sidebar-foreground/70 tracking-wider uppercase mb-2">
                    Explorer
                </h2>
                <ExplorerSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </SidebarHeader>
            <div className="flex flex-col gap-1 p-2">
                {searchResults ? (
                    searchResults.length > 0 ? (
                        searchResults.map(note => (
                            <NoteItem key={note.id} note={note} />
                        ))
                    ) : (
                        <div className="px-4 text-sm text-muted-foreground text-center py-4">
                            No notes found
                        </div>
                    )
                ) : (
                    rootNodes.map(node =>
                        node.type === "folder" ? (
                            <FolderItem key={node.id} folder={node} />
                        ) : (
                            <NoteItem key={node.id} note={node} />
                        )
                    )
                )}
            </div>
        </>
    );
};

export default Explorer;

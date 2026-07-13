"use client";

import useNoteStore from "@/features/nodes/store/nodes.store";
import { useEffect } from "react";
import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import { SidebarHeader } from "@/shared/components/ui/sidebar";

const Explorer = () => {
    const initilizeNoteStore = useNoteStore(state => state.initilizeNoteStore);
    const rootNodes = useNoteStore(state => state.nodes);

    useEffect(() => {
        initilizeNoteStore();
    }, [initilizeNoteStore]);

    return (
        <>
            <SidebarHeader className="p-4 border-b border-sidebar-border">
                <h2 className="text-xs font-bold text-sidebar-foreground/70 tracking-wider uppercase">
                    Explorer
                </h2>
            </SidebarHeader>
            <div className="flex flex-col gap-1">
                {rootNodes.map(node =>
                    node.type === "folder" ? (
                        <FolderItem key={node.id} folder={node} />
                    ) : (
                        <NoteItem key={node.id} note={node} />
                    ),
                )}
            </div>
        </>
    );
};

export default Explorer;

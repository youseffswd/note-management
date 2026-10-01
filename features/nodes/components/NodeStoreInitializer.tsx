"use client";

import { useEffect } from "react";
import { useNodeStore } from "../store/nodes.store";
import type { Folder, Note } from "../types";

interface NodeStoreInitializerProps {
    folders: Folder[];
    notes: Note[];
}

// Lives in the always-mounted app layout, not in Explorer: on mobile the
// sidebar is a sheet that unmounts when closed, so Explorer would leave the
// store empty until opened, then overwrite this session's edits with the
// layout's stale snapshot every time it reopened.
export default function NodeStoreInitializer({
    folders,
    notes,
}: NodeStoreInitializerProps) {
    const initilizeNoteStore = useNodeStore(state => state.initilizeNoteStore);

    useEffect(() => {
        initilizeNoteStore(folders, notes);
    }, [initilizeNoteStore, folders, notes]);

    return null;
}

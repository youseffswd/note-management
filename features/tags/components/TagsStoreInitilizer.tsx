"use client";

import { useEffect } from "react";
import { useTagsStore } from "../store/tags.store";
import type { Tag } from "../types";

interface TagsStoreInitializerProps {
    tags: Tag[];
}

// Lives in the always-mounted protected layout, not in Explorer: on mobile the
// sidebar is a sheet that unmounts when closed, so Explorer would leave the
// store empty until opened, then overwrite this session's edits with the
// layout's stale snapshot every time it reopened.
// Which notes have which tags comes with the notes (`note.tagIds`).
export default function TagsStoreInitializer({
    tags,
}: TagsStoreInitializerProps) {
    const initilizeStore = useTagsStore(state => state.initilizeStore);

    useEffect(() => {
        initilizeStore(tags);
    }, [initilizeStore, tags]);

    return null;
}

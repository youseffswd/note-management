"use client";

import { useState } from "react";
import { previewNotes } from "../data/preview-notes";

function toggleItem(items: string[], id: string) {
    return items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id];
}

export function useWorkspacePreview() {
    const [activeId, setActiveId] = useState(previewNotes[0].id);
    const [query, setQuery] = useState("");
    const [starred, setStarred] = useState<string[]>([previewNotes[0].id]);
    const [starredOnly, setStarredOnly] = useState(false);
    const [checked, setChecked] = useState<string[]>([
        "week-0",
        "ideas-0",
        "learning-0",
    ]);
    const activeNote =
        previewNotes.find((note) => note.id === activeId) ?? previewNotes[0];
    const search = query.trim().toLowerCase();
    const visibleNotes = previewNotes.filter(
        (note) =>
            `${note.title} ${note.folder} ${note.tag}`
                .toLowerCase()
                .includes(search) &&
            (!starredOnly || starred.includes(note.id)),
    );

    return {
        activeNote,
        visibleNotes,
        query,
        starredOnly,
        starredCount: starred.length,
        totalNotes: previewNotes.length,
        isStarred: starred.includes(activeId),
        checked,
        setQuery,
        setStarredOnly,
        selectNote: setActiveId,
        toggleStar: () =>
            setStarred((current) => toggleItem(current, activeId)),
        toggleTask: (taskId: string) =>
            setChecked((current) => toggleItem(current, taskId)),
    };
}

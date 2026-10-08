import { useNodeStore } from "@/features/nodes";

// Stable fallback so the selector does not return a new array every render.
const NO_TAG_IDS: string[] = [];

/** The ids of the tags on a note, in the order they were added. */
export function useNoteTagIds(noteId: string): string[] {
    return useNodeStore(state => {
        const node = state.nodesHash[noteId];
        return node?.type === "note" ? node.tagIds : NO_TAG_IDS;
    });
}

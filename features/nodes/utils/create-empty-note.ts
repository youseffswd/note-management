import { v4 as uuidv4 } from "uuid";
import type { Note } from "../types";

export function createEmptyNote(
    title: string,
    parentId: string | null = null,
): Note {
    return {
        id: uuidv4(),
        title,
        // The title is its own field, so the body starts empty.
        content: [
            {
                type: "paragraph",
                content: [],
            },
        ],
        type: "note",
        createdAt: new Date(),
        parentId,
    };
}

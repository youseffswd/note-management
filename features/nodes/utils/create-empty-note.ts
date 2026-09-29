import { v4 as uuidv4 } from "uuid";
import type { Note } from "../types";

export function createEmptyNote(): Note {
    return {
        id: uuidv4(),
        title: "Untitled",
        content: [
            {
                type: "heading",
                props: { level: 1 },
                content: [
                    {
                        type: "text",
                        text: "Untitled Note",
                        styles: {},
                    },
                ],
            },
            {
                type: "paragraph",
                content: [],
            },
        ],
        type: "note",
        createdAt: new Date(),
        parentId: null,
    };
}

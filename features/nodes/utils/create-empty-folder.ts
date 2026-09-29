import { v4 as uuidv4 } from "uuid";
import type { Folder } from "../types";

const FOLDER_COLOR_CLASSES = [
    "chart-1",
    "chart-2",
    "chart-3",
    "chart-4",
    "chart-5",
];

export function createEmptyFolder(): Folder {
    return {
        id: uuidv4(),
        name: "Untitled Folder",
        parentId: null,
        children: [],
        createdAt: new Date(),
        type: "folder",
        colorClass:
            FOLDER_COLOR_CLASSES[
                Math.floor(Math.random() * FOLDER_COLOR_CLASSES.length)
            ],
    };
}

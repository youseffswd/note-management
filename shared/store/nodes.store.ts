import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Note, Folder } from "@/shared/types";
import { devtools } from "zustand/middleware";

type Node = Folder | Note;

interface NodeStore {
    nodes: Node[];
    nodesHash: Record<string, Node>;

    initilizeNoteStore: (folders: Folder[], notes: Note[]) => Promise<void>;
    addNote: (note: Note) => void;
    addFolder: (folder: Folder) => void;
    removeNote: (noteId: string) => void;
    removeFolder: (folderId: string) => void;
    updateNote: (note: Note) => void;
    updateFolder: (folder: Folder) => void;
}

export const useNodeStore = create<NodeStore>()(
    devtools(
        immer(set => ({
            nodes: [],
            nodesHash: {},

            initilizeNoteStore: async (folders: Folder[], notes: Note[]) => {
                const allNodes = [...folders, ...notes].sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                );
                const nodesHash = allNodes.reduce(
                    (acc, node) => {
                        acc[node.id] = node;
                        return acc;
                    },
                    {} as Record<string, Node>,
                );
                const nestedNodes = allNodes.filter(node => !node.parentId);
                for (const node of allNodes) {
                    if (!node.parentId) continue;
                    const parentNode = nodesHash[node.parentId];
                    if ("children" in parentNode) {
                        parentNode.children.push(node);
                    }
                }
                set({ nodes: nestedNodes, nodesHash });
            },
        })),

    )
);


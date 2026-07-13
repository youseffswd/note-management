import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Note, Folder } from "@/shared/types";

type Node = Folder | Note;

interface NoteStore {
    nodes: Node[];
    nodesHash: Record<string, Node>;
    loading: boolean;
    initilizeNoteStore: () => void;
}

const useNoteStore = create<NoteStore>()(
    immer((set) => ({
        nodes: [],
        nodesHash: {},
        loading: false,
        initilizeNoteStore: async () => {
            set({ loading: true });
            const [foldersRes, notesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/folders`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`)
            ])
            if (!foldersRes.ok || !notesRes.ok) {
                set({ loading: false });
                throw new Error("Failed to fetch notes or folders");
            }
            const folders = await foldersRes.json() as Folder[];
            const notes = await notesRes.json() as Note[];
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
            set({ nodes: nestedNodes, nodesHash, loading: false });
        },
    })),
);

export default useNoteStore;

import { create } from "zustand";
import type { Node } from "../types";

export interface PendingNode {
    type: Node["type"];
    parentId: string | null;
}

interface ExplorerStore {
    /** A note or folder being named inline, before it is created. */
    pendingNode: PendingNode | null;
    startCreating: (type: Node["type"], parentId: string | null) => void;
    stopCreating: () => void;
}

export const useExplorerStore = create<ExplorerStore>()(set => ({
    pendingNode: null,
    startCreating: (type, parentId) => set({ pendingNode: { type, parentId } }),
    stopCreating: () => set({ pendingNode: null }),
}));

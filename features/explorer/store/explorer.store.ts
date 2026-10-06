import { create } from "zustand";
import type { Node } from "@/features/nodes";

export interface PendingNode {
    type: Node["type"];
    parentId: string | null;
}

interface ExplorerStore {
    /** A note or folder being named inline, before it is created. */
    pendingNode: PendingNode | null;
    startCreating: (type: Node["type"], parentId: string | null) => void;
    stopCreating: () => void;
    /** The id of the note or folder whose name is being edited inline. */
    renamingId: string | null;
    startRenaming: (id: string) => void;
    stopRenaming: () => void;
}

export const useExplorerStore = create<ExplorerStore>()(set => ({
    pendingNode: null,
    startCreating: (type, parentId) => set({ pendingNode: { type, parentId } }),
    stopCreating: () => set({ pendingNode: null }),
    renamingId: null,
    startRenaming: id => set({ renamingId: id }),
    stopRenaming: () => set({ renamingId: null }),
}));

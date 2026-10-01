import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Note, Folder, Node } from "../types";
import { devtools } from "zustand/middleware";
import { removeFolderFromHash } from "../utils/delete-folder-store";

interface NodeStore {
    nodesHash: Record<string, Node>;
    // False until the server's nodes are loaded, so an empty hash can be
    // told apart from a note that does not exist.
    initialized: boolean;
    // Ids deleted this session. A save that fails after its note was
    // deleted must not roll the note back into the hash.
    deletedIds: Record<string, true>;

    initilizeNoteStore: (folders: Folder[], notes: Note[]) => Promise<void>;
    addNote: (note: Note) => Promise<void>;
    addFolder: (folder: Folder) => Promise<void>;
    removeNote: (noteId: string) => Promise<void>;
    removeFolder: (folderId: string) => Promise<void>;
    updateNote: (noteId: string, updates: Partial<Note>) => Promise<Note>;
    updateFolder: (folder: Folder) => void;
}

export const useNodeStore = create<NodeStore>()(
    devtools(
        immer((set, get) => ({
            nodesHash: {},
            initialized: false,
            deletedIds: {},

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
                ); // building hash

                set({ nodesHash, initialized: true });
            },
            addNote: async (note: Note) => {
                const previousNodesHash = get().nodesHash;

                set(state => {
                    state.nodesHash[note.id] = note;
                });

                try {
                    const response = await fetch("/api/notes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(note),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to add note");
                    }
                } catch (error) {
                    console.error("Error adding note:", error);
                    set(state => {
                        state.nodesHash = previousNodesHash;
                    });
                }
            },
            addFolder: async (folder: Folder) => {
                const previousNodesHash = get().nodesHash;

                set(state => {
                    state.nodesHash[folder.id] = folder;
                });

                try {
                    const response = await fetch("/api/folders", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(folder),
                    });
                    if (!response.ok) {
                        throw new Error("Failed to add folder");
                    }
                } catch (error) {
                    console.error("Error adding folder:", error);
                    set(state => {
                        state.nodesHash = previousNodesHash;
                    });
                }
            },
            removeFolder: async (folderId: string) => {
                const nodesHash = get().nodesHash;
                const nextNodesHash = removeFolderFromHash(nodesHash, folderId);
                if (nextNodesHash === nodesHash) return;

                const removedIds = Object.keys(nodesHash).filter(
                    id => !(id in nextNodesHash),
                );
                set(state => {
                    state.nodesHash = nextNodesHash;
                    for (const id of removedIds) state.deletedIds[id] = true;
                });
                try {
                    const response = await fetch(`/api/folders/${folderId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) {
                        throw new Error(
                            response.status === 401
                                ? "Session expired. Please sign in again."
                                : "Failed to delete folder",
                        );
                    }
                } catch (error) {
                    set(state => {
                        state.nodesHash = nodesHash;
                        for (const id of removedIds) delete state.deletedIds[id];
                    });
                    throw error;
                }
            },
            removeNote: async (noteId: string) => {
                const nodesHash = get().nodesHash;
                if (nodesHash[noteId]?.type !== "note") return;

                set(state => {
                    delete state.nodesHash[noteId];
                    state.deletedIds[noteId] = true;
                });
                try {
                    const response = await fetch(`/api/notes/${noteId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (!response.ok) {
                        throw new Error(
                            response.status === 401
                                ? "Session expired. Please sign in again."
                                : "Failed to delete note",
                        );
                    }
                } catch (error) {
                    set(state => {
                        state.nodesHash = nodesHash;
                        delete state.deletedIds[noteId];
                    });
                    throw error;
                }
            },
            updateNote: async (noteId: string, updates: Partial<Note>) => {
                const previousNote = get().nodesHash[noteId];
                if (!previousNote || previousNote.type !== "note") {
                    throw new Error("Note not found");
                }

                const updatedNote: Note = {
                    ...previousNote,
                    ...updates,
                    id: previousNote.id,
                    type: "note",
                    updatedAt: new Date(),
                };

                set(state => {
                    state.nodesHash[noteId] = updatedNote;
                });

                try {
                    const response = await fetch(`/api/notes/${noteId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updatedNote),
                    });
                    if (!response.ok) {
                        throw new Error(
                            response.status === 401
                                ? "Session expired. Please sign in again."
                                : "Failed to update note",
                        );
                    }
                } catch (error) {
                    set(state => {
                        // The note may have been deleted while this save was
                        // in flight; restoring it would bring it back.
                        if (state.deletedIds[noteId]) return;
                        state.nodesHash[noteId] = previousNote;
                    });
                    throw error;
                }

                // Returned so callers can pick up the `updatedAt` that was
                // actually persisted; the API echoes nothing back.
                return updatedNote;
            },
        })),
    ),
);

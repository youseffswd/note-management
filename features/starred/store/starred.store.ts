import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { browserStorage } from "@/shared/lib/browser-storage";

interface StarredData {
    ownerId: string | null;
    starredIds: Record<string, true>;
}

interface StarredStore extends StarredData {
    bindOwner: (userId: string) => void;
    toggleStar: (noteId: string) => void;
    reset: () => void;
}

const emptyData = (): StarredData => ({
    ownerId: null,
    starredIds: {},
});

// Stars live on this device until backend storage is available.
export const useStarredStore = create<StarredStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                ...emptyData(),
                bindOwner: (userId: string) => {
                    const { ownerId } = get();
                    if (ownerId === userId) return;
                    set(state => {
                        if (ownerId !== null) Object.assign(state, emptyData());
                        state.ownerId = userId;
                    });
                },
                toggleStar: (noteId: string) => {
                    set(state => {
                        if (state.starredIds[noteId]) {
                            delete state.starredIds[noteId];
                        } else {
                            state.starredIds[noteId] = true;
                        }
                    });
                },
                reset: () => set(emptyData()),
            })),
            {
                name: "starred:v1",
                storage: createJSONStorage(() => browserStorage),
                partialize: ({ ownerId, starredIds }) => ({ ownerId, starredIds }),
                // Hydrated by the app layout after mount to match the server render.
                skipHydration: true,
            },
        ),
    ),
);

/** Forgets every star on this device. Call on logout. */
export function clearStarred(): void {
    useStarredStore.getState().reset();
    useStarredStore.persist.clearStorage();
}

import { create } from "zustand";
import {
    createJSONStorage,
    devtools,
    persist,
} from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import { browserStorage } from "@/shared/lib/browser-storage";
import type { Tag } from "../types";
import { TAG_COLORS } from "../utils/tag-colors";

/**
 * Tags and their note assignments.
 *
 * There are no tables for these yet, so they live only in this browser's
 * localStorage. Components only go through the actions below; once the backend
 * exists, those actions are where the API calls go (optimistic update, then
 * fetch, then roll back on failure, as in nodes.store), and `persist` goes away.
 */

interface TagsData {
    /** The user this data belongs to. A different user starts empty. */
    ownerId: string | null;
    /** In creation order. */
    tags: Record<string, Tag>;
    /** Note id → its tag ids, in the order they were added. */
    noteTags: Record<string, string[]>;
}

interface TagsStore extends TagsData {
    bindOwner: (userId: string) => void;
    /** Returns the existing tag when one has the same name (any case). */
    createTag: (name: string) => Tag | null;
    addTagToNote: (noteId: string, tagId: string) => void;
    removeTagFromNote: (noteId: string, tagId: string) => void;
    reset: () => void;
}

const emptyData = (): TagsData => ({
    ownerId: null,
    tags: {},
    noteTags: {},
});

export function normalizeTagName(name: string): string {
    return name.trim().replace(/\s+/g, " ");
}

export function findTagByName(
    tags: Record<string, Tag>,
    name: string,
): Tag | undefined {
    const wanted = normalizeTagName(name).toLowerCase();
    return Object.values(tags).find(tag => tag.name.toLowerCase() === wanted);
}

export const useTagsStore = create<TagsStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                ...emptyData(),

                bindOwner: (userId: string) => {
                    const { ownerId } = get();
                    if (ownerId === userId) return;
                    set(state => {
                        // Someone else's tags are never shown.
                        if (ownerId !== null) Object.assign(state, emptyData());
                        state.ownerId = userId;
                    });
                },
                createTag: (name: string) => {
                    const normalized = normalizeTagName(name);
                    if (!normalized) return null;

                    const { tags } = get();
                    const existing = findTagByName(tags, normalized);
                    if (existing) return existing;

                    const tag: Tag = {
                        id: uuidv4(),
                        name: normalized,
                        color: TAG_COLORS[
                            Object.keys(tags).length % TAG_COLORS.length
                        ],
                    };
                    set(state => {
                        state.tags[tag.id] = tag;
                    });
                    return tag;
                },
                addTagToNote: (noteId: string, tagId: string) => {
                    set(state => {
                        if (!state.tags[tagId]) return;
                        const tagIds = (state.noteTags[noteId] ??= []);
                        if (!tagIds.includes(tagId)) tagIds.push(tagId);
                    });
                },
                removeTagFromNote: (noteId: string, tagId: string) => {
                    set(state => {
                        const tagIds = state.noteTags[noteId];
                        if (!tagIds) return;
                        const remaining = tagIds.filter(id => id !== tagId);
                        if (remaining.length) {
                            state.noteTags[noteId] = remaining;
                        } else {
                            delete state.noteTags[noteId];
                        }
                    });
                },
                reset: () => set(emptyData()),
            })),
            {
                name: "tags:v1",
                storage: createJSONStorage(() => browserStorage),
                partialize: ({ ownerId, tags, noteTags }) => ({
                    ownerId,
                    tags,
                    noteTags,
                }),
                // Loaded after mount by NoteFeaturesInitializer, so the server
                // render and the first client render agree.
                skipHydration: true,
            },
        ),
    ),
);

/** Forgets every tag and assignment on this device. Call on logout. */
export function clearTags(): void {
    useTagsStore.getState().reset();
    useTagsStore.persist.clearStorage();
}

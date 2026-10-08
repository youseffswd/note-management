import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import { useNodeStore } from "@/features/nodes";
import type { Tag } from "../types";
import { TAG_COLORS } from "../utils/tag-colors";

/**
 * The user's tags. Which notes have which tags is `note.tagIds` in the nodes
 * store; the assignment actions here change it there.
 *
 * The server's data seeds the store (`initilizeStore`). Every action updates
 * the stores first, then calls the API, and undoes only its own change if the
 * request fails (as in nodes.store). Components never await them: failures
 * are rolled back and logged here.
 */

interface TagsData {
    /** In creation order. */
    tags: Record<string, Tag>;
}

interface TagsStore extends TagsData {
    initilizeStore: (tags: Tag[]) => void;
    /** Returns the existing tag when one has the same name (any case). */
    createTag: (name: string) => Tag | null;
    addTagToNote: (noteId: string, tagId: string) => Promise<void>;
    removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
    removeTag: (tagId: string) => Promise<void>;
    reset: () => void;
}

const emptyData = (): TagsData => ({
    tags: {},
});

const nodes = () => useNodeStore.getState();

/** The note's tag ids, or undefined when the note does not exist. */
function tagIdsOf(noteId: string): string[] | undefined {
    const node = nodes().nodesHash[noteId];
    return node?.type === "note" ? node.tagIds : undefined;
}

// Requests about the same tag, or the same note/tag pair, run one after the
// other. Otherwise a tag assigned right after it was created could reach the
// server first and fail its foreign key, and an add followed by a remove
// could be applied in the wrong order.
const queues = new Map<string, Promise<void>>();

const tagKey = (tagId: string) => `tag:${tagId}`;
const assignmentKey = (noteId: string, tagId: string) =>
    `assignment:${noteId}:${tagId}`;

function enqueue(
    key: string,
    task: () => Promise<void>,
    after: string[] = [],
): Promise<void> {
    const previous = Promise.all(
        [key, ...after].map(k => queues.get(k) ?? Promise.resolve()),
    );
    const next = previous.then(task);
    // Never rejects, so a failed task does not block the ones behind it.
    const settled = next.catch(() => undefined);
    queues.set(key, settled);
    void settled.then(() => {
        if (queues.get(key) === settled) queues.delete(key);
    });
    return next;
}

async function send(
    url: string,
    init: RequestInit,
    failureMessage: string,
): Promise<void> {
    const response = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error(
            response.status === 401
                ? "Session expired. Please sign in again."
                : failureMessage,
        );
    }
}

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
        immer((set, get) => ({
            ...emptyData(),

            initilizeStore: (tags: Tag[]) => {
                set({
                    tags: [...tags]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .reduce(
                            (acc, tag) => {
                                acc[tag.id] = tag;
                                return acc;
                            },
                            {} as Record<string, Tag>,
                        ),
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

                void enqueue(tagKey(tag.id), async () => {
                    try {
                        await send(
                            "/api/tags",
                            { method: "POST", body: JSON.stringify(tag) },
                            "Failed to create tag",
                        );
                    } catch (error) {
                        console.error("Error creating tag:", error);
                        set(state => {
                            delete state.tags[tag.id];
                        });
                        nodes().detachTagFromAllNotes(tag.id);
                    }
                });
                return tag;
            },
            addTagToNote: async (noteId: string, tagId: string) => {
                if (!get().tags[tagId]) return;
                const tagIds = tagIdsOf(noteId);
                if (!tagIds || tagIds.includes(tagId)) return;

                nodes().attachTag(noteId, tagId);

                // Waits for the tag's own create request, if it is still running.
                await enqueue(
                    assignmentKey(noteId, tagId),
                    async () => {
                        try {
                            await send(
                                "/api/tags-note",
                                {
                                    method: "POST",
                                    body: JSON.stringify({ tagId, noteId }),
                                },
                                "Failed to add tag to note",
                            );
                        } catch (error) {
                            console.error("Error adding tag to note:", error);
                            nodes().detachTag(noteId, tagId);
                        }
                    },
                    [tagKey(tagId)],
                );
            },
            removeTagFromNote: async (noteId: string, tagId: string) => {
                if (!tagIdsOf(noteId)?.includes(tagId)) return;

                nodes().detachTag(noteId, tagId);

                await enqueue(assignmentKey(noteId, tagId), async () => {
                    try {
                        const query = new URLSearchParams({ tagId, noteId });
                        await send(
                            `/api/tags-note?${query}`,
                            { method: "DELETE" },
                            "Failed to remove tag from note",
                        );
                    } catch (error) {
                        console.error("Error removing tag from note:", error);
                        // The tag may have been deleted meanwhile.
                        if (get().tags[tagId]) nodes().attachTag(noteId, tagId);
                    }
                });
            },
            removeTag: async (tagId: string) => {
                const removed = get().tags[tagId];
                if (!removed) return;
                const noteIds = Object.values(nodes().nodesHash)
                    .filter(node => node.type === "note" && node.tagIds.includes(tagId))
                    .map(node => node.id);

                set(state => {
                    delete state.tags[tagId];
                });
                nodes().detachTagFromAllNotes(tagId);

                await enqueue(
                    tagKey(tagId),
                    async () => {
                        try {
                            await send(
                                `/api/tags/${tagId}`,
                                { method: "DELETE" },
                                "Failed to delete tag",
                            );
                        } catch (error) {
                            console.error("Error deleting tag:", error);
                            set(state => {
                                state.tags[tagId] = removed;
                            });
                            for (const noteId of noteIds) {
                                nodes().attachTag(noteId, tagId);
                            }
                        }
                    },
                    // Assignments still in flight must reach the server first.
                    noteIds.map(noteId => assignmentKey(noteId, tagId)),
                );
            },
            reset: () => set(emptyData()),
        })),
    ),
);

/** Forgets every tag. Call on logout. */
export function clearTags(): void {
    useTagsStore.getState().reset();
}

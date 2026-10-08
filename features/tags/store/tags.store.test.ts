import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNodeStore, type Note } from "@/features/nodes";
import type { Tag } from "../types";
import { clearTags, useTagsStore } from "./tags.store";

const tag = (id: string, name = id): Tag => ({ id, name, color: "blue" });

const note = (id: string, tagIds: string[] = []): Note => ({
    id,
    title: id,
    content: [],
    parentId: null,
    createdAt: new Date("2026-01-01"),
    type: "note",
    tagIds,
});

/** Replaces the nodes store's notes. */
function seedNotes(...notes: Note[]) {
    void useNodeStore.getState().initilizeNoteStore([], notes);
}

/** Tag ids of every seeded note, skipping untagged ones. */
function assignments() {
    const result: Record<string, string[]> = {};
    for (const node of Object.values(useNodeStore.getState().nodesHash)) {
        if (node.type === "note" && node.tagIds.length) {
            result[node.id] = node.tagIds;
        }
    }
    return result;
}

/** Responds to every request with the given statuses, in order, then 200. */
function mockFetch(...statuses: number[]) {
    const queue = [...statuses];
    const fn = vi.fn(
        async (...args: [url: string, init?: RequestInit]) => {
            void args;
            return new Response(null, { status: queue.shift() ?? 200 });
        },
    );
    vi.stubGlobal("fetch", fn);
    return fn;
}

const calls = (fn: ReturnType<typeof mockFetch>) =>
    fn.mock.calls.map(([url, init]) => `${init?.method} ${url}`);

beforeEach(() => {
    useTagsStore.getState().reset();
    useNodeStore.setState({ nodesHash: {}, initialized: false, deletedIds: {} });
    seedNotes(note("n1"), note("n2"));
    mockFetch();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("initilizeStore", () => {
    it("loads tags sorted by name", () => {
        useTagsStore
            .getState()
            .initilizeStore([tag("b", "beta"), tag("a", "alpha")]);

        expect(Object.keys(useTagsStore.getState().tags)).toEqual(["a", "b"]);
    });

    it("does not reorder the array it was given", () => {
        const input = [tag("b", "beta"), tag("a", "alpha")];

        useTagsStore.getState().initilizeStore(input);

        expect(input.map(t => t.id)).toEqual(["b", "a"]);
    });

    it("replaces earlier data", () => {
        const { initilizeStore } = useTagsStore.getState();
        initilizeStore([tag("a")]);

        initilizeStore([tag("b")]);

        expect(Object.keys(useTagsStore.getState().tags)).toEqual(["b"]);
    });
});

describe("createTag", () => {
    it("creates a tag with a trimmed name and cycles colors", () => {
        const { createTag } = useTagsStore.getState();

        const first = createTag("  design  system ");
        const second = createTag("tech");

        expect(first).toMatchObject({ name: "design system", color: "blue" });
        expect(second).toMatchObject({ name: "tech", color: "green" });
        expect(Object.keys(useTagsStore.getState().tags)).toEqual([
            first!.id,
            second!.id,
        ]);
    });

    it("returns the existing tag for a duplicate name in any case", async () => {
        const fetchMock = mockFetch();
        const { createTag } = useTagsStore.getState();

        const created = createTag("Design");

        expect(createTag("design")).toBe(created);
        expect(Object.keys(useTagsStore.getState().tags)).toHaveLength(1);
        // Only the first call reaches the server.
        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    });

    it("refuses a blank name without calling the server", () => {
        const fetchMock = mockFetch();

        expect(useTagsStore.getState().createTag("   ")).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("posts the new tag to the server", async () => {
        const fetchMock = mockFetch();

        const created = useTagsStore.getState().createTag("q4")!;

        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe("/api/tags");
        expect(init?.method).toBe("POST");
        expect(JSON.parse(init!.body as string)).toEqual(created);
    });

    it("removes the tag and its assignments when the server refuses it", async () => {
        mockFetch(500);
        const { createTag, addTagToNote } = useTagsStore.getState();

        const created = createTag("q4")!;
        await addTagToNote("n1", created.id);

        expect(useTagsStore.getState().tags).toEqual({});
        expect(assignments()).toEqual({});
    });
});

describe("addTagToNote", () => {
    it("adds a tag to a note once, and posts it once", async () => {
        const fetchMock = mockFetch();
        useTagsStore.getState().initilizeStore([tag("q4")]);
        const { addTagToNote } = useTagsStore.getState();

        await addTagToNote("n1", "q4");
        await addTagToNote("n1", "q4");

        expect(assignments()).toEqual({ n1: ["q4"] });
        expect(calls(fetchMock)).toEqual(["POST /api/tags-note"]);
        expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({
            tagId: "q4",
            noteId: "n1",
        });
    });

    it("does not change the note's updatedAt", async () => {
        useTagsStore.getState().initilizeStore([tag("q4")]);

        await useTagsStore.getState().addTagToNote("n1", "q4");

        expect(useNodeStore.getState().nodesHash.n1).not.toHaveProperty(
            "updatedAt",
        );
    });

    it("ignores unknown tag ids", async () => {
        const fetchMock = mockFetch();

        await useTagsStore.getState().addTagToNote("n1", "missing");

        expect(assignments()).toEqual({});
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("ignores unknown notes", async () => {
        const fetchMock = mockFetch();
        useTagsStore.getState().initilizeStore([tag("q4")]);

        await useTagsStore.getState().addTagToNote("missing", "q4");

        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rolls back only its own assignment when the request fails", async () => {
        seedNotes(note("n1", ["a"]));
        useTagsStore.getState().initilizeStore([tag("a"), tag("b")]);
        mockFetch(500);

        await useTagsStore.getState().addTagToNote("n1", "b");

        expect(assignments()).toEqual({ n1: ["a"] });
    });

    it("waits for a new tag to be created before assigning it", async () => {
        const fetchMock = mockFetch();
        const { createTag, addTagToNote } = useTagsStore.getState();

        const created = createTag("q4")!;
        await addTagToNote("n1", created.id);

        expect(calls(fetchMock)).toEqual([
            "POST /api/tags",
            "POST /api/tags-note",
        ]);
        expect(assignments()).toEqual({ n1: [created.id] });
    });
});

describe("removeTagFromNote", () => {
    beforeEach(() => {
        seedNotes(note("n1", ["q4"]), note("n2"));
        useTagsStore.getState().initilizeStore([tag("q4")]);
    });

    it("removes the tag from the note and the server", async () => {
        const fetchMock = mockFetch();

        await useTagsStore.getState().removeTagFromNote("n1", "q4");

        expect(assignments()).toEqual({});
        expect(calls(fetchMock)).toEqual([
            "DELETE /api/tags-note?tagId=q4&noteId=n1",
        ]);
    });

    it("does nothing for a tag the note does not have", async () => {
        const fetchMock = mockFetch();

        await useTagsStore.getState().removeTagFromNote("n1", "other");
        await useTagsStore.getState().removeTagFromNote("n2", "q4");

        expect(assignments()).toEqual({ n1: ["q4"] });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("puts the tag back when the request fails", async () => {
        mockFetch(500);

        await useTagsStore.getState().removeTagFromNote("n1", "q4");

        expect(assignments()).toEqual({ n1: ["q4"] });
    });

    it("applies an add and a quick remove in order", async () => {
        const fetchMock = mockFetch();
        seedNotes(note("n1"));
        const { addTagToNote, removeTagFromNote } = useTagsStore.getState();

        const added = addTagToNote("n1", "q4");
        const removed = removeTagFromNote("n1", "q4");
        await Promise.all([added, removed]);

        expect(calls(fetchMock)).toEqual([
            "POST /api/tags-note",
            "DELETE /api/tags-note?tagId=q4&noteId=n1",
        ]);
        expect(assignments()).toEqual({});
    });
});

describe("removeTag", () => {
    beforeEach(() => {
        seedNotes(note("n1", ["a", "b"]), note("n2", ["a"]));
        useTagsStore.getState().initilizeStore([tag("a"), tag("b")]);
    });

    it("removes the tag from the store, every note and the server", async () => {
        const fetchMock = mockFetch();

        await useTagsStore.getState().removeTag("a");

        expect(Object.keys(useTagsStore.getState().tags)).toEqual(["b"]);
        expect(assignments()).toEqual({ n1: ["b"] });
        expect(calls(fetchMock)).toEqual(["DELETE /api/tags/a"]);
    });

    it("does nothing for an unknown tag", async () => {
        const fetchMock = mockFetch();

        await useTagsStore.getState().removeTag("missing");

        expect(Object.keys(useTagsStore.getState().tags)).toEqual(["a", "b"]);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("restores the tag and its assignments when the request fails", async () => {
        mockFetch(500);

        await useTagsStore.getState().removeTag("a");

        expect(Object.keys(useTagsStore.getState().tags).sort()).toEqual([
            "a",
            "b",
        ]);
        const restored = assignments();
        expect([...restored.n1].sort()).toEqual(["a", "b"]);
        expect(restored.n2).toEqual(["a"]);
    });
});

describe("clearTags", () => {
    it("forgets every tag", () => {
        useTagsStore.getState().initilizeStore([tag("design")]);

        clearTags();

        expect(useTagsStore.getState().tags).toEqual({});
    });
});

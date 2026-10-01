import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearTags, useTagsStore } from "./tags.store";

beforeEach(() => {
    useTagsStore.getState().reset();
});

describe("tags", () => {
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

    it("returns the existing tag for a duplicate name in any case", () => {
        const { createTag } = useTagsStore.getState();

        const tag = createTag("Design");

        expect(createTag("design")).toBe(tag);
        expect(Object.keys(useTagsStore.getState().tags)).toHaveLength(1);
    });

    it("refuses a blank name", () => {
        expect(useTagsStore.getState().createTag("   ")).toBeNull();
    });

    it("adds a tag to a note once, and removes it", () => {
        const { createTag, addTagToNote, removeTagFromNote } =
            useTagsStore.getState();
        const tag = createTag("q4")!;

        addTagToNote("n1", tag.id);
        addTagToNote("n1", tag.id);
        expect(useTagsStore.getState().noteTags).toEqual({ n1: [tag.id] });

        removeTagFromNote("n1", tag.id);
        expect(useTagsStore.getState().noteTags).toEqual({});
    });

    it("ignores unknown tag ids", () => {
        useTagsStore.getState().addTagToNote("n1", "missing");

        expect(useTagsStore.getState().noteTags).toEqual({});
    });
});

describe("bindOwner", () => {
    it("keeps data made before the user was known", () => {
        const { createTag, addTagToNote, bindOwner } = useTagsStore.getState();

        const tag = createTag("design")!;
        addTagToNote("n1", tag.id);
        bindOwner("alice");

        expect(useTagsStore.getState()).toMatchObject({
            ownerId: "alice",
            tags: { [tag.id]: tag },
            noteTags: { n1: [tag.id] },
        });
    });

    it("clears another user's data", () => {
        const { createTag, addTagToNote, bindOwner } =
            useTagsStore.getState();
        bindOwner("alice");
        const tag = createTag("private")!;
        addTagToNote("n1", tag.id);

        bindOwner("bob");

        expect(useTagsStore.getState()).toMatchObject({
            ownerId: "bob",
            tags: {},
            noteTags: {},
        });
    });

    it("keeps the same user's tags when rebound", () => {
        const { createTag, bindOwner } = useTagsStore.getState();
        bindOwner("alice");
        const tag = createTag("design")!;
        bindOwner("alice");
        expect(useTagsStore.getState().tags).toEqual({ [tag.id]: tag });
    });
});

describe("persistence", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("restores tags and assignments and clears its own storage on logout", async () => {
        const data = new Map<string, string>();
        const localStorage = {
            getItem: (key: string) => data.get(key) ?? null,
            setItem: (key: string, value: string) => data.set(key, value),
            removeItem: (key: string) => data.delete(key),
        };
        vi.stubGlobal("window", { localStorage });
        const tag = { id: "t1", name: "design", color: "blue" };
        const saved = {
            ownerId: "alice",
            tags: { t1: tag },
            noteTags: { n1: ["t1"] },
        };
        localStorage.setItem("tags:v1", JSON.stringify({ state: saved, version: 0 }));
        localStorage.setItem("starred:v1", "untouched");

        await useTagsStore.persist.rehydrate();
        useTagsStore.getState().bindOwner("alice");
        expect(useTagsStore.getState()).toMatchObject(saved);

        clearTags();
        expect(useTagsStore.getState()).toMatchObject({ ownerId: null, tags: {}, noteTags: {} });
        expect(localStorage.getItem("tags:v1")).toBeNull();
        expect(localStorage.getItem("starred:v1")).toBe("untouched");
    });
});

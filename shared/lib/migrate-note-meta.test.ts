import { beforeEach, describe, expect, it, vi } from "vitest";

import { LEGACY_NOTE_META_KEY, migrateNoteMeta } from "./migrate-note-meta";

const data = new Map<string, string>();
const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => { data.set(key, value); },
    removeItem: (key: string) => { data.delete(key); },
};
const state = {
    ownerId: "alice",
    starredIds: { n1: true },
    tags: { t1: { id: "t1", name: "design", color: "blue" } },
    noteTags: { n1: ["t1"] },
};

beforeEach(() => {
    data.clear();
    storage.setItem(LEGACY_NOTE_META_KEY, JSON.stringify({ state, version: 0 }));
});

describe("migrateNoteMeta", () => {
    it("preserves each feature's data and owner in separate storage keys", () => {
        migrateNoteMeta(storage);

        expect(JSON.parse(storage.getItem("starred:v1")!)).toEqual({
            state: { ownerId: state.ownerId, starredIds: state.starredIds },
            version: 0,
        });
        expect(JSON.parse(storage.getItem("tags:v1")!)).toEqual({
            state: { ownerId: state.ownerId, tags: state.tags, noteTags: state.noteTags },
            version: 0,
        });
        expect(storage.getItem(LEGACY_NOTE_META_KEY)).toBeNull();
    });

    it("preserves newer data and can run repeatedly", () => {
        const newer = JSON.stringify({ state: { ownerId: "bob", starredIds: {} }, version: 0 });
        storage.setItem("starred:v1", newer);
        migrateNoteMeta(storage);
        migrateNoteMeta(storage);

        expect(storage.getItem("starred:v1")).toBe(newer);
        expect(JSON.parse(storage.getItem("tags:v1")!).state.tags).toEqual(state.tags);
    });

    it("leaves storage empty when there is no legacy data", () => {
        data.clear();
        migrateNoteMeta(storage);
        expect(data.size).toBe(0);
    });

    it.each(["invalid json", '{"version":0}', '{"state":{},"version":1}'])(
        "retains unreadable or unsupported legacy data: %s",
        raw => {
            storage.setItem(LEGACY_NOTE_META_KEY, raw);
            expect(() => migrateNoteMeta(storage)).not.toThrow();
            expect(storage.getItem(LEGACY_NOTE_META_KEY)).toBe(raw);
            expect(storage.getItem("starred:v1")).toBeNull();
            expect(storage.getItem("tags:v1")).toBeNull();
        },
    );

    it("keeps the original if a write fails, then resumes without losing data", () => {
        const setItem = vi.fn((key: string, value: string) => {
            if (key === "tags:v1") throw new Error("Storage full");
            storage.setItem(key, value);
        });
        migrateNoteMeta({ ...storage, setItem });
        expect(storage.getItem(LEGACY_NOTE_META_KEY)).not.toBeNull();
        expect(storage.getItem("tags:v1")).toBeNull();

        migrateNoteMeta(storage);
        expect(JSON.parse(storage.getItem("tags:v1")!).state.noteTags).toEqual(state.noteTags);
        expect(storage.getItem(LEGACY_NOTE_META_KEY)).toBeNull();
    });
});

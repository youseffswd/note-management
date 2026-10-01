import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearStarred, useStarredStore } from "./starred.store";

beforeEach(() => useStarredStore.getState().reset());
afterEach(() => vi.unstubAllGlobals());

describe("stars", () => {
    it("toggles a note on and off", () => {
        const { toggleStar } = useStarredStore.getState();
        toggleStar("n1");
        expect(useStarredStore.getState().starredIds).toEqual({ n1: true });
        toggleStar("n1");
        expect(useStarredStore.getState().starredIds).toEqual({});
    });

    it("keeps stars made before the user was known", () => {
        const { toggleStar, bindOwner } = useStarredStore.getState();
        toggleStar("n1");
        bindOwner("alice");
        expect(useStarredStore.getState()).toMatchObject({
            ownerId: "alice",
            starredIds: { n1: true },
        });
    });

    it("keeps the same user's stars when rebound", () => {
        const { toggleStar, bindOwner } = useStarredStore.getState();
        bindOwner("alice");
        toggleStar("n1");
        bindOwner("alice");
        expect(useStarredStore.getState().starredIds).toEqual({ n1: true });
    });

    it("clears another user's stars", () => {
        const { toggleStar, bindOwner } = useStarredStore.getState();
        bindOwner("alice");
        toggleStar("n1");
        bindOwner("bob");
        expect(useStarredStore.getState()).toMatchObject({
            ownerId: "bob",
            starredIds: {},
        });
    });

    it("restores stars and clears its own storage on logout", async () => {
        const data = new Map<string, string>();
        const localStorage = {
            getItem: (key: string) => data.get(key) ?? null,
            setItem: (key: string, value: string) => data.set(key, value),
            removeItem: (key: string) => data.delete(key),
        };
        vi.stubGlobal("window", { localStorage });
        const saved = { ownerId: "alice", starredIds: { n1: true } };
        localStorage.setItem("starred:v1", JSON.stringify({ state: saved, version: 0 }));
        localStorage.setItem("tags:v1", "untouched");

        await useStarredStore.persist.rehydrate();
        useStarredStore.getState().bindOwner("alice");
        expect(useStarredStore.getState()).toMatchObject(saved);

        clearStarred();
        expect(useStarredStore.getState()).toMatchObject({ ownerId: null, starredIds: {} });
        expect(localStorage.getItem("starred:v1")).toBeNull();
        expect(localStorage.getItem("tags:v1")).toBe("untouched");
    });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Folder, Note } from "../types";
import { useNodeStore } from "./nodes.store";

const folder = (id: string, parentId: string | null): Folder => ({
    id,
    name: id,
    parentId,
    children: [],
    createdAt: new Date("2026-01-01"),
    type: "folder",
    colorClass: "chart-1",
});

const note = (id: string, parentId: string | null): Note => ({
    id,
    title: id,
    content: [],
    parentId,
    createdAt: new Date("2026-01-01"),
    type: "note",
});

const mockFetch = (ok: boolean) =>
    vi.stubGlobal(
        "fetch",
        vi.fn(async () => new Response(null, { status: ok ? 200 : 500 })),
    );

beforeEach(() => {
    useNodeStore.setState({ nodesHash: {}, initialized: false, deletedIds: {} });
    useNodeStore
        .getState()
        .initilizeNoteStore(
            [folder("work", null)],
            [note("open-note", null), note("work-note", "work")],
        );
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("deleted notes do not reappear", () => {
    it("ignores the editor's late save after removeNote", async () => {
        mockFetch(true);
        const { removeNote, updateNote } = useNodeStore.getState();

        await removeNote("open-note");
        // What the editor's unmount flush does.
        await expect(
            updateNote("open-note", { title: "late edit" }),
        ).rejects.toThrow("Note not found");

        expect(useNodeStore.getState().nodesHash).not.toHaveProperty(
            "open-note",
        );
    });

    it("ignores the editor's late save after removeFolder", async () => {
        mockFetch(true);
        const { removeFolder, updateNote } = useNodeStore.getState();

        await removeFolder("work");
        await expect(
            updateNote("work-note", { title: "late edit" }),
        ).rejects.toThrow("Note not found");

        expect(useNodeStore.getState().nodesHash).not.toHaveProperty(
            "work-note",
        );
    });

    it("does not restore a note deleted while its save was in flight", async () => {
        let failSave: () => void = () => {};
        vi.stubGlobal(
            "fetch",
            vi.fn((_url: string, init?: RequestInit) =>
                init?.method === "PUT"
                    ? new Promise<Response>(resolve => {
                          failSave = () =>
                              resolve(new Response(null, { status: 500 }));
                      })
                    : Promise.resolve(new Response(null, { status: 200 })),
            ),
        );
        const { removeNote, updateNote } = useNodeStore.getState();

        const save = updateNote("open-note", { title: "edit" });
        await removeNote("open-note");
        failSave();
        await expect(save).rejects.toThrow();

        expect(useNodeStore.getState().nodesHash).not.toHaveProperty(
            "open-note",
        );
    });
});

describe("failed deletes roll back", () => {
    it("restores the note and lets it be saved again", async () => {
        mockFetch(false);
        const { removeNote, updateNote } = useNodeStore.getState();

        await expect(removeNote("open-note")).rejects.toThrow();

        const state = useNodeStore.getState();
        expect(state.nodesHash).toHaveProperty("open-note");
        expect(state.deletedIds).toEqual({});

        mockFetch(true);
        await expect(
            updateNote("open-note", { title: "edit" }),
        ).resolves.toMatchObject({ title: "edit" });
    });

    it("restores the folder and its notes", async () => {
        mockFetch(false);

        await expect(
            useNodeStore.getState().removeFolder("work"),
        ).rejects.toThrow();

        const state = useNodeStore.getState();
        expect(state.nodesHash).toHaveProperty("work");
        expect(state.nodesHash).toHaveProperty("work-note");
        expect(state.deletedIds).toEqual({});
    });
});

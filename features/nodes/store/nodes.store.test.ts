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
    tagIds: [],
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

describe("tag assignments on notes", () => {
    const tagIdsOf = (id: string) => {
        const node = useNodeStore.getState().nodesHash[id];
        return node?.type === "note" ? node.tagIds : undefined;
    };

    it("attaches a tag once without touching updatedAt", () => {
        const { attachTag } = useNodeStore.getState();

        attachTag("open-note", "t1");
        attachTag("open-note", "t1");

        expect(tagIdsOf("open-note")).toEqual(["t1"]);
        expect(useNodeStore.getState().nodesHash["open-note"]).not.toHaveProperty(
            "updatedAt",
        );
    });

    it("detaches a tag from one note only", () => {
        const { attachTag, detachTag } = useNodeStore.getState();
        attachTag("open-note", "t1");
        attachTag("work-note", "t1");

        detachTag("open-note", "t1");

        expect(tagIdsOf("open-note")).toEqual([]);
        expect(tagIdsOf("work-note")).toEqual(["t1"]);
    });

    it("detaches a tag from every note and keeps the others", () => {
        const { attachTag, detachTagFromAllNotes } = useNodeStore.getState();
        attachTag("open-note", "t1");
        attachTag("open-note", "t2");
        attachTag("work-note", "t1");

        detachTagFromAllNotes("t1");

        expect(tagIdsOf("open-note")).toEqual(["t2"]);
        expect(tagIdsOf("work-note")).toEqual([]);
    });

    it("ignores folders and unknown ids", () => {
        const { attachTag } = useNodeStore.getState();

        attachTag("work", "t1");
        attachTag("missing", "t1");

        expect(useNodeStore.getState().nodesHash.work).not.toHaveProperty(
            "tagIds",
        );
        expect(useNodeStore.getState().nodesHash).not.toHaveProperty("missing");
    });

    it("keeps the tags when the note is saved", async () => {
        mockFetch(true);
        const { attachTag, updateNote } = useNodeStore.getState();
        attachTag("open-note", "t1");

        await updateNote("open-note", { title: "edit" });

        expect(tagIdsOf("open-note")).toEqual(["t1"]);
    });
});

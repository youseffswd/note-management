import { describe, expect, it } from "vitest";

import type { Folder, Node, Note } from "../types";
import { getAncestorFolders, isAncestorOf } from "./folder-path";

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

const hashOf = (...nodes: Node[]) =>
    Object.fromEntries(nodes.map(node => [node.id, node]));

describe("getAncestorFolders", () => {
    it("returns the folder path outermost first", () => {
        const hash = hashOf(
            folder("work", null),
            folder("meetings", "work"),
            note("q4", "meetings"),
        );

        expect(getAncestorFolders(hash, "q4").map(f => f.id)).toEqual([
            "work",
            "meetings",
        ]);
    });

    it("returns nothing for a root note or an unknown id", () => {
        const hash = hashOf(note("loose", null));

        expect(getAncestorFolders(hash, "loose")).toEqual([]);
        expect(getAncestorFolders(hash, "missing")).toEqual([]);
    });

    it("stops at a missing parent", () => {
        const hash = hashOf(folder("meetings", "gone"), note("q4", "meetings"));

        expect(getAncestorFolders(hash, "q4").map(f => f.id)).toEqual([
            "meetings",
        ]);
    });

    it("terminates on a parent cycle", () => {
        const hash = hashOf(
            folder("a", "b"),
            folder("b", "a"),
            note("n", "a"),
        );

        expect(getAncestorFolders(hash, "n").map(f => f.id)).toEqual([
            "b",
            "a",
        ]);
    });
});

describe("isAncestorOf", () => {
    it("is true only for folders on the note's path", () => {
        const hash = hashOf(
            folder("work", null),
            folder("meetings", "work"),
            folder("other", null),
            note("q4", "meetings"),
        );

        expect(isAncestorOf(hash, "work", "q4")).toBe(true);
        expect(isAncestorOf(hash, "meetings", "q4")).toBe(true);
        expect(isAncestorOf(hash, "other", "q4")).toBe(false);
    });
});

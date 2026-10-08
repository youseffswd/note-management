import { describe, expect, it } from "vitest";

import type { Folder, Node, Note } from "../types";
import { nextUntitledName } from "./untitled-name";

const folder = (id: string, parentId: string | null, name = id): Folder => ({
    id,
    name,
    parentId,
    children: [],
    createdAt: new Date("2026-01-01"),
    type: "folder",
    colorClass: "chart-1",
});

const note = (id: string, parentId: string | null, title = id): Note => ({
    id,
    title,
    content: [],
    parentId,
    createdAt: new Date("2026-01-01"),
    type: "note",
    tagIds: [],
});

const hashOf = (...nodes: Node[]) =>
    Object.fromEntries(nodes.map(node => [node.id, node]));

describe("nextUntitledName", () => {
    it("uses the plain name when it is free", () => {
        expect(nextUntitledName({}, { type: "note", parentId: null })).toBe(
            "Untitled Note",
        );
        expect(nextUntitledName({}, { type: "folder", parentId: null })).toBe(
            "Untitled Folder",
        );
    });

    it("counts up from 2 once the plain name is taken", () => {
        const hash = hashOf(
            note("a", null, "Untitled Note"),
            note("b", null, "Untitled Note (2)"),
        );

        expect(nextUntitledName(hash, { type: "note", parentId: null })).toBe(
            "Untitled Note (3)",
        );
    });

    it("fills the first gap", () => {
        const hash = hashOf(
            folder("a", null, "Untitled Folder"),
            folder("b", null, "Untitled Folder (3)"),
        );

        expect(nextUntitledName(hash, { type: "folder", parentId: null })).toBe(
            "Untitled Folder (2)",
        );
    });

    it("only looks at siblings of the same type", () => {
        const hash = hashOf(
            folder("work", null),
            note("elsewhere", "work", "Untitled Note"),
            folder("same-name-folder", null, "Untitled Note"),
        );

        expect(nextUntitledName(hash, { type: "note", parentId: null })).toBe(
            "Untitled Note",
        );
        expect(nextUntitledName(hash, { type: "note", parentId: "work" })).toBe(
            "Untitled Note (2)",
        );
    });

    it("ignores case and surrounding spaces", () => {
        const hash = hashOf(note("a", null, "  untitled note "));

        expect(nextUntitledName(hash, { type: "note", parentId: null })).toBe(
            "Untitled Note (2)",
        );
    });

    it("lets a node keep its own name", () => {
        const hash = hashOf(note("self", null, "Untitled Note"));

        expect(
            nextUntitledName(hash, {
                type: "note",
                parentId: null,
                excludeId: "self",
            }),
        ).toBe("Untitled Note");
    });
});

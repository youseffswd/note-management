import { describe, expect, it } from "vitest";

import type { Folder, Node, Note } from "../types";
import { removeFolderFromHash } from "./delete-folder-store";

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

/**
 * root
 * ├── work/
 * │   ├── work-note
 * │   └── projects/
 * │       ├── projects-note
 * │       └── archive/
 * │           └── archive-note
 * ├── personal/
 * │   └── personal-note
 * └── root-note
 */
const createHash = (): Record<string, Node> => {
    const nodes = [
        folder("work", null),
        note("work-note", "work"),
        folder("projects", "work"),
        note("projects-note", "projects"),
        folder("archive", "projects"),
        note("archive-note", "archive"),
        folder("personal", null),
        note("personal-note", "personal"),
        note("root-note", null),
    ];
    return Object.fromEntries(nodes.map(node => [node.id, node]));
};

describe("removeFolderFromHash", () => {
    describe("invalid folderId", () => {
        it("returns the same hash when the folder does not exist", () => {
            const hash = createHash();

            expect(removeFolderFromHash(hash, "missing")).toBe(hash);
        });

        it("returns the same hash when folderId is null", () => {
            const hash = createHash();

            // Guards against untyped callers passing null.
            expect(removeFolderFromHash(hash, null as unknown as string)).toBe(
                hash,
            );
        });

        it("returns the same hash when folderId is a note", () => {
            const hash = createHash();
            expect(removeFolderFromHash(hash, "root-note")).toBe(hash);
        });
    });

    describe("deleting", () => {
        it("deletes a deepest folder and its note", () => {
            const hash = createHash();
            const result = removeFolderFromHash(hash, "archive");

            expect(result).not.toHaveProperty("archive");
            expect(result).not.toHaveProperty("archive-note");
            expect(Object.keys(result)).toHaveLength(7);
        });

        it("deletes the folder, its nested nodes, and their nested nodes", () => {
            const hash = createHash();
            const result = removeFolderFromHash(hash, "work");

            for (const id of [
                "work",
                "work-note",
                "projects",
                "projects-note",
                "archive",
                "archive-note",
            ]) {
                expect(result).not.toHaveProperty(id);
            }
        });

        it("keeps nodes outside the deleted folder", () => {
            const hash = createHash();
            const result = removeFolderFromHash(hash, "work");

            expect(Object.keys(result).sort()).toEqual(
                ["personal", "personal-note", "root-note"].sort(),
            );
        });

        it("deletes a nested folder without touching its parent", () => {
            const hash = createHash();
            const result = removeFolderFromHash(hash, "projects");

            expect(Object.keys(result).sort()).toEqual(
                [
                    "work",
                    "work-note",
                    "personal",
                    "personal-note",
                    "root-note",
                ].sort(),
            );
        });
    });

    describe("structure", () => {
        it("keeps the remaining nodes in the same shape as before", () => {
            const hash = createHash();
            const result = removeFolderFromHash(hash, "work");

            expect(result).toEqual({
                personal: hash.personal,
                "personal-note": hash["personal-note"],
                "root-note": hash["root-note"],
            });
        });

        it("leaves folders with empty children like the rest of the store", () => {
            const hash = createHash();
            const result = removeFolderFromHash(hash, "archive");

            for (const node of Object.values(result)) {
                if (node.type === "folder") expect(node.children).toEqual([]);
            }
        });

        it("does not mutate the input hash", () => {
            const hash = createHash();
            const snapshot = structuredClone(hash);

            removeFolderFromHash(hash, "work");

            expect(hash).toEqual(snapshot);
        });
    });
});

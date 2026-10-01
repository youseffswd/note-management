import type { PartialBlock } from "@blocknote/core";
import { describe, expect, it } from "vitest";

import { notePreview } from "./note-preview";

const paragraph = (...texts: string[]): PartialBlock => ({
    type: "paragraph",
    content: texts.map(text => ({ type: "text", text, styles: {} })),
});

describe("notePreview", () => {
    it("joins the text of every block with spaces", () => {
        expect(
            notePreview([paragraph("Q4 goals:"), paragraph("Ship ", "v2")]),
        ).toBe("Q4 goals: Ship v2");
    });

    it("includes nested blocks, links and plain string content", () => {
        const blocks = [
            {
                type: "bulletListItem",
                content: "Parent",
                children: [
                    {
                        type: "paragraph",
                        content: [
                            {
                                type: "link",
                                href: "https://example.com",
                                content: [
                                    { type: "text", text: "a link", styles: {} },
                                ],
                            },
                        ],
                    },
                ],
            },
        ] as PartialBlock[];

        expect(notePreview(blocks)).toBe("Parent a link");
    });

    it("reads table cells", () => {
        const blocks = [
            {
                type: "table",
                content: {
                    type: "tableContent",
                    rows: [
                        {
                            cells: [
                                [{ type: "text", text: "a", styles: {} }],
                                {
                                    type: "tableCell",
                                    content: [
                                        { type: "text", text: "b", styles: {} },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        ] as PartialBlock[];

        expect(notePreview(blocks)).toBe("a b");
    });

    it("skips empty blocks and collapses whitespace", () => {
        expect(
            notePreview([
                paragraph(),
                paragraph("  one  \n two "),
                { type: "image" } as PartialBlock,
            ]),
        ).toBe("one two");
    });

    it("cuts long text with an ellipsis", () => {
        const preview = notePreview([paragraph("word ".repeat(100))], 20);

        expect(preview).toBe("word word word word…");
    });

    it("returns an empty string for missing or malformed content", () => {
        expect(notePreview(undefined)).toBe("");
        expect(notePreview("nope" as unknown as PartialBlock[])).toBe("");
        expect(notePreview([null as unknown as PartialBlock])).toBe("");
    });
});

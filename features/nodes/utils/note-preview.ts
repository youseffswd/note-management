import type { PartialBlock } from "@blocknote/core";

/**
 * A one-line plain-text preview of a note's body, cut at `maxLength` with an
 * ellipsis. Content comes from the database as untyped JSON, so every shape
 * is checked rather than trusted.
 */
export function notePreview(
    blocks: PartialBlock[] | undefined,
    maxLength = 120,
): string {
    const parts: string[] = [];
    let length = 0;

    const visit = (list: unknown) => {
        if (!Array.isArray(list)) return;
        for (const block of list) {
            // Stop walking once there is enough text; long notes are common.
            if (length > maxLength) return;
            if (!block || typeof block !== "object") continue;
            const text = inlineText(block.content).trim();
            if (text) {
                parts.push(text);
                length += text.length + 1;
            }
            visit(block.children);
        }
    };
    visit(blocks);

    const text = parts.join(" ").replace(/\s+/g, " ").trim();
    return text.length > maxLength
        ? `${text.slice(0, maxLength).trimEnd()}…`
        : text;
}

/** Text of a block's content: a string, inline runs, links, or a table. */
function inlineText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.map(inlineText).join("");
    if (!content || typeof content !== "object") return "";

    const node = content as {
        type?: unknown;
        text?: unknown;
        content?: unknown;
        rows?: unknown;
    };
    if (typeof node.text === "string") return node.text;
    if (node.type === "tableContent" && Array.isArray(node.rows)) {
        return node.rows
            .map(row =>
                Array.isArray(row?.cells)
                    ? row.cells.map(inlineText).join(" ")
                    : "",
            )
            .join(" ");
    }
    // Links and table cells wrap their runs in `content`.
    return inlineText(node.content);
}

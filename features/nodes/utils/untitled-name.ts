import type { Node } from "../types";

const UNTITLED_BASE: Record<Node["type"], string> = {
    note: "Untitled Note",
    folder: "Untitled Folder",
};

interface UntitledNameOptions {
    type: Node["type"];
    parentId: string | null;
    /** A node to leave out, e.g. the note whose title is being reset. */
    excludeId?: string;
}

/**
 * The name a node gets when left blank: "Untitled Note", then "Untitled Note 2",
 * "Untitled Note 3", ... whichever is the first not already used by a sibling
 * of the same type. Compared case-insensitively.
 */
export function nextUntitledName(
    nodesHash: Record<string, Node>,
    { type, parentId, excludeId }: UntitledNameOptions,
): string {
    const base = UNTITLED_BASE[type];

    const taken = new Set<string>();
    for (const node of Object.values(nodesHash)) {
        if (node.type !== type || node.id === excludeId) continue;
        if ((node.parentId ?? null) !== parentId) continue;
        const name = node.type === "note" ? node.title : node.name;
        taken.add(name.trim().toLowerCase());
    }

    if (!taken.has(base.toLowerCase())) return base;
    let counter = 2;
    while (taken.has(`${base} (${counter})`.toLowerCase())) counter++;
    return `${base} (${counter})`;
}

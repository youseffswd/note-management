import type { Node, Note } from "../types";

const lastTouched = (note: Note) =>
    new Date(note.updatedAt ?? note.createdAt).getTime() || 0;

/** Every note, most recently edited first. */
export function notesByRecent(nodesHash: Record<string, Node>): Note[] {
    return Object.values(nodesHash)
        .filter((node): node is Note => node.type === "note")
        .sort((a, b) => lastTouched(b) - lastTouched(a));
}

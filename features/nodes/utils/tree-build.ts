import type { Node } from "../types";

export function buildTree(nodesHash: Record<string, Node>): Node[] {
    const hash: Record<string, Node> = {};

    for (const node of Object.values(nodesHash)) {
        hash[node.id] =
            node.type === "folder"
                ? { ...node, children: [] }
                : { ...node };
    }

    const roots: Node[] = [];

    for (const node of Object.values(hash)) {
        const parent = node.parentId ? hash[node.parentId] : undefined;

        if (parent?.type === "folder") {
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots;
}

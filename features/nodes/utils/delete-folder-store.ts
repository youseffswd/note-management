import { Node } from "../types";
import { buildTree } from "./tree-build";

export function removeFolderFromHash(
    hash: Record<string, Node>,
    folderId: string,
): Record<string, Node> {
    const { newHash } = buildTree(hash);
    const folder = newHash[folderId];
    if (!folder || folder.type === "note") return hash;
    const queue: Node[] = [folder];
    while (queue.length > 0) {
        const node = queue.shift() as Node;
        const children = node.type === "folder" ? node.children : null;
        delete newHash[node.id];
        if (children) queue.push(...children);
    }
    for (const node of Object.values(newHash))
        if (node.type === "folder") node.children = [];
    return newHash;
}

import type { PartialBlock } from "@blocknote/core";

/** Best-effort title from the first block's first text run. */
export function extractTitle(blocks: PartialBlock[], fallback: string): string {
    try {
        const first = blocks?.[0];
        if (!first || !Array.isArray(first.content)) return fallback;
        const run = first.content[0];
        if (run && typeof run === "object" && "text" in run) {
            const text = String(run.text).trim();
            if (text.length > 0) return text;
        }
    } catch {
        /* keep the fallback */
    }
    return fallback;
}

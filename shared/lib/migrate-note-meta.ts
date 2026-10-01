export const LEGACY_NOTE_META_KEY = "note-meta:v1";

type MigrationStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** Split the former combined store without overwriting newer feature data. */
export function migrateNoteMeta(storage: MigrationStorage): void {
    try {
        const raw = storage.getItem(LEGACY_NOTE_META_KEY);
        if (!raw) return;
        const legacy = JSON.parse(raw);
        if (!legacy?.state || legacy.version !== 0) return;

        const { ownerId, starredIds, tags, noteTags } = legacy.state;
        const entries = [
            ["starred:v1", { ownerId, starredIds }],
            ["tags:v1", { ownerId, tags, noteTags }],
        ] as const;

        for (const [key, state] of entries) {
            if (storage.getItem(key) === null) {
                storage.setItem(key, JSON.stringify({ state, version: 0 }));
            }
        }
        // Only discard the original after both destination keys are saved.
        storage.removeItem(LEGACY_NOTE_META_KEY);
    } catch {
        // Keep the original if parsing or browser storage fails.
    }
}

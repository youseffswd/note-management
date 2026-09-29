import type { PartialBlock } from "@blocknote/core";
import type { Note } from "../types";

/**
 * Local crash-recovery drafts for the note editor.
 *
 * The editor mirrors what you type into localStorage a few hundred ms after
 * each change, well ahead of the 2s server save. If the save fails, the tab
 * dies, or the browser is killed, the draft is still on disk and is restored
 * on the next load.
 *
 * Timestamps are compared by EQUALITY only, never by ordering. `baseUpdatedAt`
 * records the server `updatedAt` a draft forked from, so an exact match means
 * nothing else touched the note and the draft is a pure continuation of it.
 * Clock skew between devices can therefore produce a needless conflict prompt,
 * but it can never silently lose data.
 */

const DRAFT_PREFIX = "note-draft:v1:";

/** Refuse to store a draft bigger than this; pasted images can be huge. */
const MAX_DRAFT_CHARS = 512 * 1024;

export interface NoteDraft {
    noteId: string;
    userId: string;
    title: string;
    content: PartialBlock[];
    /** Epoch ms. Shown in the conflict banner; never used to decide anything. */
    savedAt: number;
    /** Epoch ms of the server version this forked from. Compared with ===. */
    baseUpdatedAt: number | null;
    /** Monotonic per-tab counter. Guards the clear-on-success race. */
    rev: number;
}

export type DraftResolution =
    | { kind: "none" }
    | { kind: "restore"; draft: NoteDraft }
    | { kind: "conflict"; draft: NoteDraft };

function draftKey(userId: string, noteId: string): string {
    return `${DRAFT_PREFIX}${userId}:${noteId}`;
}

function toEpoch(value: Date | string | null | undefined): number | null {
    if (value === null || value === undefined) return null;
    const time = value instanceof Date ? value.getTime() : Date.parse(value);
    return Number.isFinite(time) ? time : null;
}

/**
 * The server timestamp a draft forks from. `addNote` writes neither timestamp,
 * so a brand-new note has no `updatedAt` and a null `createdAt` — `null` is a
 * legitimate baseline here, not an error.
 */
export function serverBaseline(
    note: Pick<Note, "createdAt" | "updatedAt">,
): number | null {
    return toEpoch(note.updatedAt) ?? toEpoch(note.createdAt);
}

/** Reads the draft for (userId, noteId), self-healing anything malformed. */
export function readDraft(userId: string, noteId: string): NoteDraft | null {
    if (typeof window === "undefined") return null;
    const key = draftKey(userId, noteId);
    try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const draft = JSON.parse(raw) as NoteDraft;
        const valid =
            draft &&
            draft.noteId === noteId &&
            draft.userId === userId &&
            Array.isArray(draft.content) &&
            Number.isFinite(draft.savedAt);
        if (!valid) {
            window.localStorage.removeItem(key);
            return null;
        }
        return draft;
    } catch {
        try {
            window.localStorage.removeItem(key);
        } catch {
            /* storage unavailable */
        }
        return null;
    }
}

/**
 * Persists a draft synchronously. Never throws — this sits in the typing path,
 * and a failure to back up must not interrupt the editor.
 */
export function writeDraft(input: Omit<NoteDraft, "savedAt">): void {
    if (typeof window === "undefined") return;
    const key = draftKey(input.userId, input.noteId);

    let serialized: string;
    try {
        serialized = JSON.stringify({ ...input, savedAt: Date.now() });
    } catch {
        return;
    }
    if (serialized.length > MAX_DRAFT_CHARS) return;

    try {
        window.localStorage.setItem(key, serialized);
    } catch {
        // Most likely the quota. Drop this user's other drafts and retry once,
        // otherwise a full origin would disable drafts permanently.
        try {
            for (const other of draftKeys(input.userId)) {
                if (other !== key) window.localStorage.removeItem(other);
            }
            window.localStorage.setItem(key, serialized);
        } catch {
            /* give up silently; the server save is still the primary path */
        }
    }
}

/**
 * Removes the draft for (userId, noteId).
 *
 * Pass `onlyIfRevUpTo` with the revision captured when a server save started:
 * if the user typed while that save was in flight the stored draft will carry a
 * higher rev, and clearing it would leave those newer edits unprotected.
 */
export function clearDraft(
    userId: string,
    noteId: string,
    onlyIfRevUpTo?: number,
): void {
    if (typeof window === "undefined") return;
    try {
        if (onlyIfRevUpTo !== undefined) {
            const existing = readDraft(userId, noteId);
            if (existing && existing.rev > onlyIfRevUpTo) return;
        }
        window.localStorage.removeItem(draftKey(userId, noteId));
    } catch {
        /* storage unavailable */
    }
}

/** Removes every draft, or every draft for one user. Call on logout. */
export function clearAllDrafts(userId?: string): void {
    if (typeof window === "undefined") return;
    try {
        for (const key of draftKeys(userId)) {
            window.localStorage.removeItem(key);
        }
    } catch {
        /* storage unavailable */
    }
}

function draftKeys(userId?: string): string[] {
    // `window.localStorage` itself throws when cookies are blocked, so it has
    // to be touched inside the caller's try.
    const prefix = userId ? `${DRAFT_PREFIX}${userId}:` : DRAFT_PREFIX;
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key?.startsWith(prefix)) keys.push(key);
    }
    return keys;
}

/** Decides what the editor should open with. Pure. */
export function resolveDraft(
    note: Note,
    draft: NoteDraft | null,
): DraftResolution {
    if (!draft || draft.noteId !== note.id) return { kind: "none" };

    // The server already holds this content: the save landed and only the
    // clear was lost. Nothing to recover, so don't prompt.
    if (jsonEquals(draft.content, note.content)) return { kind: "none" };

    return draft.baseUpdatedAt === serverBaseline(note)
        ? { kind: "restore", draft }
        : { kind: "conflict", draft };
}

function jsonEquals(a: unknown, b: unknown): boolean {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return false;
    }
}

/**
 * Reads and resolves the draft the editor should open with, dropping one that
 * is no longer needed. Reads localStorage, so call it once on mount only.
 */
export function loadDraftResolution(
    userId: string,
    note: Note,
): DraftResolution {
    const draft = readDraft(userId, note.id);
    const resolved = resolveDraft(note, draft);
    if (draft && resolved.kind === "none") clearDraft(userId, note.id);
    return resolved;
}

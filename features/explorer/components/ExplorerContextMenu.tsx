"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { Copy, FilePlus, FolderPlus, Pencil, Trash2 } from "lucide-react";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";

// How far (px) a finger may drift during a long press before it counts as a scroll.
const TOUCH_MOVE_TOLERANCE = 10;

// Touch pointerdowns already claimed by a nested (inner) explorer menu.
const claimedPointerDowns = new WeakSet<Event>();

type ExplorerAction = () => void;

interface BlankActions {
    onCreateNote: ExplorerAction;
    onCreateFolder: ExplorerAction;
}

interface FolderActions extends BlankActions {
    onRename: ExplorerAction;
    onDelete: ExplorerAction;
}

interface NoteActions {
    onRename: ExplorerAction;
    onDuplicate: ExplorerAction;
    onDelete: ExplorerAction;
}

// Each target only accepts the actions its menu shows.
type ExplorerContextMenuProps = { children: ReactNode } & (
    | ({ target: "blank" } & BlankActions)
    | ({ target: "folder" } & FolderActions)
    | ({ target: "note" } & NoteActions)
);

/**
 * Right-click menu for the explorer. The items depend on what was clicked:
 * - blank: empty space in the explorer (creates at the root)
 * - folder: a folder (creates inside it)
 * - note: a single note
 *
 * Nested menus are safe: the innermost trigger handles the event and the
 * outer ones ignore it.
 *
 * On touch, Radix opens the menu after a 700ms long press. Two fixes on top:
 * - Every nested trigger starts its own long-press timer, so without
 *   intervention a note's menu and the explorer's menu open stacked. Outer
 *   triggers call preventDefault on a pointerdown an inner one already
 *   claimed, which makes Radix skip their timer.
 * - Radix cancels the long press on any pointermove, and fingers always
 *   jitter. Small moves call preventDefault so Radix keeps the timer.
 */
export default function ExplorerContextMenu(props: ExplorerContextMenuProps) {
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    // Creating or renaming opens an inline name field, which needs focus. The
    // menu still traps focus when onSelect runs, and hands it back to its
    // trigger once closed, so the action waits until the menu has closed and
    // skips that.
    const pendingCreateRef = useRef<ExplorerAction | null>(null);
    const nodeId = useRef<string | null>(null)
    const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
        const id = event.currentTarget.dataset.id
        if(id) nodeId.current = id
        if (event.pointerType === "mouse") return;
        console.log(event.nativeEvent)
        if (claimedPointerDowns.has(event.nativeEvent)) {
            touchStartRef.current = null;
            event.preventDefault();
            return;
        }

        claimedPointerDowns.add(event.nativeEvent);
        touchStartRef.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
        const start = touchStartRef.current;
        if (event.pointerType === "mouse" || !start) return;

        const distance = Math.hypot(
            event.clientX - start.x,
            event.clientY - start.y,
        );
        if (distance < TOUCH_MOVE_TOLERANCE) {
            event.preventDefault();
        } else {
            touchStartRef.current = null;
        }
    };

    const clearTouchStart = () => {
        touchStartRef.current = null;
    };

    const selectCreate = (action: ExplorerAction) => () => {
        pendingCreateRef.current = action;
    };

    const handleCloseAutoFocus = (event: Event) => {
        const action = pendingCreateRef.current;
        if (!action) return;
        pendingCreateRef.current = null;
        event.preventDefault();
        action();
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger
                asChild
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={clearTouchStart}
                onPointerCancel={clearTouchStart}
            >
                {props.children}
            </ContextMenuTrigger>
            <ContextMenuContent
                className="w-48"
                onCloseAutoFocus={handleCloseAutoFocus}
            >
                {props.target !== "note" && (
                    <>
                        <ContextMenuItem onSelect={selectCreate(props.onCreateNote)}>
                            <FilePlus />
                            New Note
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={selectCreate(props.onCreateFolder)}>
                            <FolderPlus />
                            New Folder
                        </ContextMenuItem>
                    </>
                )}

                {props.target !== "blank" && (
                    <>
                        {props.target === "folder" && <ContextMenuSeparator />}
                        <ContextMenuItem onSelect={selectCreate(props.onRename)}>
                            <Pencil />
                            Rename
                        </ContextMenuItem>
                        {props.target === "note" && (
                            <ContextMenuItem onSelect={props.onDuplicate}>
                                <Copy />
                                Duplicate
                            </ContextMenuItem>
                        )}
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            variant="destructive"
                            onSelect={props.onDelete}
                        >
                            <Trash2 />
                            Delete
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}

"use client";

import { useRef } from "react";

import { useSidebar } from "@/shared/components/ui/sidebar";

const MIN_WIDTH = 250;
const MAX_WIDTH = 480;
// Dragging narrower than this closes the sidebar. Kept below MIN_WIDTH so the
// sidebar first stops at its minimum and only closes on a deliberate pull.
const COLLAPSE_WIDTH = 190;
// Matches SIDEBAR_WIDTH in the sidebar primitive.
const DEFAULT_WIDTH = "16rem";

// Applied to the sidebar wrapper while dragging. The sidebar animates width
// changes, which would make it trail behind the cursor.
const DRAGGING_CLASSES = ["select-none", "**:transition-none!"];

interface DragState {
    startX: number;
    startWidth: number;
    wrapper: HTMLElement;
    collapsed: boolean;
}

// Mouse-only: touch and pen pointers are ignored, and the handle is not
// rendered at all on coarse-pointer devices or in the mobile sheet.
export default function SidebarResizeHandle() {
    const { isMobile, setOpen } = useSidebar();
    const dragRef = useRef<DragState | null>(null);

    if (isMobile) return null;

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;

        const handle = event.currentTarget;
        const container = handle.closest<HTMLElement>('[data-slot="sidebar-container"]');
        const wrapper = handle.closest<HTMLElement>('[data-slot="sidebar-wrapper"]');
        if (!container || !wrapper) return;

        event.preventDefault();
        handle.setPointerCapture(event.pointerId);
        wrapper.classList.add(...DRAGGING_CLASSES);
        dragRef.current = {
            startX: event.clientX,
            startWidth: container.getBoundingClientRect().width,
            wrapper,
            collapsed: false,
        };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) return;

        const rawWidth = drag.startWidth + event.clientX - drag.startX;

        if (rawWidth < COLLAPSE_WIDTH) {
            if (drag.collapsed) return;
            drag.collapsed = true;
            setOpen(false);
            return;
        }

        // Dragging back out before releasing reopens it under the cursor.
        if (drag.collapsed) {
            drag.collapsed = false;
            setOpen(true);
        }

        const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, rawWidth));
        drag.wrapper.style.setProperty("--sidebar-width", `${width}px`);
    };

    // Fires after pointerup and pointercancel alike, so it is the one place
    // the drag ends.
    const handleLostPointerCapture = () => {
        const drag = dragRef.current;
        if (!drag) return;

        // Reopening later (e.g. from the header toggle) should restore the
        // width from before this drag, not the minimum. Done only now, while
        // the sidebar is already off-screen and transitions are still off:
        // widening it at the moment of collapse showed for a frame before the
        // close rendered.
        if (drag.collapsed) {
            drag.wrapper.style.setProperty("--sidebar-width", `${drag.startWidth}px`);
        }
        drag.wrapper.classList.remove(...DRAGGING_CLASSES);
        dragRef.current = null;
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.currentTarget
            .closest<HTMLElement>('[data-slot="sidebar-wrapper"]')
            ?.style.setProperty("--sidebar-width", DEFAULT_WIDTH);
    };

    return (
        <div
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onLostPointerCapture={handleLostPointerCapture}
            onDoubleClick={handleDoubleClick}
            className="absolute inset-y-0 -right-1 z-20 hidden w-2 cursor-col-resize pointer-fine:block after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:transition-colors hover:after:bg-sidebar-ring"
        />
    );
}

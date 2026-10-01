"use client";

import type { ReactNode } from "react";

interface TagOptionProps {
    id: string;
    active: boolean;
    onClick: () => void;
    onHover: () => void;
    children: ReactNode;
}

// Not tabbable: the arrow keys move between options while typing.
export default function TagOption({ id, active, onClick, onHover, children }: TagOptionProps) {
    return (
        <button
            id={id}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={active}
            onClick={onClick}
            onMouseMove={onHover}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-popover-foreground outline-none aria-selected:bg-accent cursor-pointer"
        >
            {children}
        </button>
    );
}

"use client";

import { cn } from "@/shared/lib/utils";

import { logOutAction } from "@/features/auth"
import { clearAllDrafts } from "@/features/nodes"

interface LogOutButtonProps {
    className?: string;
    children?: React.ReactNode;
}

export default function LogOutButton({ className, children }: LogOutButtonProps) {
    const handleLogOut = async () => {
        // Drafts live in localStorage, which is shared by everyone who uses
        // this browser. Never leave them behind for the next person.
        clearAllDrafts();
        await logOutAction();
    };

    return (
        <button onClick={handleLogOut} className={cn("cursor-pointer", className)} title="Log Out">
            {children}
        </button>
    );
}

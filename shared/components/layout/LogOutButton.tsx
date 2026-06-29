import { cn } from "@/shared/lib/utils";

import { logOutAction } from "@/features/auth"

interface LogOutButtonProps {
    className?: string;
    children?: React.ReactNode;
}

export default function LogOutButton({ className, children }: LogOutButtonProps) {
    return (
        <button onClick={logOutAction} className={cn("cursor-pointer", className)} title="Log Out">
            {children}
        </button>
    );
}

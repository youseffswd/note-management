"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import LogOutButton from "./LogOutButton";
import { isNavItemActive, navItems } from "./nav-items";

const railButtonClass = "p-3 rounded-md transition-colors";

function RailTooltip({ content, children }: { content: string; children: React.ReactElement }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
                {content}
            </TooltipContent>
        </Tooltip>
    );
}

export default function LeftRail() {
    const pathname = usePathname();

    return (
        <TooltipProvider delayDuration={100}>
            <div className="hidden lg:flex relative z-50 w-14 flex-col items-center py-4 border-r border-border bg-sidebar shrink-0">
                <nav aria-label="Main navigation" className="flex-1 flex flex-col gap-1">
                    {navItems.map(item => {
                        const isActive = isNavItemActive(pathname, item.href);
                        return (
                            <RailTooltip key={item.href} content={item.tooltip ?? item.label}>
                                <Link
                                    href={item.href}
                                    aria-label={item.label}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        railButtonClass,
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                </Link>
                            </RailTooltip>
                        );
                    })}
                </nav>

                {/* Logout at bottom of rail */}
                <div className="flex flex-col gap-4 mt-auto">
                    <RailTooltip content="Log out">
                        <LogOutButton
                            aria-label="Log out"
                            className={cn(railButtonClass, "text-muted-foreground hover:text-foreground hover:bg-accent")}
                        >
                            <LogOutIcon className="w-5 h-5" />
                        </LogOutButton>
                    </RailTooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}

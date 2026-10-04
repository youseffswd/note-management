"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import LogOutButton from "./LogOutButton";
import { isNavItemActive, navItems } from "./nav-items";

export function MobileBottomNav() {
    const pathname = usePathname();
    return (
        <nav aria-label="Main navigation" className="relative z-50 flex h-[calc(4rem+env(safe-area-inset-bottom))] items-center justify-around border-t border-border bg-sidebar px-2 pb-[env(safe-area-inset-bottom)]">
            {navItems.map((item) => {
                const isActive = isNavItemActive(pathname, item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <item.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
            <LogOutButton className="flex flex-col items-center justify-center w-16 h-full transition-colors text-muted-foreground hover:text-foreground">
                <LogOutIcon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">Log Out</span>
            </LogOutButton>
        </nav>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileIcon, StarIcon, TagIcon, LogOutIcon } from "lucide-react";

import LogOutButton from "./LogOutButton";

const navItems = [
    { href: "/dashboard", icon: FileIcon, label: "Notes" },
    { href: "/dashboard/starred", icon: StarIcon, label: "Starred" },
    { href: "/dashboard/tags", icon: TagIcon, label: "Tags" },
];

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex items-center justify-around px-4 pb-safe z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
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

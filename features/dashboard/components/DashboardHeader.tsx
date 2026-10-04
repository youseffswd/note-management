"use client";

import Link from "next/link";
import { ArrowUpRightIcon, ChevronDownIcon, LogOutIcon, SettingsIcon } from "lucide-react";

import { useAuthStore } from "@/features/auth";
import { Logo } from "@/shared/components/Logo";
import LogOutButton from "@/shared/components/layout/LogOutButton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function DashboardHeader() {
    const user = useAuthStore(state => state.user);

    return (
        <header className="relative z-20 border-b border-white/5">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
                <div className="flex min-w-0 items-center gap-5">
                    <Link href="/dashboard" aria-label="NoteFlow dashboard" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                        <Logo size="sm" />
                    </Link>
                    <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
                    <span className="hidden text-sm text-muted-foreground sm:block">Dashboard</span>
                </div>

                <nav aria-label="Dashboard navigation" className="flex shrink-0 items-center gap-3 sm:gap-6">
                    <Link href="/dashboard/notes" className="hidden items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:flex">
                        Open workspace
                        <ArrowUpRightIcon aria-hidden="true" className="size-4" />
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 pr-2 text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring" aria-label="Account menu">
                            <span className="flex size-9 items-center justify-center rounded-full border border-primary/25 bg-primary/15 text-sm font-semibold text-primary">
                                {user?.email?.charAt(0).toUpperCase() || "N"}
                            </span>
                            <ChevronDownIcon aria-hidden="true" className="size-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60 rounded-xl p-2" sideOffset={10}>
                            <DropdownMenuLabel className="truncate px-2 py-2">{user?.email || "Your account"}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="gap-2 p-2">
                                    <SettingsIcon aria-hidden="true" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <LogOutButton className="w-full gap-2 p-2">
                                    <LogOutIcon aria-hidden="true" />
                                    Log out
                                </LogOutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </div>
        </header>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SettingsIcon } from "lucide-react";

import { Explorer } from "@/features/nodes";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
} from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/shared/store/auth.store";
import {Folder,Note} from "@/shared/types"
interface AppSidebarProps {
    folders: Folder[];
    notes: Note[];
}
export function AppSidebar({folders,notes}: AppSidebarProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    return (
        <Sidebar className="lg:ms-14">

                <SidebarContent>
                    <SidebarGroup className="flex-1">
                        <SidebarGroupContent>
                            <Explorer folders={folders} notes={notes} />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Account & Settings at the very bottom */}
                <SidebarFooter className="border-t border-sidebar-border p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-medium leading-none">
                                    {user?.email}
                                </span>
                            </div>
                        </div>

                        <Button variant="ghost" size="icon" asChild>
                            <Link
                                href="/dashboard/settings"
                                className={
                                    pathname === "/dashboard/settings"
                                        ? "text-primary"
                                        : ""
                                }
                                title="Settings"
                            >
                                <SettingsIcon className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </SidebarFooter>
        </Sidebar>
    );
}

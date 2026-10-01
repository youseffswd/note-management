"use client";

import { ReactNode } from "react";

import {
    SidebarProvider,
    SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import LeftRail from "./LeftRail";
import { NodeStoreInitializer, NoteBreadcrumb } from "@/features/nodes";
import type { Folder, Note } from "@/features/nodes";
interface AppLayoutProps {
    children: ReactNode;
    folders: Folder[];
    notes: Note[];
}

export default function AppLayout({ children, folders, notes }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <NodeStoreInitializer folders={folders} notes={notes} />
            <div className="flex h-screen w-full overflow-hidden">
                {/* Desktop Left Rail — hidden on mobile */}
                <LeftRail  />

                {/* Shadcn Sidebar — Explorer Panel (toggleable, becomes Sheet on mobile) */}
              
                    <AppSidebar />
                

                {/* Main content column */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top header with sidebar toggle */}
                    <header className="h-14 flex items-center gap-3 px-4 border-b border-border shrink-0 bg-background">
                        <SidebarTrigger />
                        <NoteBreadcrumb />
                    </header>

                    {/* Page content */}
                    <main className="flex-1 overflow-auto p-4 lg:p-8 bg-background">
                        {children}
                    </main>

                    {/* Mobile Bottom Nav — hidden on desktop */}
                    <div className="lg:hidden">
                        <MobileBottomNav />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}

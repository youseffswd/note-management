"use client";

import type { ReactNode } from "react";

import {
    SidebarProvider,
    SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import LeftRail from "./LeftRail";
import SectionTitle from "./SectionTitle";
import { NoteBreadcrumb } from "@/features/nodes";
import NoteActions from "./NoteActions";
interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <div className="flex h-dvh w-full overflow-hidden">
                {/* Desktop Left Rail — hidden on mobile */}
                <LeftRail />

                {/* Shadcn Sidebar — Explorer Panel (toggleable, becomes Sheet on mobile) */}
                <AppSidebar />

                {/* Main content column */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top header with sidebar toggle */}
                    <header className="h-14 flex items-center gap-3 px-4 border-b border-border shrink-0 bg-background">
                        <SidebarTrigger />
                        <NoteBreadcrumb />
                        <SectionTitle />
                        <div className="ml-auto flex items-center gap-1">
                            <NoteActions />
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="min-h-0 flex-1 overflow-auto p-4 lg:p-8 bg-background">
                        {children}
                    </main>

                    {/* Mobile Bottom Nav — hidden on desktop */}
                    <div className="shrink-0 lg:hidden">
                        <MobileBottomNav />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}

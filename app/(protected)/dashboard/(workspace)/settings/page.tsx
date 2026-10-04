"use client";

import { Button } from "@/shared/components/ui/button";
import { logOutAction } from "@/features/auth";
import { LogOutIcon, SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6" /> Settings
                </h1>
                <p className="text-muted-foreground mt-1">Manage your account and application preferences.</p>
            </div>
            
            <div className="p-6 bg-card border border-border rounded-lg space-y-4">
                <h2 className="text-lg font-semibold">Account</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">User</p>
                        <p className="text-sm text-muted-foreground">Free plan</p>
                    </div>
                    <Button variant="destructive" onClick={logOutAction}>
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
}

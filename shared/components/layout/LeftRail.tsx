import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileIcon, LogOutIcon, StarIcon, TagIcon } from "lucide-react";

;
import LogOutButton from "./LogOutButton";

export default function LeftRail() {
    const pathname = usePathname();
    const railItems = [
        { href: "/dashboard/notes", icon: FileIcon, label: "Notes" },
        { href: "/dashboard/starred", icon: StarIcon, label: "Starred" },
        { href: "/dashboard/tags", icon: TagIcon, label: "Tags" },
    ];

    return (
        <div className="hidden lg:flex relative z-50 w-14 flex-col items-center py-4 border-r border-border bg-sidebar shrink-0">
            <nav className="flex-1 flex flex-col gap-1">
                {railItems.map(item => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`p-3 rounded-md transition-colors ${
                                isActive
                                    ? "text-primary bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5" />
                        </Link>
                    );
                })}
            </nav>

            {/* Logout at bottom of rail */}
            <div className="flex flex-col gap-4 mt-auto">
                <LogOutButton className="p-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <LogOutIcon className="w-5 h-5" />
                </LogOutButton>
            </div>
        </div>
    );
}

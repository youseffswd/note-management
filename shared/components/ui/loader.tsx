import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "default" | "primary" | "muted";
    text?: string;
    fullPage?: boolean;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
};

const variantClasses = {
    default: "text-foreground",
    primary: "text-primary",
    muted: "text-muted-foreground",
};

export function Loader({
    size = "md",
    variant = "primary",
    text,
    fullPage = false,
    className,
    ...props
}: LoaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3",
                fullPage && "min-h-[400px] w-full flex-1",
                className
            )}
            {...props}
        >
            <Loader2
                className={cn(
                    "animate-spin",
                    sizeClasses[size],
                    variantClasses[variant]
                )}
            />
            {text && (
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}


import {
    Field,
    FieldLabel,
    FieldError,
} from "@/shared/components/ui/field";

import { Input } from "@/shared/components/ui/input";



interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    rightElement?: React.ReactNode;
    errorMessage?: string;
}

export default function AuthInput({
    label,
    className,
    children,
    rightElement,
    errorMessage,
    id,
    ...props
}: InputProps) {
    return (
        <Field data-invalid={!!errorMessage}>
            <FieldLabel htmlFor={id} className="text-xs text-muted-foreground">
                {label}
            </FieldLabel>
            <div className="relative flex items-center">
                <Input
                    id={id}
                    {...props}
                    aria-invalid={!!errorMessage}
                    className={`border border-border h-10 bg-input focus-visible:ring-0 placeholder:text-sm placeholder:text-white/50 ${rightElement ? "pr-10" : ""} ${className}`}
                />
                {rightElement && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        {rightElement}
                    </div>
                )}
            </div>
            {children}
            {errorMessage && <FieldError className="text-xs">{errorMessage}</FieldError>}
        </Field>
    );
}

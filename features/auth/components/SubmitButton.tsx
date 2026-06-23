"use client";
import { Button } from "@/shared/components/ui/button";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
    defaultText: string;
    pendingText: string;
}

export default function SubmitButton({
    defaultText,
    pendingText,
}: SubmitButtonProps) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="py-2 hover:bg-primary/95 hover:shadow-primary/20 hover:shadow-lg transition duration-350"
        >
            {pending ? pendingText : defaultText}
        </Button>
    );
}

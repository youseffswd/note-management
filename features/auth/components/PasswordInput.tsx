"use client";
import { useState } from "react";
import AuthInput from "./AuthInput";
import {
    getPasswordStrength,
    StrengthLevel,
} from "../api/password-strength.service";
import { Button } from "@/shared/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const getBgColor = (strength: StrengthLevel) => {
    switch (strength) {
        case "weak":
            return "bg-red-500";
        case "fair":
            return "bg-yellow-500";
        case "good":
            return "bg-blue-500";
        case "excellent":
            return "bg-green-500";
        default:
            return "";
    }
};
const score: { [key in StrengthLevel]: number } = {
    empty: 0,
    weak: 1,
    fair: 2,
    good: 3,
    excellent: 4,
};

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    strengthMeter?: boolean;
    errorMessage?: string;
    isPending: boolean;
    setPassword: (password: string) => void;
}

export default function PasswordInput({
    strengthMeter = false,
    errorMessage,
    isPending,
    setPassword,
    ...props
}: PasswordInputProps) {
    const [strength, setStrength] = useState<StrengthLevel>("empty");
    const [showPassword, setShowPassword] = useState(false);
    const passwordChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStrength(getPasswordStrength(e.target.value));
        setPassword(e.target.value);
    };
    const bgColor = getBgColor(strength);
    const [prevIsPending, setPrevIsPending] = useState(isPending);

    if (isPending !== prevIsPending) {
        setPrevIsPending(isPending);
        if (!isPending) {

            queueMicrotask(() => {
                setPassword("");
                setStrength("empty");
                setShowPassword(false);
            });
        }
    }

    return (
        <AuthInput
            label="Password"
            type={showPassword ? "text" : "password"}
            onChange={passwordChangeHandler}
            placeholder="Create a strong password"
            id="password"
            name="password"
            errorMessage={errorMessage}
            {...props}
            rightElement={
                <Button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    size="icon"
                    variant="ghost"
                    className="p-0 w-8 h-8 hover:bg-transparent text-muted-foreground hover:text-foreground"
                >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </Button>
            }
        >
            {strengthMeter && (
                <div className="flex gap-1 mt-1">
                    <span
                        className={`w-full h-1 rounded ${score[strength] > 0 ? bgColor : "bg-accent"}`}
                    ></span>
                    <span
                        className={`w-full h-1 rounded ${score[strength] > 1 ? bgColor : "bg-accent"}`}
                    ></span>
                    <span
                        className={`w-full h-1 rounded ${score[strength] > 2 ? bgColor : "bg-accent"}`}
                    ></span>
                    <span
                        className={`w-full h-1 rounded ${score[strength] > 3 ? bgColor : "bg-accent"}`}
                    ></span>
                </div>
            )}
        </AuthInput>
    );
}

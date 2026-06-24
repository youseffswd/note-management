"use client";
import {
    FieldGroup,
    FieldSet,
} from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { Info, AlertCircle, Sparkles } from "lucide-react";

import AuthInput from "../AuthInput";
import PasswordInput from "../PasswordInput";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/api/auth.action";
import SubmitButton from "../SubmitButton";
import { SignInStore, useSignInStore } from "../../store/auth.store";
import { loginSchema } from "../../validations/auth.validation";
import z from "zod";

export default function SignInForm({ message }: { message?: string }) {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    const {
        email, setEmail,
        password, setPassword,
        errors: storeErrors,
        setFieldError
    } = useSignInStore();

    const handleBlur = (field: keyof NonNullable<SignInStore["errors"]> , value: string) => {
        const data = { email, password, [field]: value };
        const result = loginSchema.safeParse(data);
        if (!result.success) {
            const errors = z.flattenError(result.error).fieldErrors;
            setFieldError(field, errors[field]);
        } else {
            setFieldError(field, undefined);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {state?.message ? (
                <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md flex items-start gap-3 text-sm border border-destructive/20">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{state.message}</p>
                </div>
            ) : message ? (
                <div className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-md flex items-start gap-3 text-sm border border-emerald-500/20">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{message}</p>
                </div>
            ) : null}

            <form action={formAction}>
                <input type="hidden" name="email" value="demo@noteflow.com" />
                <input type="hidden" name="password" value="123456789" />
                <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full font-medium flex items-center justify-center gap-2 h-10"
                    disabled={isPending}
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    Tester Fast Sign In
                </Button>
            </form>

            <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
            </div>

            <form action={formAction}>
                <FieldGroup>
                    <FieldSet>
                        <AuthInput
                            label="Email"
                            type="email"
                            placeholder="Enter Your Email"
                            id="email"
                            name="email"
                            defaultValue={state?.fields?.email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => handleBlur('email', e.target.value)}
                            errorMessage={storeErrors?.email?.[0] || state?.errors?.email?.[0]}
                        />
                        <PasswordInput
                            isPending={isPending}
                            setPassword={setPassword}
                            onBlur={(e) => handleBlur('password', e.target.value)}
                            errorMessage={storeErrors?.password?.[0] || state?.errors?.password?.[0]}
                            defaultValue={state?.fields?.password}
                            placeholder="Enter Your Password"
                        />
                        <SubmitButton defaultText="Sign In" pendingText="Signing In..." />
                    </FieldSet>
                </FieldGroup>
            </form>
        </div>
    );
}

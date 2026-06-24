"use client";
import {
    FieldGroup,
    FieldSet,
} from "@/shared/components/ui/field";

import AuthInput from "../AuthInput";
import PasswordInput from "../PasswordInput";


import { useActionState } from "react";
import { signUpAction } from "@/features/auth/api/auth.action";
import SubmitButton from "../SubmitButton";
import Agreement from "./Agreement";
import { SignUpStore, useSignUpStore } from "../../store/auth.store";
import { signUpSchema } from "../../validations/auth.validation";
import z from "zod";

export default function SignUpForm() {
    const [state, formAction, isPending] = useActionState(signUpAction, null);
    
    const {
        fullName, setFullName,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        agreeTerms,
        errors: storeErrors,
        setFieldError
    } = useSignUpStore();

    const handleBlur = (field: keyof NonNullable<SignUpStore["errors"]> , value: string) => {
        const data = { fullName, email, password, confirmPassword, agreeTerms, [field]: value };
        const result = signUpSchema.safeParse(data);
        if (!result.success) {
            const errors = z.flattenError(result.error).fieldErrors;
            setFieldError(field, errors[field]);
        } else {
            setFieldError(field, undefined);
        }
    };

    return (
        <form action={formAction}>
            <FieldGroup>
                <FieldSet>
                    <AuthInput
                        label="Full Name"
                        type="text"
                        placeholder="Yousef Sayed"
                        id="fullName"
                        name="fullName"
                        defaultValue={state?.fields?.fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={(e) => handleBlur('fullName', e.target.value)}
                        errorMessage={storeErrors?.fullName?.[0] || state?.errors?.fullName?.[0]}
                    />
                    <AuthInput
                        label="Email"
                        type="email"
                        placeholder="yousef@example.com"
                        id="email"
                        name="email"
                        defaultValue={state?.fields?.email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => handleBlur('email', e.target.value)}
                        errorMessage={storeErrors?.email?.[0] || state?.errors?.email?.[0]}
                    />
                    <PasswordInput
                        strengthMeter
                        isPending={isPending}
                        setPassword={setPassword}
                        onBlur={(e) => handleBlur('password', e.target.value)}
                        errorMessage={storeErrors?.password?.[0] || state?.errors?.password?.[0]}
                        defaultValue={state?.fields?.password}
                    />
                    <AuthInput
                        label="Confirm Password"
                        type="password"
                        placeholder="Repeat your password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
                        errorMessage={storeErrors?.confirmPassword?.[0] || state?.errors?.confirmPassword?.[0]}
                    />
                    <Agreement state={state} />
                    {state?.message && (
                        <p className="text-sm text-destructive text-center font-medium">
                            {state.message}
                        </p>
                    )}
                  <SubmitButton defaultText="Sign Up" pendingText="Creating Account..." />

                </FieldSet>
            </FieldGroup>
        </form>
    );
}

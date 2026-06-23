"use server"

import { z } from "zod";
import { signUpSchema } from "../validations/auth.validation";
import { signUp } from "./auth.service";
import { redirect } from "next/navigation";




export async function signUpAction(_prevState: SignUpState | null, formData: FormData): Promise<SignUpState | null> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const agreeTerms = formData.get("agreeTerms") === "on";

    const validatedFields = signUpSchema.safeParse({
        email,
        password,
        fullName,
        confirmPassword,
        agreeTerms,
    });
    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            fields: {
                email,
                fullName,
                password,
                agreeTerms,
            },
        };
    }

    try {
        await signUp(email, password, fullName);
    } catch (error) {
        console.error("Sign up error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return {
            message: errorMessage,
        };
    }
    redirect("/login?message=Check your email to confirm your account");
}







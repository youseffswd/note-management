"use server"

import { z } from "zod";
import { signUpSchema, loginSchema } from "../validations/auth.validation";
import { signUp, login, logOut } from "./auth.service";
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

export async function loginAction(_prevState: SignInState | null, formData: FormData): Promise<SignInState | null> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validatedFields = loginSchema.safeParse({
        email,
        password,
    });

    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            fields: {
                email,
                password,
            },
        };
    }

    try {
        await login(email, password);
    } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return {
            message: errorMessage,
        };
    }
    
    redirect("/dashboard");
    
}
export async function logOutAction() {
    await logOut();
    redirect("/login");
}







import { z } from "zod";

const loginSchema = z.object({
    email: z.string().trim().email("invalid email address"),
});

const signUpSchema = loginSchema
    .extend({
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
            ),
        confirmPassword: z.string(),
        fullName: z
            .string()
            .trim()
            .min(2, "full name must be at least 2 characters long"),
        agreeTerms: z.boolean().refine((val) => val === true, {
            message: "You must agree to the terms and privacy policy",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export { loginSchema, signUpSchema };

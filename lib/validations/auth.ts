import { z } from "zod";

const loginSchema = z.object({
    email: z.string().trim().email("invalid email address"),
    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character",
        ),
});

const signUpSchema = loginSchema.extend({
    fullName: z
        .string()
        .trim()
        .min(2, "full name must be at least 2 characters long"),
});

export { loginSchema, signUpSchema };

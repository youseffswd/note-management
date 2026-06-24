import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { User } from "@supabase/supabase-js";


export interface SignUpStore extends Fields,FieldSetters {
    errors?: {
        [k in keyof Fields]?: string[]
    };
    message?: string;
    clearStore: () => void;
}


export const useSignUpStore = create<SignUpStore>()(
    immer((set) => ({
        fullName: "",
        setFullName: (fullName) => set((state) => { state.fullName = fullName; }),
        email: "",
        setEmail: (email) => set((state) => { state.email = email; }),
        password: "",
        setPassword: (password) => set((state) => { state.password = password; }),
        confirmPassword: "",
        setConfirmPassword: (confirmPassword) => set((state) => { state.confirmPassword = confirmPassword; }),
        agreeTerms: false,
        setAgreeTerms: (agreeTerms) => set((state) => { state.agreeTerms = agreeTerms; }),
        errors: {},
        setFieldError: (field, error) => set((state) => { 
            if (!state.errors) state.errors = {};
            state.errors[field] = error; 
        }),
        message: "",
        clearStore: () => set((state) => {
            state.fullName = "";
            state.email = "";
            state.password = "";
            state.confirmPassword = "";
            state.agreeTerms = false;
            state.errors = {};
            state.message = "";
        }),

    }))
);

export interface SignInStore extends SignInFields, SignInFieldSetters {
    errors?: {
        [k in keyof SignInFields]?: string[]
    };
    message?: string;
    clearStore: () => void;
}

export const useSignInStore = create<SignInStore>()(
    immer((set) => ({
        email: "",
        setEmail: (email) => set((state) => { state.email = email; }),
        password: "",
        setPassword: (password) => set((state) => { state.password = password; }),
        errors: {},
        setFieldError: (field, error) => set((state) => { 
            if (!state.errors) state.errors = {};
            state.errors[field] = error; 
        }),
        message: "",
        clearStore: () => set((state) => {
            state.email = "";
            state.password = "";
            state.errors = {};
            state.message = "";
        }),
    }))
);

export interface AuthStore {
    user: User | null;
    setUser(user: User): void;
    clearUser(): void;
}


export const useAuthStore = create<AuthStore>()(
    immer((set) => ({
        user: null,
        setUser: (user) => set((state) => { state.user = user; }),
        clearUser: () => set((state) => { state.user = null; }),
    }))
);



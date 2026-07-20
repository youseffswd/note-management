import { create } from "zustand";
import { immer } from "zustand/middleware/immer";



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




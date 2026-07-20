import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";


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

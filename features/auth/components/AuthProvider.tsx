"use client";

import { useEffect } from "react";
import { createClientSupabase } from "@/shared/lib/supabase/client";
import { useAuthStore } from "@/shared/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    useEffect(() => {
        const supabase = createClientSupabase();

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                clearUser();
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                clearUser();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setUser, clearUser]);

    return <>{children}</>;
}

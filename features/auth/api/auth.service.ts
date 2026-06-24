import { createServerSupabase } from "@/shared/lib/supabase/server";
import { ResponseError } from "@/shared/lib/errors";

export async function login(email: string, password: string) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login error:", error);
        throw new ResponseError(error.message, error.status || 500);
    }
    return data;
}
export async function signUp(email: string, password: string,fullName: string) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    if (error) {
        console.error("Sign up error:", error);
        throw new ResponseError(error.message, error.status || 500);
    }
    
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new ResponseError("An account with this email already exists.", 400);
    }

    return data;
}
export async function logOut() {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout error:", error);
        throw new ResponseError(error.message, error.status || 500);
    }
}
export async function deleteAccount() {}

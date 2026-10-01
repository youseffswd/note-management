"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/features/auth";
import { useStarredStore } from "@/features/starred";
import { useTagsStore } from "@/features/tags";
import { browserStorage } from "@/shared/lib/browser-storage";
import { migrateNoteMeta } from "@/shared/lib/migrate-note-meta";

/** The app composes feature lifecycles; nodes only initializes notes and folders. */
export default function NoteFeaturesInitializer() {
    const userId = useAuthStore(state => state.user?.id);
    const bindStarredOwner = useStarredStore(state => state.bindOwner);
    const bindTagsOwner = useTagsStore(state => state.bindOwner);

    useEffect(() => {
        migrateNoteMeta(browserStorage);
        void useStarredStore.persist.rehydrate();
        void useTagsStore.persist.rehydrate();
    }, []);

    useEffect(() => {
        if (!userId) return;
        bindStarredOwner(userId);
        bindTagsOwner(userId);
    }, [bindStarredOwner, bindTagsOwner, userId]);

    return null;
}

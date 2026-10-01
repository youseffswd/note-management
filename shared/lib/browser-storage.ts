import type { StateStorage } from "zustand/middleware";

// Never access Node's localStorage global during server rendering.
export const browserStorage = {
    getItem: name =>
        typeof window === "undefined" ? null : window.localStorage.getItem(name),
    setItem: (name, value) => {
        if (typeof window !== "undefined") window.localStorage.setItem(name, value);
    },
    removeItem: name => {
        if (typeof window !== "undefined") window.localStorage.removeItem(name);
    },
} satisfies StateStorage;

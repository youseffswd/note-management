"use client";

import { useSyncExternalStore } from "react";

const mediaQuery = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
    const media = window.matchMedia(mediaQuery);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

function getSnapshot() {
    return window.matchMedia(mediaQuery).matches;
}

function getServerSnapshot() {
    return true;
}

/** Also stop active loops when the preference changes without a page reload. */
export function useLandingReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

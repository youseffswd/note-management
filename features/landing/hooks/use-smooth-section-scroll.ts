"use client";

import { useCallback, useEffect, useRef, type MouseEvent } from "react";
import { animate } from "framer-motion";
import { useLandingReducedMotion } from "./use-landing-reduced-motion";

const scrollKeys = new Set([
    "ArrowUp",
    "ArrowDown",
    "PageUp",
    "PageDown",
    "Home",
    "End",
    " ",
    "Escape",
    "Tab",
]);

/** Animate anchor clicks only; wheel, touch, and keyboard scrolling stay native. */
export function useSmoothSectionScroll() {
    const animation = useRef<ReturnType<typeof animate> | null>(null);
    const reducedMotion = useLandingReducedMotion();
    const stop = useCallback(() => {
        animation.current?.stop();
        animation.current = null;
    }, []);

    useEffect(() => {
        if (reducedMotion) stop();
    }, [reducedMotion, stop]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (scrollKeys.has(event.key)) stop();
        };

        window.addEventListener("wheel", stop, { passive: true });
        window.addEventListener("touchstart", stop, { passive: true });
        window.addEventListener("pointerdown", stop, { passive: true });
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("popstate", stop);
        window.addEventListener("resize", stop);

        return () => {
            stop();
            window.removeEventListener("wheel", stop);
            window.removeEventListener("touchstart", stop);
            window.removeEventListener("pointerdown", stop);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("popstate", stop);
            window.removeEventListener("resize", stop);
        };
    }, [stop]);

    return (event: MouseEvent<HTMLDivElement>) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            !(event.target instanceof Element)
        ) {
            return;
        }

        const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
        if (
            !link ||
            link.hasAttribute("download") ||
            (link.target && link.target !== "_self")
        ) {
            return;
        }

        let id: string;
        try {
            id = decodeURIComponent(link.hash.slice(1));
        } catch {
            return;
        }
        const target = document.getElementById(id);
        if (!target || !event.currentTarget.contains(target)) return;

        event.preventDefault();
        stop();

        // Measure once, including the section's offset below the sticky header.
        const start = window.scrollY;
        const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const end = Math.max(
            0,
            Math.min(
                start + target.getBoundingClientRect().top - offset,
                document.documentElement.scrollHeight - window.innerHeight,
            ),
        );

        if (window.location.hash !== link.hash) {
            window.history.pushState(window.history.state, "", link.hash);
        }

        const finish = () => {
            animation.current = null;
            if (!target.hasAttribute("tabindex")) {
                target.setAttribute("tabindex", "-1");
                target.addEventListener(
                    "blur",
                    () => target.removeAttribute("tabindex"),
                    { once: true },
                );
            }
            target.focus({ preventScroll: true });
        };

        if (reducedMotion || Math.abs(end - start) < 1) {
            window.scrollTo({ top: end, behavior: "instant" });
            finish();
            return;
        }

        animation.current = animate(start, end, {
            duration: Math.min(0.8, 0.35 + Math.abs(end - start) / 6000),
            ease: [0.25, 0.1, 0.25, 1],
            onUpdate: (top) => window.scrollTo({ top, behavior: "instant" }),
            onComplete: finish,
        });
    };
}

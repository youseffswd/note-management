"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ArrowUpRightIcon, FilePlusIcon, LoaderCircleIcon, PlusIcon } from "lucide-react";

import { useAuthStore } from "@/features/auth";
import {
    createEmptyNote,
    nextUntitledName,
    NoteCard,
    notesByRecent,
    useNodeStore,
} from "@/features/nodes";
import { StarButton, useStarredStore } from "@/features/starred";
import { NoteTagBadges, useTagsStore } from "@/features/tags";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import DashboardHeader from "./DashboardHeader";
import DashboardSections from "./DashboardSections";

export default function DashboardView() {
    const router = useRouter();
    const initialized = useNodeStore(state => state.initialized);
    const nodesHash = useNodeStore(state => state.nodesHash);
    const addNote = useNodeStore(state => state.addNote);
    const starredIds = useStarredStore(state => state.starredIds);
    const tags = useTagsStore(state => state.tags);
    const fullName = useAuthStore(state => state.user?.user_metadata?.full_name);
    const firstName = typeof fullName === "string" ? fullName.trim().split(/\s+/)[0] : "";
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const creatingRef = useRef(false);

    const notes = useMemo(() => notesByRecent(nodesHash), [nodesHash]);
    const starredCount = notes.filter(note => starredIds[note.id]).length;
    const recentNotes = notes.slice(0, 6);

    async function handleCreateNote() {
        if (!initialized || creatingRef.current) return;
        creatingRef.current = true;
        setCreating(true);
        setCreateError(null);

        try {
            const title = nextUntitledName(useNodeStore.getState().nodesHash, {
                type: "note",
                parentId: null,
            });
            const note = createEmptyNote(title);
            // Wait for persistence before opening the editor, as in the explorer.
            await addNote(note);
            if (!useNodeStore.getState().nodesHash[note.id]) {
                throw new Error("The note could not be created.");
            }
            router.push(`/dashboard/notes/${note.id}`);
        } catch {
            setCreateError("Could not create your note. Please try again.");
        } finally {
            creatingRef.current = false;
            setCreating(false);
        }
    }

    return (
        <div className="relative isolate min-h-dvh bg-background">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-160 overflow-hidden">
                <div className="absolute -top-64 right-0 size-160 rounded-full bg-primary/5 blur-[100px]" />
            </div>
            <a href="#dashboard-content" className="sr-only z-50 rounded-lg bg-foreground p-3 text-background focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
                Skip to content
            </a>
            <DashboardHeader />

            <main id="dashboard-content" className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14">
                <section aria-labelledby="dashboard-heading" className="mb-10 grid items-center gap-8 md:grid-cols-[1fr_280px] sm:mb-12 lg:gap-16">
                    <div className="min-w-0">
                        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary wrap-anywhere">
                            Welcome back{firstName ? `, ${firstName}` : ""}
                        </p>
                        <h1 id="dashboard-heading" className="text-4xl font-semibold leading-[1.12] tracking-[-0.045em] sm:text-5xl lg:text-[3.5rem]">
                            Your space<br />
                            <span className="text-muted-foreground">to think.</span>
                        </h1>
                        <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                            Big ideas, small reminders, and everything in between.
                            Make a little room for what&apos;s on your mind.
                        </p>
                        <Link href="/dashboard/notes" className="mt-5 inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                            Explore your notes
                            <ArrowRightIcon aria-hidden="true" className="size-4" />
                        </Link>
                    </div>

                    <button
                        type="button"
                        aria-label={creating ? "Creating note" : "New note"}
                        onClick={handleCreateNote}
                        disabled={!initialized || creating}
                        className="group relative flex min-h-32 flex-col justify-end overflow-hidden rounded-2xl border border-primary/25 bg-linear-to-br from-primary/10 via-card to-card p-6 text-left transition-[border-color,box-shadow] hover:border-primary/60 hover:shadow-[0_0_40px_-12px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-60 md:min-h-60"
                    >
                        <div aria-hidden="true" className="pointer-events-none absolute right-7 top-7 hidden h-24 w-20 rotate-12 rounded-xl border border-primary/15 bg-primary/5 transition-transform motion-safe:group-hover:rotate-[18deg] md:block" />
                        <div aria-hidden="true" className="pointer-events-none absolute right-10 top-6 hidden h-24 w-20 -rotate-6 space-y-2 rounded-xl border border-primary/25 bg-secondary p-4 shadow-lg transition-transform motion-safe:group-hover:-translate-y-1 md:block">
                            <div className="mb-3 size-5 rounded-md bg-primary/20" />
                            <div className="h-1 w-full rounded-full bg-primary/25" />
                            <div className="h-1 w-3/4 rounded-full bg-primary/15" />
                        </div>
                        <span className="relative mb-5 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                            {creating ? <LoaderCircleIcon aria-hidden="true" className="size-5 animate-spin" /> : <PlusIcon aria-hidden="true" className="size-5" />}
                        </span>
                        <span className="relative flex w-full items-center justify-between gap-3 text-lg font-semibold tracking-tight">
                            {creating ? "Creating…" : "New note"}
                            <ArrowUpRightIcon aria-hidden="true" className="size-5 text-primary" />
                        </span>
                        <span className="relative mt-1 text-xs text-muted-foreground">A blank page. A fresh perspective.</span>
                    </button>
                </section>

                {createError && (
                    <p role="alert" className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                        {createError}
                    </p>
                )}

                <DashboardSections
                    initialized={initialized}
                    noteCount={notes.length}
                    starredCount={starredCount}
                    tagCount={Object.keys(tags).length}
                />

                <section aria-labelledby="recent-notes-heading" className="mt-12">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 id="recent-notes-heading" className="text-lg font-semibold tracking-tight">Pick up where you left off</h2>
                            <p className="mt-1.5 text-sm text-muted-foreground">Your recent notes, ready when you are.</p>
                        </div>
                        <Button variant="ghost" asChild className="text-xs text-muted-foreground hover:bg-secondary">
                            <Link href="/dashboard/notes">
                                All notes
                                <ArrowRightIcon aria-hidden="true" className="size-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {!initialized ? (
                        <div role="status" aria-label="Loading recent notes" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-40 rounded-2xl" />)}
                        </div>
                    ) : recentNotes.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recentNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    className="flex min-h-40 flex-col rounded-2xl bg-card/40 p-5 [&>div:last-child]:mt-auto [&>p]:mt-1 [&>p]:mb-5"
                                    actions={<StarButton noteId={note.id} size="icon-xs" />}
                                    metadata={<NoteTagBadges noteId={note.id} maxTags={2} />}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/30 px-5 py-12 text-center">
                            <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <FilePlusIcon aria-hidden="true" className="size-6" />
                            </span>
                            <h3 className="font-medium">A little space for your next idea</h3>
                            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Create your first note. This is where your ideas will start coming together.
                            </p>
                            <Button className="mt-5 rounded-lg" variant="secondary" onClick={handleCreateNote} disabled={creating}>
                                {creating ? "Creating…" : "Create your first note"}
                            </Button>
                        </div>
                    )}
                </section>

                <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground">
                    <span>NoteFlow <span aria-hidden="true" className="mx-1">/</span> Your personal workspace</span>
                    <Link href="/dashboard/settings" className="flex items-center gap-1.5 rounded-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                        Account settings
                        <ArrowUpRightIcon aria-hidden="true" className="size-3.5" />
                    </Link>
                </footer>
            </main>
        </div>
    );
}

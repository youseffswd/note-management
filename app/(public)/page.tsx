import type { Metadata } from "next";
import { LandingPage } from "@/features/landing";

export const metadata: Metadata = {
    title: "NoteFlow — A little space for your big ideas",
    description:
        "Bring your notes, plans, and everyday ideas together in NoteFlow. Write freely, organize with folders and tags, and find your focus.",
    openGraph: {
        title: "NoteFlow — A little space for your big ideas",
        description:
            "A calmer home for your notes, plans, and everyday ideas. Make room for what matters with NoteFlow.",
        type: "website",
    },
};

export default function Page() {
    return <LandingPage />;
}

import { Folder, PencilLine, Search } from "lucide-react";
import SectionHeading from "../SectionHeading";
import FeatureCard from "./FeatureCard";
import WritingIllustration from "./WritingIllustration";
import FoldersIllustration from "./FoldersIllustration";
import SearchIllustration from "./SearchIllustration";

export default function FeaturesSection() {
    return (
        <section
            className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
            id="features"
            aria-labelledby="features-title"
        >
            <SectionHeading
                id="features-title"
                eyebrow="LESS FRICTION. MORE FLOW."
                description="Just the right tools to turn a busy mind into a little clarity."
            >
                Everything you need.
                <br />
                <span className="text-muted-foreground">
                    Space for everything else.
                </span>
            </SectionHeading>
            <div className="grid gap-5 md:grid-cols-3">
                <FeatureCard
                    icon={
                        <PencilLine
                            className="text-primary"
                            size={24}
                            strokeWidth={1.6}
                            aria-hidden="true"
                        />
                    }
                    title={
                        <>
                            Catch a thought.
                            <br />
                            Let it grow.
                        </>
                    }
                    description="From a one-line idea to your next big project. Write freely with headings, lists, and checklists."
                >
                    <WritingIllustration />
                </FeatureCard>
                <FeatureCard
                    icon={
                        <Folder
                            className="text-chart-2"
                            size={24}
                            strokeWidth={1.6}
                            aria-hidden="true"
                        />
                    }
                    title={
                        <>
                            A home for
                            <br />
                            every kind of you.
                        </>
                    }
                    description="Work stuff. Life stuff. That new obsession. Keep it all together with folders and colorful tags."
                    delay={0.07}
                >
                    <FoldersIllustration />
                </FeatureCard>
                <FeatureCard
                    icon={
                        <Search
                            className="text-chart-5"
                            size={24}
                            strokeWidth={1.6}
                            aria-hidden="true"
                        />
                    }
                    title={
                        <>
                            Less searching.
                            <br />
                            More finding.
                        </>
                    }
                    description="Keep your favorites close with stars, browse by tag, or search for that thought you almost forgot."
                    delay={0.14}
                >
                    <SearchIllustration />
                </FeatureCard>
            </div>
        </section>
    );
}

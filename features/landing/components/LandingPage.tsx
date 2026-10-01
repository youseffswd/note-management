import LandingHeader from "./LandingHeader";
import LandingFooter from "./LandingFooter";
import PageDecorations from "./PageDecorations";
import WorkspacePreview from "./WorkspacePreview";
import { LandingMotion } from "./motion/LandingMotion";
import { SkipToContent } from "./motion/MotionControls";
import HeroSection from "./sections/HeroSection";
import BenefitsSection from "./sections/BenefitsSection";
import FeaturesSection from "./sections/FeaturesSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import UseCasesSection from "./sections/UseCasesSection";
import FaqSection from "./sections/FaqSection";
import CallToActionSection from "./sections/CallToActionSection";

export default function LandingPage() {
    return (
        <LandingMotion className="relative isolate min-h-screen overflow-x-clip bg-background text-foreground [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-ring [&_*]:animate-none! [&_*]:transition-none!">
            <SkipToContent />
            <PageDecorations />
            <LandingHeader />
            <HeroSection />
            <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-8">
                <WorkspacePreview />
            </div>
            <BenefitsSection />
            <FeaturesSection />
            <HowItWorksSection />
            <UseCasesSection />
            <FaqSection />
            <CallToActionSection />
            <LandingFooter />
        </LandingMotion>
    );
}

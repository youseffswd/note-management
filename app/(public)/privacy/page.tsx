import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto py-16 px-4 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <div className="text-muted-foreground leading-relaxed">
                <p className="mb-6">Last updated: June 2026</p>
                <p className="mb-6">
                    Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
                </p>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">1. Information we collect</h2>
                <p className="mb-6">
                    We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
                </p>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">2. Use of Information</h2>
                <p className="mb-6">
                    We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features.
                </p>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">3. Data Security</h2>
                <p className="mb-6">
                    We don't share any personally identifying information publicly or with third-parties, except when required to by law. Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
                </p>
                <p className="mt-12">
                    If you have any questions about how we handle user data and personal information, feel free to contact us.
                </p>
            </div>
            <div className="mt-12">
                <Button asChild variant="outline">
                    <Link href="/sign-up">Return to Sign Up</Link>
                </Button>
            </div>
        </div>
    );
}

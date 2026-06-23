import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function TermsPage() {
    return (
        <div className="container mx-auto py-16 px-4 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <div className="text-muted-foreground leading-relaxed">
                <p className="mb-6">Last updated: June 2026</p>
                <p className="mb-6">
                    By accessing our website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">1. Use License</h2>
                <p className="mb-6">
                    Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">2. Disclaimer</h2>
                <p className="mb-6">
                    The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-foreground">3. Limitations</h2>
                <p className="mb-6">
                    In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.
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

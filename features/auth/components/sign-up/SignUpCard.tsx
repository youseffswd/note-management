import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import SignUpForm from "./SignUpForm";
import Link from "next/link";

export function SignUpCard() {
    return (
        <Card className="w-sm px-2 py-8 border border-border">
            <CardHeader>
                <CardTitle className="text-xl">Create your account</CardTitle>
                <CardDescription className="text-sm">
                    Get started with NoteFlow for free
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpForm />
                <div className="mt-3 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-primary hover:underline"
                    >
                        Sign In
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

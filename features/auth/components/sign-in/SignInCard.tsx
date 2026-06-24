import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import SignInForm from "./SignInForm";
import Link from "next/link";

export function SignInCard({ message }: { message?: string }) {
    return (
        <Card className="w-sm px-2 py-8 border border-border">
            <CardHeader>
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription className="text-sm">
                    Log in to your NoteFlow account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignInForm message={message} />
                <div className="mt-3 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="text-primary hover:underline"
                    >
                        Sign Up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

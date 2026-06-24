import { SignInCard } from "@/features/auth";

interface LoginPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    const message = typeof params.message === "string" ? params.message : undefined;

    return (
      <SignInCard message={message} />
    );
}

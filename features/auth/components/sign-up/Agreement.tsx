import { Field, FieldGroup,FieldLabel,FieldError } from "@/shared/components/ui/field";
import { Checkbox } from "@/shared/components/ui/checkbox";

import Link from "next/link";

interface AgreementProps{
    state?: SignUpState | null;
}


export default function Agreement({state}: AgreementProps) {
    return (
        <FieldGroup>
            <Field
                orientation="horizontal"
                data-invalid={!!state?.errors?.agreeTerms?.[0]}
            >
                <Checkbox
                    defaultChecked={state?.fields?.agreeTerms}
                    className="border-2 border-border"
                    id="agreeTerms"
                    name="agreeTerms"
                />
                <FieldLabel
                    htmlFor="agreeTerms"
                    className="font-normal text-accent-foreground"
                >
                    I agree to the{" "}
                    <Link
                        href="/terms"
                        className="text-blue-400 hover:underline"
                    >
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="text-blue-400 hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </FieldLabel>
            </Field>
            {state?.errors?.agreeTerms?.[0] && (
                <FieldError className="text-xs">
                    {state.errors.agreeTerms[0]}
                </FieldError>
            )}
        </FieldGroup>
        
    );
}
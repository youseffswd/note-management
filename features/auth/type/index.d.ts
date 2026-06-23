interface Fields {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}
interface FieldSetters {
  setEmail: (email: string) => void;
  setFullName: (fullName: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setAgreeTerms: (agreeTerms: boolean) => void;
  setFieldError: (field: keyof Fields, errors: string[] | undefined) => void;
}

type SignUpState = {
    errors?: { [k in keyof Fields]?: string[] };
    fields?: Partial<Fields>;
    message?: string;
};
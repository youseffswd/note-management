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

type SignInFields = Pick<Fields, "email" | "password">

interface SignInFieldSetters {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setFieldError: (field: keyof SignInFields, errors: string[] | undefined) => void;
}

type SignInState = {
    errors?: { [k in keyof SignInFields]?: string[] };
    fields?: Partial<SignInFields>;
    message?: string;
};
export type StrengthLevel = "empty" | "weak" | "fair" | "good" | "excellent";

export const getPasswordStrength = (password: string): StrengthLevel => {
  if (!password) return "empty";

  let score = 0;

  // These mirror your Zod schema requirements exactly
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return "weak";
  if (score === 3) return "fair";
  if (score === 4) return "good";
  return "excellent"; // All 5 conditions met (Valid in Zod)
};
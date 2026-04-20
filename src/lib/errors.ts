import { ZodError } from "zod";

export function getZodErrorMessage(error: ZodError): string {
  const { fieldErrors, formErrors } = error.flatten();

  const firstFieldError = Object.values(fieldErrors)[0] as string[] | undefined;

  return formErrors[0] || firstFieldError?.[0] || "Invalid input";
}

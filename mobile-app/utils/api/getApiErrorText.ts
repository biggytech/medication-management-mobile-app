import { LanguageService } from "@/services/language/LanguageService";

export const getApiErrorText = (
  error: Error | string | any,
  fallbackMessage?: string,
) => {
  if (typeof error === "string") {
    return error;
  }

  return (
    error?.message ??
    fallbackMessage ??
    LanguageService.translate("Something went wrong!")
  );
};

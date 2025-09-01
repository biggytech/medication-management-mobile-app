import { LanguageService } from "@/services/language/LanguageService";
import { DEFAULT_ERROR_LANGUAGE_KEY } from "@/constants/errors";

export const getErrorMessage = async (response: Response): Promise<string> => {
  let errorMessage: string;

  try {
    const data = await response.json();
    errorMessage =
      data?.error ?? LanguageService.translate(DEFAULT_ERROR_LANGUAGE_KEY);
  } catch (err) {
    errorMessage = LanguageService.translate(DEFAULT_ERROR_LANGUAGE_KEY);
  }

  const { status, statusText } = response;

  return `${LanguageService.translate("Request failed with status")} ${status} ${statusText ? `(${statusText})` : ""}: ${errorMessage}`;
};

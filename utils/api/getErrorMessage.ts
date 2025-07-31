import { LanguageService } from "@/services/language/LanguageService";
import { DEFAULT_ERROR_LANGUAGE_KEY } from "@/constants/errors";

export const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    const errorDetails =
      data?.error ?? LanguageService.translate(DEFAULT_ERROR_LANGUAGE_KEY);
    return `Request failed with status ${response.status} (${response.statusText}). Message: ${errorDetails}`;
  } catch (err) {
    return LanguageService.translate(DEFAULT_ERROR_LANGUAGE_KEY);
  }
};

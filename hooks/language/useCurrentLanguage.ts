import { useCallback, useEffect, useState } from "react";
import { AvailableLanguages, DEFAULT_LANGUAGE } from "@/constants/language";
import { useScreenReload } from "@/hooks/navigation/useScreenReload";
import { LanguageService } from "@/services/language/LanguageService";

export const useCurrentLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(
    DEFAULT_LANGUAGE,
  );
  const { reloadScreen } = useScreenReload();

  useEffect(() => {
    (async () => {
      const language = await LanguageService.loadCurrentLanguage();
      if (language) {
        setCurrentLanguage(language);
      } else {
        const language = await LanguageService.changeLanguageToDeviceLanguage();
        if (language !== DEFAULT_LANGUAGE) {
          reloadScreen();
        }
      }
    })();
  }, [reloadScreen]);

  const updateCurrentLanguage = useCallback(
    async (language: AvailableLanguages) => {
      setCurrentLanguage(language);

      await LanguageService.changeLanguage(language);
      reloadScreen();
    },
    [reloadScreen],
  );

  return { currentLanguage, updateCurrentLanguage };
};

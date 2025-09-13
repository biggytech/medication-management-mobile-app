import { useAuthSession } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { type ReactNode, useEffect, useState } from "react";
import { LanguageService } from "@/services/language/LanguageService";
import { BlockingLoader } from "@/components/loaders/BlockingLoader";
import { AppScreens } from "@/constants/navigation";

export default function RootLayout(): ReactNode {
  const { getIsAuthenticated, isLoading: isTokenLoading } = useAuthSession();
  const [isLanguageLoading, setIsLanguageLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      // load selected language before starting the app
      await LanguageService.loadCurrentLanguage();
      setIsLanguageLoading(false);
    })();
  }, []);

  if (isTokenLoading || isLanguageLoading) {
    return <BlockingLoader />;
  }

  if (!getIsAuthenticated()) {
    return <Redirect href={AppScreens.LOGIN} />;
  }

  return <Redirect href={AppScreens.HOME} />;
}

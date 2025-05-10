import { useAuthSession } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { type ReactNode, useEffect, useState } from "react";
import { Loader } from "@/components/Loader";
import { LanguageService } from "@/services/language/LanguageService";

export default function RootLayout(): ReactNode {
  const { getToken, isLoading: isTokenLoading } = useAuthSession();
  const [isLanguageLoading, setIsLanguageLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      // load selected language before starting the app
      await LanguageService.loadCurrentLanguage();
      setIsLanguageLoading(false);
    })();
  }, []);

  if (isTokenLoading || isLanguageLoading) {
    // TODO: fix loader positioning
    return <Loader />;
  }

  if (!getToken()) {
    return <Redirect href={"/login"} />;
  }

  return <Redirect href={"/home"} />;
}

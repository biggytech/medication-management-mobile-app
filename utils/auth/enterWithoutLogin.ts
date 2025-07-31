import { router } from "expo-router";
import { AuthService, AuthType } from "@/services/auth/AuthService";
import { AppScreens } from "@/constants/navigation";

export const enterWithoutLogin = async () => {
  AuthService.setAuthStrategy(AuthType.OFFLINE);
  await AuthService.authenticate();
  router.replace(AppScreens.HOME);
};

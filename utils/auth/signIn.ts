import { router } from "expo-router";
import {
  type AuthData,
  AuthService,
  AuthType,
} from "@/services/auth/AuthService";
import { AppScreens } from "@/constants/navigation";

export const signIn = async (authType: AuthType, data?: AuthData) => {
  AuthService.setAuthStrategy(authType);
  await AuthService.authenticate(data);
  router.replace(AppScreens.HOME);
};

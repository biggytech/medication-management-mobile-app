import { router } from "expo-router";
import { AuthService } from "@/services/auth/AuthService";
import { AppScreens } from "@/constants/navigation";

export const signOut = async () => {
  await AuthService.removeAuthInfo();
  router.replace(AppScreens.LOGIN);
};

import { router } from "expo-router";
import { AuthService } from "@/services/auth/AuthService";
import { AppScreens } from "@/constants/navigation";
import { APIService } from "@/services/APIService";

export const signOut = async () => {
  if (AuthService.isGuest) {
    await APIService.signOut.anonymous();
  }
  await AuthService.removeAuthInfo();
  router.replace(AppScreens.LOGIN);
};

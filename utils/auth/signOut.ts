import { router } from "expo-router";
import { AuthService } from "@/services/auth/AuthService";
import { AppScreens } from "@/constants/navigation";
import { APIService } from "@/services/APIService";

export const signOut = async () => {
  try {
    if (AuthService.isGuest) {
      await APIService.signOut.anonymous();
    }
  } catch {
    // sign out no matter what
  }

  await AuthService.removeAuthInfo();
  router.replace(AppScreens.LOGIN);
};

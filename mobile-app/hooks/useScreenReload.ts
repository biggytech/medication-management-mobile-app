import { useRouter, usePathname } from "expo-router";
import { useCallback } from "react";

/**
 * Allows reloading of current screen
 */
export const useScreenReload = () => {
  const router = useRouter();
  const routePath = usePathname();

  const reloadScreen = useCallback(() => {
    // @ts-expect-error - routePath is dynamic
    router.replace(routePath);
  }, [routePath, router]);

  return { reloadScreen };
};

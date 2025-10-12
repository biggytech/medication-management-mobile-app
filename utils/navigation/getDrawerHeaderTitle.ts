import {
  getFocusedRouteNameFromRoute,
  type ParamListBase,
  type RouteProp,
} from "@react-navigation/native";
import { LanguageService } from "@/services/language/LanguageService";

export const getDrawerHeaderTitle = (
  route: RouteProp<ParamListBase, string>,
) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "index";

  switch (routeName) {
    case "index":
      return LanguageService.translate("Home");
    case "medicines":
      return LanguageService.translate("Medicines");
    case "health-trackers":
      return LanguageService.translate("Health Trackers");
    default:
      return LanguageService.translate("Home");
  }
};

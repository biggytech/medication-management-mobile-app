import { APIService } from "@/services/APIService";

export const getAbsolutePhotoUrl = (photoUrl?: string): string | undefined => {
  return photoUrl
    ? `${(APIService.getInstance().BASE_URL ?? "").replace("/api", "")}/${photoUrl}`
    : undefined;
};

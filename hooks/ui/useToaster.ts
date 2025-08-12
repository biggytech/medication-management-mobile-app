import { showError } from "@/utils/ui/showError";
import { showSuccess } from "@/utils/ui/showSuccess";

export const useToaster = () => {
  return {
    showError,
    showSuccess,
  };
};

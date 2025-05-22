import { useMutation } from "@tanstack/react-query";
import { APIService } from "@/services/APIService";
import { useToaster } from "@/hooks/useToaster";
import { getApiErrorText } from "@/utils/api/getApiErrorText";

type UseLoginMutationReturn = Awaited<ReturnType<typeof APIService.login>>;

export const useLogin = ({
  onSuccess,
}: {
  onSuccess: (data: UseLoginMutationReturn) => void;
}) => {
  const { showError } = useToaster();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: Parameters<typeof APIService.login>[0]) => {
      const { token } = await APIService.login({
        username,
        password,
      });
      return {
        token,
      };
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
      showError(getApiErrorText(error));
    },
  });
};

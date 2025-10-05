import { useQuery } from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";
import type { DefaultError, QueryKey } from "@tanstack/query-core";

export const useQueryWithFocus = <
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  params: Parameters<
    typeof useQuery<TQueryFnData, TError, TData, TQueryKey>
  >[0],
) => {
  const isFocused = useIsFocused();

  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...params,
    subscribed: isFocused,
  });
};

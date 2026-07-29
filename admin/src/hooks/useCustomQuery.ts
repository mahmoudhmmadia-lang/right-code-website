import {
  type QueryKey,
  type UseQueryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useCalls } from "./useCalls";

export function useCustomQuery<TData>({
  queryKey,
  queryFn,
  isErrLog = true,
  ...options
}: {
  queryKey: QueryKey;
  queryFn: () => Promise<TData>;
  isErrLog?: boolean;
} & Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">) {
  const { handleError } = useCalls();
  const query = useQuery({ queryKey, queryFn, ...options });

  useEffect(() => {
    if (query.isError) handleError({ isLog: isErrLog, err: query.error });
  }, [query.isError, query.error, isErrLog, handleError]);

  return query;
}

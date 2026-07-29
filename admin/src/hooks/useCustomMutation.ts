import {
  type MutationFunction,
  type QueryKey,
  useMutation,
} from "@tanstack/react-query";
import { useCalls } from "./useCalls";

export function useCustomMutation<TData, TVariables>({
  mutationFn,
  isSuccessLog,
  isErrLog = true,
  queryKey,
  onSuccess,
  onError,
}: {
  mutationFn: MutationFunction<
    { data: { materials: TData; message: string } },
    TVariables
  >;
  isSuccessLog?: boolean;
  isErrLog?: boolean;
  queryKey?: QueryKey;
  onSuccess?: (data: TData) => void;
  onError?: (err: unknown) => void;
}) {
  const { handleError, handleSuccess } = useCalls();

  return useMutation({
    mutationFn,
    onSuccess(res) {
      const data = handleSuccess({ res, isLog: isSuccessLog, queryKey });
      onSuccess?.(data);
    },
    onError(err) {
      handleError({ isLog: isErrLog, err });
      onError?.(err);
    },
  });
}

import { accountInfo, lang, response } from "@/context/global"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

type ApiResponse<T> = {
  materials: T
  message: string
}

export function useCalls() {
  const client = useQueryClient()

  const handleSuccess = useCallback(
    function handleSuccess<T>({
      res,
      queryKey,
      isLog,
    }: {
      res: { data: ApiResponse<T> }
      queryKey?: readonly unknown[]
      isLog?: boolean
    }) {
      if (queryKey) void client.invalidateQueries({ queryKey })
      if (isLog) {
        response.value = {
          type: "success",
          message: res.data.message || "Done",
        }
      }
      return res.data.materials
    },
    [client]
  )

  const handleError = useCallback(function handleError({
    err,
    isLog = true,
  }: {
    err: unknown
    isLog?: boolean
  }) {
    const error = err as {
      response?: { status?: number; data?: { message?: string } }
    }
    if (error.response?.status === 403) accountInfo.value = undefined
    if (isLog) {
      response.value = {
        type: "error",
        message:
          error.response?.data?.message ??
          (lang.value === "ar" ? "حدث خطأ ما" : "Something went wrong"),
      }
    }
  }, [])

  return { handleSuccess, handleError }
}

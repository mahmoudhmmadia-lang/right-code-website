import { myAxios } from "@/api/myAxios"
import { accountInfo, type AccountInfo } from "@/context/global"
import { useCustomMutation } from "@/hooks/useCustomMutation"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export type LoginValues = {
  email: string
  password: string
}

export function useLogin() {
  const navigate = useNavigate()
  const form = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })
  const login = useCustomMutation<AccountInfo, LoginValues>({
    mutationFn: (values) => myAxios.post("/auth/login", values),
    isErrLog: true,
    onSuccess(data) {
      accountInfo.value = data
      navigate("/", { replace: true })
    },
  })

  return {
    form,
    login,
    onSubmit: form.handleSubmit((values) => login.mutate(values)),
  }
}

import AuthContainer from "@/components/AuthContainer"
import CustomButton from "@/components/CustomButton"
import CustomInput from "@/components/CustomInput"
import { lang } from "@/context/global"
import { ADMIN_TRANSLATOR } from "@/lang/admin"
import { mediaUrl } from "@/lib/media"
import { useSignals } from "@preact/signals-react/runtime"
import { ShieldCheck } from "lucide-react"
import { useLogin } from "./useLogin"

function Login() {
  useSignals()
  const copy = ADMIN_TRANSLATOR[lang.value]
  const { form, login, onSubmit } = useLogin()

  return (
    <AuthContainer>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-2xl bg-alt shadow-xl shadow-alt/15">
          <img
            src={mediaUrl("/assets/home/logo.png")}
            alt="RightCode"
            className="size-16 object-contain"
          />
        </div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-main/8 px-3 py-1 text-[11px] font-bold tracking-wider text-main uppercase">
          <ShieldCheck className="size-3.5" />
          RightCode CMS
        </div>
        <h1 className="text-3xl font-black tracking-tight text-alt">
          {copy.login}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-alt/50">
          {copy.loginDescription}
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        <CustomInput
          id="email"
          label={copy.email}
          type="email"
          autoComplete="email"
          placeholder="admin@rightcode.io"
          register={form.register}
          errors={form.formState.errors}
          options={{
            required: copy.emailRequired,
            pattern: { value: /^\S+@\S+\.\S+$/, message: copy.emailInvalid },
          }}
        />
        <CustomInput
          id="password"
          label={copy.password}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          register={form.register}
          errors={form.formState.errors}
          options={{
            required: copy.passwordRequired,
            minLength: { value: 8, message: copy.passwordLength },
          }}
        />
        <CustomButton
          type="submit"
          isLoading={login.isPending}
          className="mt-2 h-12 w-full rounded-xl text-sm font-bold"
        >
          {copy.loginButton}
        </CustomButton>
      </form>
    </AuthContainer>
  )
}

export default Login

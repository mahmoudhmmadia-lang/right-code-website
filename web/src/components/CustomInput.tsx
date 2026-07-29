import { lang } from "@/context/global"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import type { InputHTMLAttributes } from "react"
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form"

function CustomInput<T extends FieldValues>({
  id,
  label,
  register,
  errors,
  options,
  className,
  type,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  id: Path<T>
  label: string
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  options?: RegisterOptions<T, Path<T>>
}) {
  const error = errors[id]?.message
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-alt/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={cn(
            "h-12 w-full rounded-xl border border-alt/15 bg-white/80 px-4 text-sm text-alt transition outline-none placeholder:text-alt/30 focus:border-main focus:ring-4 focus:ring-main/10",
            isPassword && (lang.value == "ar" ? "pl-12" : "pr-12"),
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          aria-invalid={Boolean(error)}
          {...register(id, options)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              lang.value == "ar" ? "left-0" : "right-0",
              "absolute inset-y-0 flex items-center px-4 text-alt/50 transition-colors hover:text-alt"
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {typeof error === "string" ? (
        <span className="text-xs font-medium text-red-600">{error}</span>
      ) : null}
    </div>
  )
}

export default CustomInput

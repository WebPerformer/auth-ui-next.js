'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResetPasswordAction } from "@/lib/auth"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type FormData = {
  newPassword: string;
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()

  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const router = useRouter();

  async function onSubmit({ newPassword }: FormData) {
    if (!email || !otp) {
      return alert("Missing email or OTP parameter.");
    }

    const response = await ResetPasswordAction({ email, otp, newPassword });
    if (response?.success) {
      router.push('/')
    } else {
      toast("Uh oh! Something went wrong.", {
        description: response?.error,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo")
        }
      })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 my-10" action="">
        <Input
          {...register("newPassword", { required: "Senha é obrigatória", minLength: { value: 6, message: "Mínimo de 6 caracteres" } })}
          className="rounded-md px-4 h-9"
          placeholder="Password"
          type="password"
        />
        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Mudar senha"}
        </Button>
      </form>
    </div>
  )
}

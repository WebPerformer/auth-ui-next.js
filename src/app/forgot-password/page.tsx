'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendOtp } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  username: string
  email: string
  password: string
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()
  const router = useRouter();

  async function onSubmit(data: FormData) {
    const response = await (SendOtp(data));
    if (response?.success) {
      router.push(`/validate-otp?email=${encodeURIComponent(data.email)}`);
    } else {
      alert(response?.error)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 my-10" action="">
        <Input
          {...register("email", {
            required: "Email é obrigatório",
            pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" }
          })}
          className="rounded-md px-4 h-9"
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar código"}
        </Button>
      </form>
    </div>
  )
}

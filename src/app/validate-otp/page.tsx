'use client'
import { Button } from "@/components/ui/button";
import { ValidateEmailOtp } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react";

type FormData = {
  email: string
  otp: string
}

export default function ValidateOtp() {
  const [otp, setOtp] = useState("");
  const {
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>()

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const router = useRouter();

  async function onSubmit() {
    if (!email) {
      alert("Erro: Email não encontrado!");
      return;
    }

    const response = await ValidateEmailOtp({ email, otp });
    if (response?.success) {
      router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    } else {
      alert(response?.error)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <p className="text-xl font-medium py-4">Enter Code</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 my-10" action="">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button type="submit" disabled={isSubmitting || otp.length !== 6}>
          {isSubmitting ? "Enviando..." : "Enviar código"}
        </Button>
      </form>
    </div>
  )
}

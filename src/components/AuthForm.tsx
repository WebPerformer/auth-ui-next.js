'use client'
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInAction, SignUpAction } from "@/lib/auth";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner"
import getGoogleUrl from "@/lib/getGoogleUrl";

type FormData = {
  username: string
  email: string
  password: string
}

type AuthFormProps = {
  isSignup?: boolean
}

export default function AuthForm({ isSignup = false }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>()
  const router = useRouter();

  const { setUser } = useContext(AuthContext);

  async function onSubmit(data: FormData) {
    const response = await (isSignup ? SignUpAction(data) : SignInAction(data));

    if (response?.success) {
      setUser(response.data);
      router.push("/dashboard/introduction");
    } else {
      toast.error("Uh oh! Something went wrong.", {
        description: response?.error,
      })
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-medium">{isSignup ? "Sign up" : "Sign in"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 my-10 text-center" action="">
        {isSignup && (
          <>
            <Input
              {...register("username", { required: "Username é obrigatório" })}
              className="rounded-md px-4 h-9"
              placeholder="Username"
              type="text"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </>
        )}

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

        <Input
          {...register("password", { required: "Senha é obrigatória", minLength: { value: 6, message: "Mínimo de 6 caracteres" } })}
          className="rounded-md px-4 h-9"
          placeholder="Password"
          type="password"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : isSignup ? "Sign up" : "Sign in"}
        </Button>
        <Link href={getGoogleUrl()} className="font-medium pt-2">Sign in with Google</Link>
        <Link href="/forgot-password" className="font-medium pt-2">Forgot Password</Link>
      </form>
      <Link href={isSignup ? '/' : '/signup'} className="font-medium">
        Go to <span className="underline">{isSignup ? "Sign in" : "Sign up"}</span>
      </Link>
    </div>
  );
}

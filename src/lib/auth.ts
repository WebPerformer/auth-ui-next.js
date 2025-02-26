"use server";

import { cookies } from "next/headers";

type SigninData = {
  email: string;
  password: string;
};

type SignupData = {
  username: string;
  email: string;
  password: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export async function SignInAction({ email, password }: SigninData) {
  try {
    const response = await fetch("http://localhost:3001/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": "random-secure-token",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      (await cookies()).set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // One week
        path: "/",
      });

      return result.user;
    }

    return null;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
}

export async function SignUpAction({ username, email, password }: SignupData) {
  try {
    const response = await fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      const user = await SignInAction({ email, password });
      return user;
    } else {
      console.log(result.message || "Erro na autenticação");
    }
  } catch (error) {
    console.error("Erro:", error);
    console.log("Erro ao conectar com o servidor");
  }
}

export async function SignOutAction() {
  try {
    (await cookies()).delete("token");
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  }
}

export async function getUser(): Promise<User | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      console.warn("Nenhum token encontrado nos cookies.");
      return null;
    }

    const response = await fetch("http://localhost:3001/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Erro ao obter usuário:", response.statusText);
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return null;
  }
}

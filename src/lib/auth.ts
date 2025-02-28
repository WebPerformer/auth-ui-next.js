"use server";

import { cookies } from "next/headers";

type SigninData = {
  email: string;
  password: string;
};

type SigninGoogleData = {
  token: string;
};

type SignupData = {
  username: string;
  email: string;
  password: string;
};

type ValidateData = {
  email: string;
  otp: string;
};

type ResetData = {
  email: string;
  otp: string;
  newPassword: string;
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

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Erro na autenticação",
      };
    }

    (await cookies()).set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });

    return { success: true, data: result.user };
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

    if (!response?.ok) {
      return {
        success: false,
        error: result.message || "Erro na autenticação",
      };
    }

    const user = await SignInAction({ email, password });

    if (user?.success) {
      return { success: true, data: user.data };
    } else {
      return { success: false, error: user?.error };
    }
  } catch (error) {
    console.error("Erro:", error);
    console.log("Erro ao conectar com o servidor");
  }
}

export async function SendOtp({ email }: SignupData) {
  try {
    const response = await fetch("http://localhost:3001/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
      }),
    });
    const result = await response.json();

    if (!response?.ok) {
      return {
        success: false,
        error: result.message || "Erro na autenticação",
      };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    console.log("Erro ao conectar com o servidor");
  }
}

export async function ValidateEmailOtp({ email, otp }: ValidateData) {
  try {
    const response = await fetch("http://localhost:3001/validate-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Erro na autenticação",
      };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Erro:", error);
    console.log("Erro ao conectar com o servidor");
  }
}

export async function ResetPasswordAction({
  email,
  otp,
  newPassword,
}: ResetData) {
  try {
    const response = await fetch("http://localhost:3001/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Erro na autenticação",
      };
    }

    return { success: true, data: result };
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

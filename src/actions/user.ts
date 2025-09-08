"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAction(email: string, password: string) {
  try {
    const validatedFields = loginSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error,
      };
    }

    const result = await auth.api.signInEmail({
      body: {
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      },
    });

    if (!result.user) {
      return {
        success: false,
        error: "Login failed",
      };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function registerAction(
  name: string,
  email: string,
  password: string,
) {
  try {
    const validatedFields = registerSchema.safeParse({ name, email, password });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error,
      };
    }

    const result = await auth.api.signUpEmail({
      body: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      },
    });

    if (!result.user) {
      return {
        success: false,
        error: "Registration failed",
      };
    }

    return {
      success: true,
      user: result.user,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

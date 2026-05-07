// src/schemas/auth.schema.ts

import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username is too long")
    .trim(),

  email: z.email("Invalid email").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain special character"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});

export const updatePasswordSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain special character"),
});

export const userDeleteSchema = z.object({
  userId: z.string().nonempty("Usere id cant be blank"),
});

// inferred TS types

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type DeleteUserInput = z.infer<typeof userDeleteSchema>;

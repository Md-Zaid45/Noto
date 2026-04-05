import { z } from "zod";
import { emailSchema, passwordSchema } from "./commonSchema.js";

export const registerSchema = z.object({
  body: z
    .object({
      name: z.string(),
      email: emailSchema,
      password: passwordSchema,
    })
    .strict(),
});

export const loginSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
    })
    .strict(),
});

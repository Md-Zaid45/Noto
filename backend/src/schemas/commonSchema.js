import { z } from "zod";

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const optionalBoolean = z.boolean().optional();

export const passwordSchema = z
  .string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,20}$/, {
    message:
      "Password must be 6–20 characters, including at least one letter and one number",
  });

export const emailSchema = z.string().email("Invalid email format");

export const idArray = z.array(objectId).min(1, "IDs cannot be empty");

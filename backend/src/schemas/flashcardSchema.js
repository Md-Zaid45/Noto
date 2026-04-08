import { z } from "zod";
import { idArray, objectId, optionalBoolean } from "./commonSchema.js";

export const createFlashcardSchema = z.object({
  body: z.object({
    revisionMark: optionalBoolean,
    question: z.string().trim().min(1, "Question is required"),
    answer: z.string().trim().min(1, "Answer is required"),
    noteId: objectId,
  }).strict(),
});

export const updateFlashcardSchema = z.object({
  body: z
    .object({
      revisionMark: optionalBoolean,
      question: z.string().trim().min(1, "Question is required").optional(),
      answer: z.string().trim().min(1, "Answer is required").optional(),
      noteId: objectId.optional(),
    }).strict()
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
      message: "At least one field required",
    }),
  params: z.object({ id: objectId }),
});

export const deleteFlashcardsSchema = z.object({
  body: z.object({
    ids: idArray,
  }).strict(),
});

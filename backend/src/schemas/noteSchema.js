import { z } from "zod";
import { idArray, objectId, optionalBoolean } from "./commonSchema.js";

export const createNoteSchema = z.object({
  body: z
    .object({
      content: z.string().optional(),
      folderId: objectId.nullable(),
      name: z.string().trim().min(1, "Name is required"),
      revisionMark: optionalBoolean,
    })
    .strict(),
});

export const updateNoteSchema = z.object({
  body: z
    .object({
      revisionMark: optionalBoolean,
      name: z.string().trim().min(1, "Name is required").optional(),
      content: z.any().optional(),
      folderId: objectId.optional(),
    })
    .strict()
    .refine(
      (data) =>
        Object.values(data).some((val) => val !== undefined && val !== null),
      {
        message: "At least one field required",
      },
    ),
  params: z.object({ id: objectId }),
});

export const deleteNotesSchema = z.object({
  body: z
    .object({
      ids: idArray,
    })
    .strict(),
});

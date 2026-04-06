import { z } from "zod";
import { idArray, objectId, optionalBoolean } from "./commonSchema.js";

export const createFolderSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    folderId: objectId,
    revisionMark: optionalBoolean,
  }).strict(),
});

export const updateFolderSchema = z.object({
  body: z
    .object({
      revisionMark: optionalBoolean,
      name: z.string().min(1).optional(),
      folderId: objectId.optional(),
    }).strict()
    .refine((data) => Object.values(data).some((val) => val !== undefined), {
      message: "At least one field required",
    }),
  params: z.object({ id: objectId }),
});

export const deleteFoldersSchema = z.object({
  body: z.object({
    ids: idArray,
  }).strict(),
});

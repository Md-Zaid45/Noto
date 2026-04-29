import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    revisionMark: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
  },
  { timestamps: true },
);

export const Folder = mongoose.model("Folder", folderSchema);

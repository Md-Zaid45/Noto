import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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
    content: {
      type: mongoose.Schema.Types.Mixed,
      default:{}
    },
    revisionMark: {
      type: Boolean,
      default: false,
      enum: [true, false],
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);

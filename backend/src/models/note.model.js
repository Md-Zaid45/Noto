import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
      index:true
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default:'r'
    },
    content: {
      type: String,
    },
    revisionMark: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);

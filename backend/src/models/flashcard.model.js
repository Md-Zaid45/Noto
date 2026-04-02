import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    revisionMark:{
      type:Boolean,
      default:false,
    },
    nextReview: {
      type: Date,
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    easeScore: {
      type: Number,
      default: 2.5,
    },
  },
  { timestamps: true },
);

export const Flashcard = mongoose.model("Flashcard", flashcardSchema);

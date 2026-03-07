import mongoose from "mongoose";

const reviewLogSchema = new mongoose.Schema(
  {
    flashcardId: {
      type: Schema.Types.ObjectId,
      ref: "Flashcard",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    quality: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      index: true,
    },

    timeSpent: {
      type: Number,
      min: 0,
    },
    previousInterval: Number,
    newInterval: Number,
    previousEaseFactor: Number,
    newEaseFactor: Number,
  },

  { timestamps: true },
);

export const ReviewLog = mongoose.model("ReviewLog", reviewLogSchema);

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
    revisionMark: {
      type: Boolean,
      default: false,
    },
    nextReview: {
      type: Date,
      default: Date.now,
    },
    interval: {
      type: Number,
      default: 1,
      min: 1,
    },
    easeScore: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },
    repetitions: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

/**
 * SM-2 Spaced Repetition Scheduling
 *
 * @param {number} quality - Rating from 0–5
 *   0: Complete blackout
 *   1: Incorrect, but answer was familiar
 *   2: Incorrect, but answer was easy to recall after seeing it
 *   3: Correct, but required significant difficulty
 *   4: Correct, with some hesitation
 *   5: Perfect recall
 */
flashcardSchema.methods.updateReview = async function (quality) {
  if (quality < 0 || quality > 5) {
    throw new RangeError("Quality rating must be between 0 and 5.");
  }

  if (quality < 3) {
    this.repetitions = 0;
    this.interval = 1;
  } else {
    if (this.repetitions === 0) {
      this.interval = 1;
    } else if (this.repetitions === 1) {
      this.interval = 6;
    } else {
      this.interval = Math.round(this.interval * this.easeScore);
    }

    this.repetitions += 1;
  }

  const newEase =
    this.easeScore + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  this.easeScore = Math.max(1.3, parseFloat(newEase.toFixed(2)));

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + this.interval);
  this.nextReview = nextReviewDate;

  return await this.save();
};

export const Flashcard = mongoose.model("Flashcard", flashcardSchema);

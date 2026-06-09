import mongoose from "mongoose";

const embeddingSchema = new mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Embedding",
  embeddingSchema
);
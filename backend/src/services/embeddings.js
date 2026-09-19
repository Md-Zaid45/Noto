import ApiError from "../utils/ApiError.js";
import { Embedding } from "../models/embedding.model.js";
import logger from "../utils/logger.js";

export const getTextBlocks = (doc) => {
  const blocks = [];

  doc.content.forEach((node) => {
    if (node.type === "paragraph" || node.type === "heading") {
      const text = extractText(node);

      if (text.trim()) {
        blocks.push({
          text,
        });
      }
    }
  });

  return blocks;
};

export function extractText(node) {
  let text = "";

  if (node.text) {
    text += node.text;
  }

  if (node.content) {
    for (const child of node.content) {
      text += extractText(child);
    }
  }

  return text;
}
export function getText(jsonDoc) {
  const blocks = getTextBlocks(jsonDoc);
  let text = "";
  blocks.forEach((block) => (text = text.concat(block.text)));
  return text;
}

export function getTextFromEmbedding(embeddings) {
  let text = "";

  embeddings.forEach((embedding) => {
    text = text.concat(embedding.chunkIndex + ". " + embedding.text + "\n");
  });
  return text;
}

import ai from "../GenAI/connection.js";
import mongoose from "mongoose";

const EMBEDDING_MODEL = "text-embedding-3-small";

export const generateEmbeddings = async (doc) => {
  const start = Date.now();
  try {
    const blocks = getTextBlocks(doc.content);
    logger.debug(
      { noteId: doc._id, blockCount: blocks.length },
      "embedding generation started",
    );
    if (!blocks.length) {
      return [];
    }
    const embeddings = await Promise.all(
      blocks.map(async (block, index) => {
        const response = await ai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: block.text,
        });
        return {
          noteId: doc._id,
          userId: doc.userId,
          chunkIndex: index,
          text: block.text,
          embedding: response.data[0].embedding,
        };
      }),
    );
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logger.info(
      {
        noteId: doc._id,
        chunkCount: embeddings.length,
        embeddingDimension: embeddings[0]?.embedding?.length,
        duration: `${duration}s`,
      },
      "embeddings generated",
    );
    return embeddings;
  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logger.error(
      { err: error, noteId: doc._id, duration: `${duration}s` },
      "embedding generation failed",
    );
    throw new ApiError(500, "Failed to generate embeddings");
  }
};

export const getRelevantEmbeddings = async (query, userId, noteId) => {
  const start = Date.now();
  logger.debug(
    { queryLength: query.length, userId, noteId },
    "vector search started",
  );
  try {
    const response = await ai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: query,
    });

    const queryVector = response.data[0].embedding;

    const noteEmbeddings = await Embedding.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 200,
          limit: 8,
          filter: {
            userId: new mongoose.Types.ObjectId(userId),
            noteId: new mongoose.Types.ObjectId(noteId),
          },
        },
      },
      {
        $project: {
          text: 1,
          chunkIndex: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    const scores = noteEmbeddings.map((e) => e.score);

    logger.info(
      {
        queryLength: query.length,
        resultCount: noteEmbeddings.length,
        topScore: scores[0] ?? null,
        scores,
        duration: `${duration}s`,
      },
      "vector search completed",
    );

    return noteEmbeddings;
  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logger.error(
      { err: error, queryLength: query.length, userId, noteId, duration: `${duration}s` },
      "vector search failed",
    );
    throw new ApiError(500, "Unable to search embeddings");
  }
};

export const createUpdateEmbeddings = async (note) => {
  const start = Date.now();
  logger.info({ noteId: note._id }, "embedding index started");
  try {
    const docs = await generateEmbeddings(note);
    if (!docs?.length)
      throw new ApiError(500, "Got empty embeddings from ai model");

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const deleted = await Embedding.deleteMany({
        userId: note.userId,
        noteId: note._id,
      });
      await Embedding.insertMany(docs);
      note.isIndexed = true;
      await note.save();
      logger.debug(
        { noteId: note._id, deleted: deleted.deletedCount, inserted: docs.length },
        "embedding transaction completed",
      );
    });

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logger.info(
      { noteId: note._id, chunks: docs.length, isIndexed: true, duration: `${duration}s` },
      "embedding index completed",
    );

    const embeddings = docs.map((doc) => doc.embedding);
    return embeddings;
  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    logger.error(
      { err: error, noteId: note._id, duration: `${duration}s` },
      "embedding index failed",
    );
    throw error;
  }
};

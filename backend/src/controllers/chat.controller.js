import { Flashcard } from "../models/flashcard.model.js";
import { Note } from "../models/note.model.js";
import {
  createUpdateEmbeddings,
  getRelevantEmbeddings,
  getText,
  getTextFromEmbedding,
} from "../services/embeddings.js";
import ApiError from "../utils/ApiError.js";
import {
  answerQuestion,
  generateFlashcards,
  generateQuiz,
  summariseNote,
} from "../services/chat_services.js";
import { Chat } from "../models/chats.model.js";
import logger from "../utils/logger.js";

export const getAiFlashcards = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { count } = req.body;
    logger.info({ userId: req.user._id, noteId: id, count }, "flashcards request");
    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) throw new ApiError(404, "No note found");
    const context = getText(note.content);
    const generatedFlashcards = await generateFlashcards(context, count);
    if (!generatedFlashcards || !generatedFlashcards.length)
      return res.json({ success: false, message: "No flashcards generated" });
    const newFlashcards = await Flashcard.insertMany(
      generatedFlashcards.map((card) => ({
        userId: req.user._id,
        question: card.question,
        answer: card.answer,
        noteId: id,
      })),
    );
    if (!newFlashcards || !newFlashcards.length)
      throw new ApiError(500, "Error in saving flashcards to db");
    logger.info({ noteId: id, saved: newFlashcards.length }, "flashcards saved");
    return res.status(200).json({
      success: true,
      message: "Flashcards generated successfully",
      newFlashcards,
    });
  } catch (error) {
    next(error);
  }
};

export const getAiQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { count } = req.body;
    logger.info({ userId: req.user._id, noteId: id, count }, "quiz request");
    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) throw new ApiError(404, "No note found");
    const context = getText(note.content);
    const generatedQuiz = await generateQuiz(context, count);
    if (!generatedQuiz || !generatedQuiz.length)
      return res.json({ success: false, message: "No quiz generated" });
    logger.info({ noteId: id, questionCount: generatedQuiz.length }, "quiz generated");
    return res.status(200).json({
      success: true,
      message: "Quiz generated successfully",
      quiz: generatedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info({ userId: req.user._id, noteId: id }, "summary request");
    const noteDoc = await Note.findOne({ _id: id, userId: req.user._id }).select("content");
    if (!noteDoc?.content) {
      logger.debug({ noteId: id }, "summary skipped: no content");
      return res
        .status(200)
        .json({
          success: true,
          message: "No content to summarize! Add some text to use this feature",
        });
    }
    const context = getText(noteDoc.content);
    const summary = await summariseNote(context);
    if (!summary) throw new ApiError(500, "Failed to generate summary");
    logger.info({ noteId: id, summaryLength: summary.length }, "summary completed");
    return res.status(200).json({
      success: true,
      payload: {
        summary,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const chatResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { query } = req.body;
    logger.info(
      { userId: req.user._id, noteId: id, query: query?.slice(0, 100) },
      "chat request",
    );
    if (!query?.trim()) {
      throw new ApiError(400, "Query is required");
    }
    let contextText = "";
    if (id) {
      const note = await Note.findOne({ userId: req.user._id, _id: id });

      if (!note) throw new ApiError(404, "No note found for QnA");

      logger.debug({ noteId: id, isIndexed: note.isIndexed }, "chat index status");

      if (!note?.isIndexed) {
        await createUpdateEmbeddings(note);
      }

      const contextEmbeddings = await getRelevantEmbeddings(
        query,
        req.user._id,
        id,
      );
      contextText = getTextFromEmbedding(contextEmbeddings);
      logger.debug({ noteId: id, contextLength: contextText.length }, "context retrieved");
    }

    let chat = await Chat.findOne({ userId: req.user._id, noteId: id });
    if (!chat) {
      chat = await Chat.create({
        userId: req.user._id,
        noteId: id,
        name: "New chat",
        history: [{ role: "user", content: query }],
      });
      logger.debug({ noteId: id }, "new chat created");
    } else {
      chat.history.push({ role: "user", content: query });
      await chat.save();
    }

    logger.debug(
      { noteId: id, historyTurns: chat.history.length },
      "calling ai for answer",
    );

    const answer = await answerQuestion(query, contextText, chat.history);
    if (!answer) {
      logger.warn({ noteId: id, query: query?.slice(0, 100) }, "ai returned null answer");
      return res.status(200).json({
        success: true,
        payload: { answer: "Try again later" },
      });
    }

    chat.history.push({ role: "assistant", content: answer.answer });
    await chat.save();

    logger.info(
      { noteId: id, answerLength: answer.answer.length, confidence: answer.confidence },
      "chat completed",
    );

    return res.status(200).json({
      success: true,
      payload: {
        answer: answer.answer,
      },
    });
  } catch (error) {
    return next(error);
  }
};

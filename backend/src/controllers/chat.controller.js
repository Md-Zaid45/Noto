import { Embedding } from "../models/embedding.model.js";
import { Flashcard } from "../models/flashcard.model.js";
import { Note } from "../models/note.model.js";
import {
  createUpdateEmbeddings,
  generateEmbeddings,
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
import { User } from "../models/user.model.js";

export const getAiFlashcards = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { count } = req.body;
    const note = await Note.findById(id);
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
    const note = await Note.findById(id);
    if (!note) throw new ApiError(404, "No note found");
    const context = getText(note.content);
    const generatedQuiz = await generateQuiz(context, count);
    if (!generatedQuiz || !generatedQuiz.length)
      return res.json({ success: false, message: "No quiz generated" });
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
    const noteDoc = await Note.findById(id).select("content");
    if (!noteDoc.content)
      return res
        .status(200)
        .json({
          success: true,
          message: "No content to summarize! Add some text to use this feature",
        });
    const context = getText(noteDoc.content);
    const summary = await summariseNote(context);
    if (!summary) throw new ApiError(500, "Failed to generate summary");
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
    if (!query?.trim()) {
      throw new ApiError(400, "Query is required");
    }
    let contextText = "";
    if (id) {
      const note = await Note.findOne({ userId: req.user._id, _id: id });

      if (!note) throw new ApiError(404, "No note found for QnA");

      if (!note?.isIndexed) {
        const genneratedEmbeddings = await createUpdateEmbeddings(note);
        const contextEmbeddings = await getRelevantEmbeddings(
          query,
          req.user._id,
          id,
        );
        // if (!contextEmbeddings.length) {
        //   contextEmbeddings = await generatedEmbeddings;
        // }
        contextText = getTextFromEmbedding(contextEmbeddings);
      } else {
        const contextEmbeddings = await getRelevantEmbeddings(
          query,
          req.user._id,
          id,
        );
        contextText = getTextFromEmbedding(contextEmbeddings);
      }
    }

    let chat = await Chat.findOne({ userId: req.user._id, noteId: id });
    if (!chat)
      chat = await Chat.create({
        userId: req.user._id,
        noteId: id,
        name: "New chat",
        history: [{ role: "user", content: query }],
      });
    else {
      chat.history.push({ role: "user", content: query });
      await chat.save();
    }

    const answer = await answerQuestion(query, contextText, chat.history);
    if (!answer)
      return res.status(200).json({ 
        success: true,
        payload: { answer: "Try again later" } 
      });
    return res.status(200).json({
      success: true,
      payload: {
        answer: answer.answer,
      },
    });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};

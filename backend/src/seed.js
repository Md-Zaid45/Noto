import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import { User } from "./models/user.model.js";
import { Folder } from "./models/folder.model.js";
import { Note } from "./models/note.model.js";
import { Flashcard } from "./models/flashcard.model.js";
import { Chat } from "./models/chats.model.js";
import { folderDefs } from "./seed-data/folders.js";
import { note1, note2, note3, note4, note5 } from "./seed-data/notes-a.js";
import { note6, note7, note8, note9, note10 } from "./seed-data/notes-b.js";
import { getFlashcards } from "./seed-data/flashcards.js";
import { getChats } from "./seed-data/chats.js";

dotenv.config({ path: "./.env" });

const EMAIL = "demo@example.com";
const PASSWORD = "demo1234";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI + "/" + DB_NAME);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: EMAIL });
    if (existing) {
      await Note.deleteMany({ userId: existing._id });
      await Folder.deleteMany({ userId: existing._id });
      await Flashcard.deleteMany({ userId: existing._id });
      await Chat.deleteMany({ userId: existing._id });
      await User.deleteOne({ _id: existing._id });
      console.log("Cleared existing demo data");
    }

    const user = await User.create({ name: "Demo User", email: EMAIL, password: PASSWORD });
    console.log("Created user:", EMAIL, "/ password:", PASSWORD);

    // Create folders
    const folderMap = {};
    for (const def of folderDefs) {
      const folder = await Folder.create({
        userId: user._id,
        name: def.name,
        folderId: def.parent ? folderMap[def.parent] : null,
      });
      folderMap[def.name] = folder._id;
    }
    console.log("Created", folderDefs.length, "folders");

    // Create notes
    const allNotes = [note1, note2, note3, note4, note5, note6, note7, note8, note9, note10];
    const createdNotes = [];
    for (const note of allNotes) {
      const created = await Note.create({
        userId: user._id,
        name: note.name,
        folderId: note.folder ? folderMap[note.folder] : null,
        content: note.content,
      });
      createdNotes.push(created);
    }
    console.log("Created", createdNotes.length, "notes");

    // Create flashcards
    const flashcardDefs = getFlashcards(createdNotes.map((n) => n._id));
    const flashcards = await Flashcard.insertMany(
      flashcardDefs.map((fc) => ({ ...fc, userId: user._id }))
    );
    console.log("Created", flashcards.length, "flashcards");

    // Create chats
    const chatDefs = getChats(createdNotes.map((n) => n._id));
    for (const chat of chatDefs) {
      await Chat.create({
        userId: user._id,
        noteId: chat.noteId,
        name: chat.name,
        history: chat.history,
      });
    }
    console.log("Created", chatDefs.length, "chats");

    console.log("\n--- Seed Complete ---");
    console.log("Email:   ", EMAIL);
    console.log("Password:", PASSWORD);
    console.log("User ID: ", user._id);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();